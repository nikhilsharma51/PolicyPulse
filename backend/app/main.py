# app/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.ingest import router as ingest_router
from app.generate import stream_answer
from app.db import supabase

app = FastAPI(title="PolicyPulse RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        # add your deployed Vercel URL here once you deploy, e.g.
        # "https://policypulse.vercel.app",
    ],
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
