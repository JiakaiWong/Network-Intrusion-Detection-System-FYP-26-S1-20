import pytest
import sys
import os
from unittest.mock import patch, AsyncMock

# Add backend to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from services.user_service import (
    create_user,
    validate_password_strength,
    validate_full_name
)


class TestPasswordValidation:
    """Tests for password strength validation."""

    def test_password_too_short(self):
        """Password must be at least 8 characters."""
        with pytest.raises(ValueError, match="at least 8 characters"):
            validate_password_strength("Pass1!")

    def test_password_missing_lowercase(self):
        """Password must contain lowercase letter."""
        with pytest.raises(ValueError, match="lowercase letter"):
            validate_password_strength("PASSWORD123!")

    def test_password_missing_uppercase(self):
        """Password must contain uppercase letter."""
        with pytest.raises(ValueError, match="uppercase letter"):
            validate_password_strength("password123!")

    def test_password_missing_digit(self):
        """Password must contain at least one digit."""
        with pytest.raises(ValueError, match="digit"):
            validate_password_strength("PassWord!")

    def test_password_missing_special_char(self):
        """Password must contain special character."""
        with pytest.raises(ValueError, match="special character"):
            validate_password_strength("Password123")

    def test_password_valid(self):
        """Valid password should not raise exception."""
        validate_password_strength("TestPass123!")
        # If no exception is raised, test passes


class TestFullNameValidation:
    """Tests for full name validation."""

    def test_full_name_too_short(self):
        """Full name must be at least 2 characters."""
        with pytest.raises(ValueError, match="at least 2 characters"):
            validate_full_name("A")

    def test_full_name_too_long(self):
        """Full name must not exceed 100 characters."""
        with pytest.raises(ValueError, match="exceed 100 characters"):
            validate_full_name("A" * 101)

    def test_full_name_invalid_characters(self):
        """Full name can only contain letters, spaces, hyphens, apostrophes."""
        with pytest.raises(ValueError, match="can only contain letters"):
            validate_full_name("John123")

    def test_full_name_valid(self):
        """Valid full names should not raise exception."""
        validate_full_name("John Doe")
        validate_full_name("Mary-Jane")
        validate_full_name("O'Brien")


class TestCreateUser:
    """Integration tests for user creation."""

    @pytest.mark.asyncio
    async def test_create_user_success(self, mock_user_data):
        """Successfully create a user with valid data."""
        with patch('services.user_service.db') as mock_db:
            mock_insert = AsyncMock()
            mock_insert.return_value.inserted_id = "test_id_123"
            mock_db.users.find_one = AsyncMock(return_value=None)
            mock_db.users.insert_one = mock_insert

            result = await create_user(
                mock_user_data["email"],
                mock_user_data["password"],
                mock_user_data["full_name"],
                mock_user_data["role"]
            )

            assert result["email"] == mock_user_data["email"]
            assert result["full_name"] == mock_user_data["full_name"]
            assert result["role"] == mock_user_data["role"]
            assert result["id"] == "test_id_123"
            mock_db.users.insert_one.assert_called_once()

    @pytest.mark.asyncio
    async def test_create_user_email_already_exists(self, mock_user_data):
        """Should raise ValueError if email already exists."""
        with patch('services.user_service.db') as mock_db:
            mock_db.users.find_one = AsyncMock(return_value={"email": mock_user_data["email"]})

            with pytest.raises(ValueError, match="Email already exists"):
                await create_user(
                    mock_user_data["email"],
                    mock_user_data["password"],
                    mock_user_data["full_name"],
                    mock_user_data["role"]
                )

            mock_db.users.insert_one.assert_not_called()

    @pytest.mark.asyncio
    async def test_create_user_invalid_password(self, mock_user_data):
        """Should raise ValueError for weak password."""
        with patch('services.user_service.db') as mock_db:
            mock_db.users.find_one = AsyncMock(return_value=None)

            with pytest.raises(ValueError, match="Password must"):
                await create_user(
                    mock_user_data["email"],
                    "weak",  # Invalid password
                    mock_user_data["full_name"],
                    mock_user_data["role"]
                )

            mock_db.users.insert_one.assert_not_called()

    @pytest.mark.asyncio
    async def test_create_user_whitespace_trimming(self, mock_user_data):
        """Should trim whitespace from user input."""
        with patch('services.user_service.db') as mock_db:
            mock_insert = AsyncMock()
            mock_insert.return_value.inserted_id = "test_id_123"
            mock_db.users.find_one = AsyncMock(return_value=None)
            mock_db.users.insert_one = mock_insert

            result = await create_user(
                f"  {mock_user_data['email']}  ",
                f"  {mock_user_data['password']}  ",
                f"  {mock_user_data['full_name']}  ",
                f"  {mock_user_data['role']}  "
            )

            # Verify the trimmed values were used
            call_args = mock_db.users.insert_one.call_args[0][0]
            assert call_args["email"] == mock_user_data["email"]
            assert call_args["full_name"] == mock_user_data["full_name"]
