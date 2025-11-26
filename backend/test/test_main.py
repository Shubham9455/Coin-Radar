from fastapi.testclient import TestClient
from main import app
from test.test_config import client




def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200, "Health check endpoint failed"
    assert response.json() == {"status": "healthy"}