import argparse
import asyncio
import uuid
from pathlib import Path

from app.db import supabase
from app.ingest import chunk_pages, embed_chunks, extract_pages, store_chunks
from app.retrieval import hybrid_retrieve


DEFAULT_QUESTION = "When do quarterly compliance reports begin?"


async def collect_answer(question: str, doc_id: str) -> None:
    from app.generate import stream_answer

    print("\nGenerated answer stream:")
    async for event in stream_answer(question, doc_id):
        print(event.strip())


def main() -> None:
    parser = argparse.ArgumentParser(description="Insert test_policy.pdf and run a RAG smoke test.")
    parser.add_argument(
        "--pdf",
        default=str(Path(__file__).with_name("test_policy.pdf")),
        help="Path to the PDF to ingest.",
    )
    parser.add_argument("--question", default=DEFAULT_QUESTION)
    parser.add_argument(
        "--generate",
        action="store_true",
        help="Also call the Gemini generation stream after retrieval.",
    )
    args = parser.parse_args()

    pdf_path = Path(args.pdf)
    pdf_bytes = pdf_path.read_bytes()

    pages = extract_pages(pdf_bytes)
    if not pages:
        raise RuntimeError("No extractable text found in the PDF.")

    chunks = chunk_pages(pages)
    if not chunks:
        raise RuntimeError("No chunks were created from the PDF.")

    doc_id = str(uuid.uuid4())
    print(f"Inserting document: {pdf_path.name}")
    print(f"doc_id: {doc_id}")
    print(f"pages: {len(pages)}")
    print(f"chunks: {len(chunks)}")

    supabase.table("documents").insert({"id": doc_id, "name": pdf_path.name}).execute()
    store_chunks(doc_id, embed_chunks(chunks))

    print(f"\nRetrieving for question: {args.question}")
    retrieved = hybrid_retrieve(args.question, doc_id)
    print(f"retrieved chunks: {len(retrieved)}")

    for i, chunk in enumerate(retrieved, start=1):
        page = chunk.get("metadata", {}).get("page_number", "unknown")
        score = chunk.get("rerank_score", "unknown")
        preview = " ".join(chunk["content"].split())[:240]
        print(f"\nResult {i} | page {page} | rerank_score {score}")
        print(preview)

    if args.generate:
        asyncio.run(collect_answer(args.question, doc_id))


if __name__ == "__main__":
    main()