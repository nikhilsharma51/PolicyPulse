import os
import uuid as uuid_module

from fastapi import BackgroundTasks, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, validator

from app.generate import stream_answer
from app.ingest import router as ingest_router
from app.db import supabase

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
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest_router)


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
def health():
    return {"status": "ok"}


@app.post("/query")
async def query(request: Request):
    try:
        body = await request.json()
        query_request = QueryRequest(**body)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid input: {str(e)}")
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid JSON or missing required fields")

    return StreamingResponse(
        stream_answer(query_request.question, query_request.doc_id),
        media_type="text/event-stream",
    )

@app.get("/documents")
def list_documents(limit: int = 6):
    result = (
        supabase.table("documents")
        .select("*")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data


@app.get("/documents/{doc_id}")
def get_document(doc_id: str):
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




