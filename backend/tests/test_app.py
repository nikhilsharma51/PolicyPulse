"""Unit tests for PolicyPulse RAG pipeline"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.ingest import chunk_pages
from app.config import EMBEDDING_DIM

client = TestClient(app)

# --- Health Check Tests ---

def test_health_check():
    """Health endpoint returns valid response"""
    response = client.get("/health")
    assert response.status_code in [200, 503]
    data = response.json()
    assert "status" in data
    assert "services" in data
    assert "timestamp" in data


def test_health_has_database_status():
    """Health check includes database status"""
    response = client.get("/health")
    data = response.json()
    assert "database" in data["services"]


# --- Input Validation Tests ---

def test_query_empty_question():
    """Query with empty question should fail with 400"""
    response = client.post(
        "/query",
        json={"question": "", "doc_id": "550e8400-e29b-41d4-a716-446655440000"},
        headers={"Authorization": "Bearer test-key-123"}
    )
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


def test_query_invalid_uuid():
    """Query with invalid UUID should fail with 400"""
    response = client.post(
        "/query",
        json={"question": "What is this?", "doc_id": "not-a-uuid"},
        headers={"Authorization": "Bearer test-key-123"}
    )
    assert response.status_code == 400
    assert "uuid" in response.json()["detail"].lower()


def test_query_missing_question_field():
    """Query without question field should fail"""
    response = client.post(
        "/query",
        json={"doc_id": "550e8400-e29b-41d4-a716-446655440000"},
        headers={"Authorization": "Bearer test-key-123"}
    )
    assert response.status_code == 400


def test_query_missing_doc_id_field():
    """Query without doc_id field should fail"""
    response = client.post(
        "/query",
        json={"question": "What is this?"},
        headers={"Authorization": "Bearer test-key-123"}
    )
    assert response.status_code == 400


def test_query_too_long_question():
    """Query with question > 1000 chars should fail"""
    long_question = "a" * 1001
    response = client.post(
        "/query",
        json={"question": long_question, "doc_id": "550e8400-e29b-41d4-a716-446655440000"},
        headers={"Authorization": "Bearer test-key-123"}
    )
    assert response.status_code == 400
    assert "1000" in response.json()["detail"]


# --- Chunking Tests ---

def test_chunk_pages_empty():
    """Chunking empty pages should return empty list"""
    result = chunk_pages([])
    assert result == []


def test_chunk_pages_single_page():
    """Chunking single page should produce chunks"""
    pages = [{"text": "This is a test document with some content that will be chunked.", "page_number": 1}]
    result = chunk_pages(pages)
    assert len(result) > 0
    assert all("content" in c for c in result)
    assert all("page_number" in c for c in result)
    assert all("chunk_index" in c for c in result)


def test_chunk_pages_multiple_pages():
    """Chunking multiple pages should work"""
    pages = [
        {"text": "First page content with some text.", "page_number": 1},
        {"text": "Second page content with different text.", "page_number": 2},
    ]
    result = chunk_pages(pages)
    assert len(result) > 0
    assert all(c["page_number"] in [1, 2] for c in result)


def test_chunk_pages_preserves_metadata():
    """Chunks should preserve page numbers"""
    pages = [{"text": "Page one content.", "page_number": 5}]
    result = chunk_pages(pages)
    assert all(c["page_number"] == 5 for c in result)


# --- Authentication Tests ---

def test_query_without_api_key():
    """Request without API key should be rejected with 403"""
    response = client.post(
        "/query",
        json={"question": "test?", "doc_id": "550e8400-e29b-41d4-a716-446655440000"}
    )
    assert response.status_code == 403


def test_query_with_invalid_api_key():
    """Request with invalid API key should be rejected with 403"""
    response = client.post(
        "/query",
        json={"question": "test?", "doc_id": "550e8400-e29b-41d4-a716-446655440000"},
        headers={"Authorization": "Bearer wrong-key"}
    )
    assert response.status_code == 403


def test_query_with_valid_api_key():
    """Request with valid API key should not return 403"""
    response = client.post(
        "/query",
        json={"question": "test?", "doc_id": "550e8400-e29b-41d4-a716-446655440000"},
        headers={"Authorization": "Bearer test-key-123"}
    )
    # Will fail with 500 (document not in DB) but not 403
    assert response.status_code != 403


def test_documents_without_api_key():
    """Documents endpoint without API key should be rejected"""
    response = client.get("/documents")
    assert response.status_code == 403


def test_documents_with_valid_api_key():
    """Documents endpoint with valid API key should work"""
    response = client.get(
        "/documents",
        headers={"Authorization": "Bearer test-key-123"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


# --- Rate Limiting Tests ---

def test_health_endpoint_accessible():
    """Health endpoint should be accessible without rate limit issues"""
    # Fire 50 requests to health endpoint
    for _ in range(50):
        response = client.get("/health")
        assert response.status_code in [200, 503]


# --- Error Handling Tests ---

def test_query_with_valid_format_but_missing_document():
    """Query for non-existent document should not crash"""
    response = client.post(
        "/query",
        json={"question": "What is this?", "doc_id": "00000000-0000-0000-0000-000000000000"},
        headers={"Authorization": "Bearer test-key-123"}
    )
    # Should return streaming response or error, not 500
    assert response.status_code != 500 or response.status_code == 200


def test_invalid_json_request():
    """Invalid JSON request should return 400"""
    response = client.post(
        "/query",
        data="not-json",
        headers={
            "Authorization": "Bearer test-key-123",
            "Content-Type": "application/json"
        }
    )
    assert response.status_code == 400


# --- API Response Format Tests ---

def test_health_response_format():
    """Health response should have correct format"""
    response = client.get("/health")
    data = response.json()
    assert "status" in data
    assert data["status"] in ["healthy", "degraded"]
    assert "services" in data
    assert isinstance(data["services"], dict)


def test_documents_response_is_list():
    """Documents endpoint should return list"""
    response = client.get(
        "/documents",
        headers={"Authorization": "Bearer test-key-123"}
    )
    assert isinstance(response.json(), list)


# --- Edge Cases ---

def test_query_with_whitespace_only_question():
    """Query with only whitespace should fail"""
    response = client.post(
        "/query",
        json={"question": "   ", "doc_id": "550e8400-e29b-41d4-a716-446655440000"},
        headers={"Authorization": "Bearer test-key-123"}
    )
    assert response.status_code == 400


def test_query_with_valid_uuid_format_uppercase():
    """Query with uppercase UUID should work"""
    response = client.post(
        "/query",
        json={"question": "test?", "doc_id": "550E8400-E29B-41D4-A716-446655440000"},
        headers={"Authorization": "Bearer test-key-123"}
    )
    # UUID validation should handle both cases
    assert response.status_code != 400


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
