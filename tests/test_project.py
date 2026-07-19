"""
Pytest configuration for Aayush Portfolio project.
Includes unit and integration tests for FastAPI backend.
"""

import pytest
import os
import sys
from fastapi.testclient import TestClient

# Add backend directory to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../React-Portfolio-main/server")))

from main import app, ADMIN_USERNAME, ADMIN_PASSWORD

client = TestClient(app)


def test_import_app():
    """Verify app can be imported without errors."""
    assert app is not None


def test_project_structure():
    """Verify essential project files exist."""
    required_files = [
        "React-Portfolio-main/client/package.json",
        "React-Portfolio-main/client/src/App.jsx",
        ".github/workflows/ci.yml",
    ]
    
    for file in required_files:
        assert os.path.exists(file), f"Missing required file: {file}"


def test_api_health_check():
    """Verify backend health check works and returns standard format."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "timestamp" in data


def test_projects_data_validation():
    """Verify that projects endpoint returns valid project configurations."""
    response = client.get("/api/projects")
    assert response.status_code == 200
    projects = response.json()
    assert isinstance(projects, list)
    
    if len(projects) > 0:
        for project in projects:
            assert "id" in project
            assert "title" in project
            assert "category" in project
            assert "image" in project
            assert "description" in project
            assert "tags" in project
            assert "demoUrl" in project
            assert "githubUrl" in project


def test_login_success():
    """Verify login succeeds with correct credentials and returns JWT token."""
    response = client.post(
        "/api/login",
        json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_failure():
    """Verify login fails with incorrect credentials."""
    response = client.post(
        "/api/login",
        json={"username": "wronguser", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert "detail" in response.json()


def test_get_messages_unauthorized():
    """Verify /api/messages requires authentication."""
    # Test with no token
    response = client.get("/api/messages")
    assert response.status_code == 401
    
    # Test with invalid token
    response = client.get(
        "/api/messages",
        headers={"Authorization": "Bearer invalidtoken123"}
    )
    assert response.status_code == 401


def test_get_messages_authorized():
    """Verify that authenticated requests can fetch messages successfully."""
    # First login to get a valid token
    login_response = client.post(
        "/api/login",
        json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    
    # Then query messages with the token
    response = client.get(
        "/api/messages",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    messages = response.json()
    assert isinstance(messages, list)


def test_contact_form_submission_validation():
    """Verify contact form submissions undergo correct schema validations."""
    # Test invalid email validation
    response = client.post(
        "/api/contact",
        json={"name": "Alice", "email": "not-an-email", "message": "Short msg"}
    )
    assert response.status_code == 422
    
    # Test short message validation
    response = client.post(
        "/api/contact",
        json={"name": "Alice", "email": "alice@example.com", "message": "Short"}
    )
    assert response.status_code == 422
