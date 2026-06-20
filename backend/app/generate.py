import json
from langchain_core.messages import SystemMessage , HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from app.config import LLM_MAX_OUTPUT_TOKENS , LLM_MODEL , LLM_TEMPERATURE 
from app.retrieval import hybrid_retrieve

llm = ChatGoogleGenerativeAI(
    model=LLM_MODEL,
    temperature=LLM_TEMPERATURE,
    max_output_tokens=LLM_MAX_OUTPUT_TOKENS,
    streaming=True
)

SYSTEM_PROMPT = (
    "You are a document assistant. Answer ONLY using the provided context. "
    "Do not use any outside knowledge, even if you know the answer. "
    "If the answer is not in the context, say exactly: "
    "'This information is not in the uploaded document.' "
    "Cite sources as [Source N]."
)

def build_context(chunks:list[dict])-> tuple[str,list[dict]]:
    context_parts = []
    sources = []
    for i , chunk in enumerate(chunks):
        page = chunk.get("metadata",{}).get("page_number","unknown")
        context_parts.append(f"[Source {i + 1}, page {page}]\n{chunk['content']}")
        sources.append({
            "source_number": i + 1,
            "page": page,
            "content": chunk["content"],
        })
    return "\n\n".join(context_parts), sources

async def stream_answer(question: str, doc_id: str):
    chunks = hybrid_retrieve(question, doc_id)
    context, sources = build_context(chunks)

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=f"Context:\n{context}\n\nQuestion: {question}"),
    ]

    async for chunk in llm.astream(messages):
        token = chunk.content
        if token:
            yield f"data: {json.dumps({'token': token})}\n\n"

    yield f"data: {json.dumps({'done': True, 'sources': sources})}\n\n"
    yield "data: [DONE]\n\n"