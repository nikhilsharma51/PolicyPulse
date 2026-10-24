import json
from langchain_core.messages import SystemMessage , HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from app.config import LLM_MAX_OUTPUT_TOKENS , LLM_MODEL , LLM_TEMPERATURE 
from app.retrieval import hybrid_retrieve

llm = ChatGoogleGenerativeAI(
    model=LLM_MODEL,
    temperature=LLM_TEMPERATURE,
    max_output_tokens=LLM_MAX_OUTPUT_TOKENS,
    streaming=True,
)

llm_sync = ChatGoogleGenerativeAI(
    model=LLM_MODEL,
    temperature=LLM_TEMPERATURE,
    max_output_tokens=LLM_MAX_OUTPUT_TOKENS,
    streaming=False,
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

def answer_question(question: str, doc_id: str) -> tuple[str, list[str], list[dict]]:
    chunks = hybrid_retrieve(question, doc_id)
    context, sources = build_context(chunks)
    contexts = [chunk["content"] for chunk in chunks]

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=f"Context:\n{context}\n\nQuestion: {question}"),
    ]
    response = llm_sync.invoke(messages)
    answer = response.content if isinstance(response.content, str) else str(response.content)
    return answer, contexts, sources


async def stream_answer(question: str, doc_id: str):
    try:
        try:
            chunks = hybrid_retrieve(question, doc_id)
        except Exception as e:
            yield f"data: {json.dumps({'error': f'Retrieval failed: {str(e)}'})}\n\n"
            yield "data: [DONE]\n\n"
            return

        if not chunks:
            yield f"data: {json.dumps({'error': 'No relevant documents found'})}\n\n"
            yield "data: [DONE]\n\n"
            return

        context, sources = build_context(chunks)

        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=f"Context:\n{context}\n\nQuestion: {question}"),
        ]

        try:
            async for chunk in llm.astream(messages):
                token = chunk.content
                if token:
                    yield f"data: {json.dumps({'token': token})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': f'Answer generation failed: {str(e)}'})}\n\n"
            yield "data: [DONE]\n\n"
            return

        yield f"data: {json.dumps({'done': True, 'sources': sources})}\n\n"
        yield "data: [DONE]\n\n"

    except Exception as e:
        print(f"Unexpected error in stream_answer: {e}")
        yield f"data: {json.dumps({'error': 'Unexpected error occurred'})}\n\n"
        yield "data: [DONE]\n\n"