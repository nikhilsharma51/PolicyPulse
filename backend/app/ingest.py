from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from fastapi import APIRouter, BackgroundTasks, HTTPException, UploadFile
from app.db import supabase
from app.config import EMBEDDING_DIM, EMBEDDING_MODEL
import uuid
import time
import io

router = APIRouter()
MAX_FILE_SIZE = 10 * 1024 * 1024

def extract_pages(file_bytes : bytes) -> list[dict]:
   reader = PdfReader(io.BytesIO(file_bytes))
   pages = []

   for i , page in enumerate(reader.pages):
      text = page.extract_text()

      if text and text.strip():
        pages.append({"page_number": i+1, "text":text})
   return pages


splitter = RecursiveCharacterTextSplitter(
   chunk_size=512,
   chunk_overlap=50,
   separators=["\n\n", "\n", ". ", " ", ""],
)

def chunk_pages(pages : list[dict]) -> list[dict]:
   chunks = []

   for page in pages:
      page_chunks = splitter.split_text(page["text"])
      for idx, chunk_text in enumerate(page_chunks):
         chunks.append({
            "content":chunk_text,
            "page_number" : page["page_number"],
            "chunk_index":len(chunks),
         })

   return chunks     


embedder = GoogleGenerativeAIEmbeddings(model=EMBEDDING_MODEL, output_dimensionality=EMBEDDING_DIM)

def embed_chunks(chunks : list[dict], batch_size: int = 20) -> list[dict]:
   texts = [c["content"] for c in chunks]
   for i in range(0 , len(texts),batch_size):
      batch = texts[i:i + batch_size]
      embeddings = embedder.embed_documents(batch)
      for j, emb in enumerate(embeddings):
            chunks[i + j]["embedding"] = emb
      if i + batch_size < len(texts):
            time.sleep(1)

   return chunks     

def store_chunks(doc_id: str, chunks: list[dict]):
    rows = []
    for c in chunks:
        rows.append({
            "doc_id": doc_id,
            "content": c["content"],
            "embedding": c["embedding"],
            "chunk_index": c["chunk_index"],
            "metadata": {"page_number": c["page_number"]},
        })
    supabase.table("chunks").insert(rows).execute()


@router.post("/ingest")
async def ingest(file: UploadFile, background_tasks: BackgroundTasks):
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(400, "File too large")

    pages = extract_pages(content)
    if not pages:
        raise HTTPException(400, "No extractable text found, this maybe a scanned image/pdf")

    doc_id = str(uuid.uuid4())
    try:
        supabase.table("documents").insert({
            "id": doc_id, "name": file.filename
        }).execute()
    except Exception as e:
        raise HTTPException(500, f"Failed to create document record: {str(e)}")

    try:
        chunks = chunk_pages(pages)
        if not chunks:
            raise HTTPException(400, "No chunks created from PDF")

        chunks = embed_chunks(chunks)
        store_chunks(doc_id, chunks)

    except HTTPException:
        try:
            supabase.table("documents").delete().eq("id", doc_id).execute()
        except Exception:
            pass
        raise
    except Exception as e:
        try:
            supabase.table("documents").delete().eq("id", doc_id).execute()
        except Exception:
            pass
        raise HTTPException(500, f"Failed to process document: {str(e)}")

    from app.eval import run_eval_for_document
    background_tasks.add_task(run_eval_for_document, doc_id)

    return {"doc_id": doc_id, "chunk_count": len(chunks)}