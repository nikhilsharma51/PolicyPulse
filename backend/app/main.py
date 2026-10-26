import os
import uuid as uuid_module
from datetime import datetime
import time

from fastapi import BackgroundTasks, FastAPI, HTTPException, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.security import HTTPBearer
from pydantic import BaseModel, validator
from starlette.middleware.base import BaseHTTPMiddleware

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.generate import stream_answer
from app.ingest import router as ingest_router
from app.db import supabase
from app.logging_config import logger
from app.config import EMBEDDING_DIM

app = FastAPI(title="PolicyPulse RAG API")

_cors_origins = [
    origin.strip()
    for origin in os.environ.get("FRONTEND_URL", "http://localhost:3000").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

class RequestSizeMiddleware(BaseHTTPMiddleware):
    MAX_REQUEST_SIZE = 50 * 1024 * 1024

    async def dispatch(self, request, call_next):
        if request.method in ["POST", "PUT", "PATCH"]:
            content_length = request.headers.get("content-length")
            if content_length and int(content_length) > self.MAX_REQUEST_SIZE:
                logger.warning(f"Request too large: {content_length} bytes")
                return JSONResponse(
                    {"error": f"Request too large. Maximum {self.MAX_REQUEST_SIZE / 1024 / 1024}MB allowed."},
                    status_code=413
                )
        return await call_next(request)

app.add_middleware(RequestSizeMiddleware)

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100 per minute"]
)
app.state.limiter = limiter

def _rate_limit_exceeded_handler(request, exc):
    logger.warning(f"Rate limit exceeded for {get_remote_address(request)}")
    return JSONResponse(
        status_code=429,
        content={"error": "Too many requests. Please try again later."}
    )

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if request.url.path == "/health":
            return await call_next(request)

        request_id = str(uuid_module.uuid4())[:8]
        start_time = time.time()

        logger.info(f"[{request_id}] {request.method} {request.url.path}")

        try:
            response = await call_next(request)
            process_time = time.time() - start_time

            logger.info(f"[{request_id}] {response.status_code} ({process_time:.2f}s)")

            return response
        except Exception as e:
            process_time = time.time() - start_time
            logger.error(f"[{request_id}] Error after {process_time:.2f}s: {str(e)}")
            raise

app.add_middleware(LoggingMiddleware)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        return response

app.add_middleware(SecurityHeadersMiddleware)

app.include_router(ingest_router)

security = HTTPBearer()

VALID_API_KEYS = set(
    os.environ.get("VALID_API_KEYS", "").split(",")
)

def verify_api_key(credentials = Depends(security)):
    if not VALID_API_KEYS or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="API key is required"
        )

    if credentials.credentials not in VALID_API_KEYS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API key"
        )

    return credentials.credentials

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "Invalid request",
            "details": [
                {
                    "field": e.get("loc", ["unknown"])[-1],
                    "message": e.get("msg", "Invalid value"),
                    "type": e.get("type", "unknown"),
                }
                for e in exc.errors()
            ]
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred. Check server logs for details.",
        }
    )

class QueryRequest(BaseModel):
    question: str
    doc_id: str

    @validator("question")
    def validate_question(cls, v):
        if not v or not v.strip():
            raise ValueError("question cannot be empty")
        if len(v) > 1000:
            raise ValueError("question cannot exceed 1000 characters")
        return v.strip()

    @validator("doc_id")
    def validate_doc_id(cls, v):
        try:
            uuid_module.UUID(v)
        except (ValueError, AttributeError):
            raise ValueError("doc_id must be a valid UUID")
        return v

@app.get("/health")
@limiter.limit("100 per minute")
def health(request: Request):
    from app.ingest import embedder
    from app.generate import llm_sync
    from langchain_core.messages import HumanMessage

    health_status = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {}
    }

    try:
        result = supabase.table("documents").select("id").limit(1).execute()
        health_status["services"]["database"] = "ok"
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        health_status["services"]["database"] = f"error: {str(e)}"
        health_status["status"] = "degraded"

    try:
        test_embedding = embedder.embed_query("test")
        if test_embedding and len(test_embedding) == EMBEDDING_DIM:
            health_status["services"]["embedding"] = "ok"
        else:
            health_status["services"]["embedding"] = "error: wrong dimension"
            health_status["status"] = "degraded"
    except Exception as e:
        logger.error(f"Embedding health check failed: {str(e)}")
        health_status["services"]["embedding"] = f"error: {str(e)}"
        health_status["status"] = "degraded"

    try:
        test_message = llm_sync.invoke([HumanMessage(content="Say 'ok'")])
        if test_message.content:
            health_status["services"]["llm"] = "ok"
        else:
            health_status["services"]["llm"] = "error: no response"
            health_status["status"] = "degraded"
    except Exception as e:
        logger.error(f"LLM health check failed: {str(e)}")
        health_status["services"]["llm"] = f"error: {str(e)}"
        health_status["status"] = "degraded"

    http_status = 200 if health_status["status"] == "healthy" else 503
    return JSONResponse(health_status, status_code=http_status)

@app.post("/query")
@limiter.limit("30 per minute")
async def query(request: Request, api_key: str = Depends(verify_api_key)):
    try:
        body = await request.json()
        query_request = QueryRequest(**body)

        logger.info(f"Query started: doc_id={query_request.doc_id}, question_length={len(query_request.question)}")

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid input: {str(e)}")
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid JSON or missing required fields")

    return StreamingResponse(
        stream_answer(query_request.question, query_request.doc_id),
        media_type="text/event-stream",
    )

@app.get("/documents")
@limiter.limit("50 per minute")
def list_documents(request: Request, limit: int = 6, api_key: str = Depends(verify_api_key)):
    result = (
        supabase.table("documents")
        .select("*")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data

@app.get("/documents/{doc_id}")
@limiter.limit("50 per minute")
def get_document(request: Request, doc_id: str, api_key: str = Depends(verify_api_key)):
    result = (
        supabase.table("documents")
        .select("*")
        .eq("id", doc_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(404, "Document not found")
    return result.data

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down PolicyPulse backend...")
    try:
        from app.ingest import embedder
        embedder.__dict__.clear()
    except:
        pass
    logger.info("Backend shutdown complete")
