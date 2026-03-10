import pytest
import sys
import os
from fastapi.testclient import TestClient
from datetime import datetime, timedelta
from unittest.mock import patch, AsyncMock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from main import app
from core.security import verify_token, hash_password


@pytest.fixture
def client():
    """Provide TestClient for API testing."""
    return TestClient(app)


def test_register_and_login_sequence(client, mock_user_data):
    """Test sequential login: register user, then login with correct credentials."""
    with patch('services.user_service.db') as mock_db:
        mock_db.users.find_one = AsyncMock(return_value=None)
        mock_db.users.insert_one = AsyncMock()
        mock_db.users.insert_one.return_value.inserted_id = "test_id_123"
        
        hashed_pwd = hash_password(mock_user_data["password"])
        
        register_response = client.post(
            "/api/auth/register",
            json={
                "email": mock_user_data["email"],
                "password": mock_user_data["password"],
                "full_name": mock_user_data["full_name"],
                "role": mock_user_data["role"]
            }
        )
        
        assert register_response.status_code == 201
        register_data = register_response.json()
        assert register_data["email"] == mock_user_data["email"]
        
        with patch('services.auth_service.get_user_by_email') as mock_get_user:
            mock_get_user.return_value = {
                "_id": "test_id_123",
                "email": mock_user_data["email"],
                "hashed_password": hashed_pwd,
                "full_name": mock_user_data["full_name"],
                "role": mock_user_data["role"]
            }
            
            login_response = client.post(
                "/api/auth/login",
                json={
                    "email": mock_user_data["email"],
                    "password": mock_user_data["password"]
                }
            )
            
            assert login_response.status_code == 200
            login_data = login_response.json()
            assert "token" in login_data


def test_login_with_correct_credentials(client, mock_user_data):
    """Test login with correct email and password."""
    hashed_pwd = hash_password(mock_user_data["password"])
    
    with patch('services.auth_service.get_user_by_email') as mock_get_user:
        mock_get_user.return_value = {
            "_id": "test_id_123",
            "email": mock_user_data["email"],
            "hashed_password": hashed_pwd,
            "full_name": mock_user_data["full_name"],
            "role": mock_user_data["role"]
        }
        
        response = client.post(
            "/api/auth/login",
            json={
                "email": mock_user_data["email"],
                "password": mock_user_data["password"]
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"]["email"] == mock_user_data["email"]


def test_login_with_invalid_email(client, mock_user_data):
    """Test login with non-existent email returns 401."""
    with patch('services.auth_service.get_user_by_email') as mock_get_user:
        mock_get_user.return_value = None
        
        response = client.post(
            "/api/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": mock_user_data["password"]
            }
        )
        
        assert response.status_code == 401


def test_login_with_wrong_password(client, mock_user_data):
    """Test login with correct email but wrong password returns 401."""
    hashed_pwd = hash_password(mock_user_data["password"])
    
    with patch('services.auth_service.get_user_by_email') as mock_get_user:
        mock_get_user.return_value = {
            "_id": "test_id_123",
            "email": mock_user_data["email"],
            "hashed_password": hashed_pwd,
            "full_name": mock_user_data["full_name"],
            "role": mock_user_data["role"]
        }
        
        response = client.post(
            "/api/auth/login",
            json={
                "email": mock_user_data["email"],
                "password": "WrongPassword123!"
            }
        )
        
        assert response.status_code == 401


def test_login_with_empty_email(client):
    """Test login with empty email field."""
    response = client.post(
        "/api/auth/login",
        json={"email": "", "password": "TestPass123!"}
    )
    assert response.status_code == 422


def test_login_with_empty_password(client, mock_user_data):
    """Test login with empty password field."""
    hashed_pwd = hash_password(mock_user_data["password"])
    
    with patch('services.auth_service.get_user_by_email') as mock_get_user:
        mock_get_user.return_value = {
            "_id": "test_id_123",
            "email": mock_user_data["email"],
            "hashed_password": hashed_pwd,
            "full_name": mock_user_data["full_name"],
            "role": mock_user_data["role"]
        }
        
        response = client.post(
            "/api/auth/login",
            json={"email": mock_user_data["email"], "password": ""}
        )
        
        assert response.status_code == 401


def test_login_with_missing_email_field(client):
    """Test login without email field."""
    response = client.post(
        "/api/auth/login",
        json={"password": "TestPass123!"}
    )
    assert response.status_code == 422


def test_login_with_missing_password_field(client, mock_user_data):
    """Test login without password field."""
    response = client.post(
        "/api/auth/login",
        json={"email": mock_user_data["email"]}
    )
    assert response.status_code == 422


def test_login_with_invalid_email_format(client):
    """Test login with invalid email format."""
    response = client.post(
        "/api/auth/login",
        json={"email": "not-an-email", "password": "TestPass123!"}
    )
    assert response.status_code == 422


def test_login_returns_valid_jwt_token(client, mock_user_data):
    """Test that login returns a valid JWT token."""
    hashed_pwd = hash_password(mock_user_data["password"])
    
    with patch('services.auth_service.get_user_by_email') as mock_get_user:
        mock_get_user.return_value = {
            "_id": "test_id_123",
            "email": mock_user_data["email"],
            "hashed_password": hashed_pwd,
            "full_name": mock_user_data["full_name"],
            "role": mock_user_data["role"]
        }
        
        response = client.post(
            "/api/auth/login",
            json={
                "email": mock_user_data["email"],
                "password": mock_user_data["password"]
            }
        )
        
        assert response.status_code == 200
        token = response.json()["token"]
        payload = verify_token(token)
        assert payload is not None
        assert payload["sub"] == mock_user_data["email"]


def test_login_token_has_correct_expiry(client, mock_user_data):
    """Test that token expiration is set correctly."""
    hashed_pwd = hash_password(mock_user_data["password"])
    
    with patch('services.auth_service.get_user_by_email') as mock_get_user:
        mock_get_user.return_value = {
            "_id": "test_id_123",
            "email": mock_user_data["email"],
            "hashed_password": hashed_pwd,
            "full_name": mock_user_data["full_name"],
            "role": mock_user_data["role"]
        }
        
        response = client.post(
            "/api/auth/login",
            json={
                "email": mock_user_data["email"],
                "password": mock_user_data["password"]
            }
        )
        
        assert response.status_code == 200
        token = response.json()["token"]
        payload = verify_token(token)
        exp_time = datetime.utcfromtimestamp(payload["exp"])
        current_time = datetime.utcnow()
        time_diff = (exp_time - current_time).total_seconds()
        assert 1700 < time_diff < 1900


def test_multiple_sequential_logins(client, mock_user_data):
    """Test multiple sequential logins with same credentials."""
    hashed_pwd = hash_password(mock_user_data["password"])
    
    with patch('services.auth_service.get_user_by_email') as mock_get_user:
        mock_get_user.return_value = {
            "_id": "test_id_123",
            "email": mock_user_data["email"],
            "hashed_password": hashed_pwd,
            "full_name": mock_user_data["full_name"],
            "role": mock_user_data["role"]
        }
        
        for i in range(3):
            response = client.post(
                "/api/auth/login",
                json={
                    "email": mock_user_data["email"],
                    "password": mock_user_data["password"]
                }
            )
            
            assert response.status_code == 200
            token = response.json()["token"]
            payload = verify_token(token)
            assert payload is not None
            assert payload["sub"] == mock_user_data["email"]


def test_login_response_structure(client, mock_user_data):
    """Test that login response has correct structure."""
    hashed_pwd = hash_password(mock_user_data["password"])
    
    with patch('services.auth_service.get_user_by_email') as mock_get_user:
        mock_get_user.return_value = {
            "_id": "test_id_123",
            "email": mock_user_data["email"],
            "hashed_password": hashed_pwd,
            "full_name": mock_user_data["full_name"],
            "role": mock_user_data["role"]
        }
        
        response = client.post(
            "/api/auth/login",
            json={
                "email": mock_user_data["email"],
                "password": mock_user_data["password"]
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "token" in data
        assert isinstance(data["token"], str)
        assert "user" in data
        user = data["user"]
        assert "id" in user
        assert "email" in user
        assert "full_name" in user
        assert "role" in user
