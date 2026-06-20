# app/main.py
import os

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.ingest import router as ingest_router
from app.generate import stream_answer
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


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/query")
async def query(request: Request):
    body = await request.json()
    question = body.get("question")
    doc_id = body.get("doc_id")

    if not question or not doc_id:
        return {"error": "question and doc_id are required"}

    return StreamingResponse(
        stream_answer(question, doc_id),
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

@app.get("/eval/scores")
def get_eval_scores(doc_id: str, limit: int = 20):
    result = (
        supabase.table("ragas_scores")
        .select("*")
        .eq("doc_id", doc_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data