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
    if not pages:
        return []

    all_text = "\n\n---PAGE_BREAK---\n\n".join([p["text"] for p in pages])
    text_chunks = splitter.split_text(all_text)

    chunks = []
    chunk_index = 0

    for chunk_text in text_chunks:
        page_count = all_text[:all_text.find(chunk_text)].count("---PAGE_BREAK---")
        page_number = page_count + 1 if page_count < len(pages) else len(pages)

        chunks.append({
            "content": chunk_text,
            "page_number": page_number,
            "chunk_index": chunk_index,
        })
        chunk_index += 1

    from app.logging_config import logger
    logger.info(f"Created {len(chunks)} chunks from {len(pages)} pages")

    return chunks     


embedder = GoogleGenerativeAIEmbeddings(
    model=EMBEDDING_MODEL, 
    output_dimensionality=EMBEDDING_DIM,
    timeout=30,
)

def embed_chunks(chunks : list[dict], batch_size: int = 20) -> list[dict]:
    texts = [c["content"] for c in chunks]
    MAX_RETRIES = 3

    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]

        for attempt in range(MAX_RETRIES):
            try:
                embeddings = embedder.embed_documents(batch)

                for j, emb in enumerate(embeddings):
                    if i + j < len(chunks):
                        chunks[i + j]["embedding"] = emb

                if i + batch_size < len(texts):
                    time.sleep(1)

                break

            except Exception as e:
                error_msg = str(e).lower()
                is_rate_limit = "quota" in error_msg or "rate" in error_msg or "429" in error_msg

                if is_rate_limit and attempt < MAX_RETRIES - 1:
                    wait_time = (2 ** attempt) * 5
                    from app.logging_config import logger
                    logger.warning(f"Rate limited on batch {i//batch_size}. Waiting {wait_time}s before retry...")
                    time.sleep(wait_time)
                else:
                    from app.logging_config import logger
                    logger.error(f"Failed to embed batch {i//batch_size} after {attempt + 1} attempts: {str(e)}")
                    raise RuntimeError(f"Failed to embed batch: {str(e)}")

    return chunks     

def store_chunks(doc_id: str, chunks: list[dict]):
    from app.logging_config import logger

    if not chunks:
        logger.warning(f"No chunks to store for doc_id={doc_id}")
        return

    rows = []
    skipped = 0

    for c in chunks:
        if not c.get("content") or not str(c.get("content")).strip():
            logger.warning(f"Skipping empty chunk at index {c.get('chunk_index')}")
            skipped += 1
            continue

        embedding = c.get("embedding")
        if not embedding:
            logger.error(f"Missing embedding for chunk at index {c.get('chunk_index')}")
            raise ValueError(f"Chunk {c.get('chunk_index')} is missing embedding")

        if not isinstance(embedding, list):
            logger.error(f"Embedding is not a list: {type(embedding)}")
            raise ValueError(f"Embedding must be a list, got {type(embedding)}")

        if len(embedding) != EMBEDDING_DIM:
            logger.error(f"Wrong embedding dimension: {len(embedding)} (expected {EMBEDDING_DIM})")
            raise ValueError(f"Embedding dimension mismatch: {len(embedding)} != {EMBEDDING_DIM}")

        page_number = c.get("page_number")
        if not isinstance(page_number, int) or page_number < 1:
            logger.warning(f"Invalid page number: {page_number}, using 1")
            page_number = 1

        rows.append({
            "doc_id": doc_id,
            "content": c["content"].strip(),
            "embedding": embedding,
            "chunk_index": c["chunk_index"],
            "metadata": {"page_number": page_number},
        })

    if not rows:
        raise ValueError(f"All {len(chunks)} chunks were invalid or empty")

    logger.info(f"Storing {len(rows)} chunks (skipped {skipped})")
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