from app.db import supabase
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from sentence_transformers import CrossEncoder
from app.ingest import embedder
from app.config import EMBEDDING_MODEL , DENSE_TOP_K , RRF_K , RERANKER_MODEL , RERANK_TOP_N , SPARSE_TOP_K

def dense_search(doc_id:str, query:str , k : int = DENSE_TOP_K)->list[dict]:
    query_embedding = embedder.embed_query(query)

    result = supabase.rpc("match_chunks",{
        "query_embedding":query_embedding,
        "match_doc_id" : doc_id,
        "match_count" : k
    }).execute()
    
    data = result.data
    if not isinstance(data , list):
        raise ValueError(f"Expected list from match_chunks RPC, got {type(data)}")
    return data
    


def sparse_search(doc_id : str, query:str, k: int = SPARSE_TOP_K) ->list[dict]:
        
    result = supabase.rpc("match_chunks_fts", {
        "query_text": query,
        "match_doc_id": doc_id,
        "match_count": k,
        }).execute()
    data = result.data
    if not isinstance(data , list):
        raise ValueError(f"Expected list from match_chunks RPC, got {type(data)}")
    return data


def rrf_merge(dense_result : list[dict] , sparse_result : list[dict] , k : int = RRF_K) -> list[dict]:
    scores : dict[str,float] ={}
    chunk_lookup : dict[str , dict] = {}

    for rank , chunk in enumerate(dense_result):
        chunk_id = chunk["id"]
        scores[chunk_id] = scores.get(chunk_id, 0) + 1 / (k + rank + 1)
        chunk_lookup[chunk_id] = chunk

    for rank ,chunk in enumerate(sparse_result):
        chunk_id = chunk["id"]
        scores[chunk_id] = scores.get(chunk_id, 0) + 1 / (k + rank + 1)
        chunk_lookup[chunk_id] = chunk

    ranked_ids = sorted(scores.keys(), key=lambda cid: scores[cid], reverse=True)
    return [chunk_lookup[cid] for cid in ranked_ids]     


_reranker: CrossEncoder | None = None


def get_reranker() -> CrossEncoder:
    global _reranker
    if _reranker is None:
        _reranker = CrossEncoder(RERANKER_MODEL)
    return _reranker


def rerank(query:str , chunks:list[dict] , top_n : int = RERANK_TOP_N) -> list[dict]:
    if not chunks :
        return[]
    
    pairs = [(query , c["content"])for c in chunks]
    scores = get_reranker().predict(pairs)
    for chunk , score in zip(chunks,scores):
        chunk["rerank_score"] = float(score)
    ranked = sorted(chunks, key=lambda c: c["rerank_score"], reverse=True)
    return ranked[:top_n]    


def hybrid_retrieve(query: str, doc_id: str) -> list[dict]:
    dense = dense_search(doc_id=doc_id, query=query)
    sparse = sparse_search(doc_id=doc_id, query=query)
    merged = rrf_merge(dense, sparse)
    reranked = rerank(query, merged)
    return reranked

