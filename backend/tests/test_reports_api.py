"""Simplified comprehensive tests for reports management endpoints."""
import pytest
import sys
import os
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from main import app
from core.security import create_access_token


@pytest.fixture
def client():
    """Provide TestClient for API testing."""
    return TestClient(app)


@pytest.fixture
def analyst_token():
    """Create analyst token."""
    return create_access_token({
        "sub": "analyst@example.com",
        "user_id": "analyst_123",
        "role": "Security Analyst"
    })


@pytest.fixture
def admin_token():
    """Create admin token."""
    return create_access_token({
        "sub": "admin@example.com",
        "user_id": "admin_123",
        "role": "Administrator"
    })


class TestReportHistory:
    """Tests for report history endpoints."""

    def test_get_report_history_unauthorized(self, client):
        """Test getting report history without authentication."""
        response = client.get("/api/reports/history")
        assert response.status_code == 401

    def test_get_report_history_auth_required(self, client):
        """Test that report history requires authentication."""
        # No token provided
        response = client.get("/api/reports/history")
        assert response.status_code == 401



