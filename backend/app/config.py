# app/config.py
import os
from dotenv import load_dotenv

load_dotenv()

# --- API keys ---
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

# --- Embedding model ---
EMBEDDING_MODEL = "models/gemini-embedding-2"
EMBEDDING_DIM = 768

# --- Chunking ---
CHUNK_SIZE = 512
CHUNK_OVERLAP = 50
EMBED_BATCH_SIZE = 20
EMBED_BATCH_SLEEP_SECONDS = 1

# --- Retrieval ---
DENSE_TOP_K = 20
SPARSE_TOP_K = 20
RRF_K = 60          # RRF smoothing constant
RERANK_TOP_N = 5     # chunks sent to the LLM after reranking

# --- Reranker ---
RERANKER_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"

# --- Generation ---
LLM_MODEL = "gemini-2.5-flash"
LLM_TEMPERATURE = 0.1
LLM_MAX_OUTPUT_TOKENS = 1024

# --- File limits ---
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB

# --- Fail fast on missing config ---
_required = {
    "GOOGLE_API_KEY": GOOGLE_API_KEY,
    "SUPABASE_URL": SUPABASE_URL,
    "SUPABASE_SERVICE_KEY": SUPABASE_SERVICE_KEY,
}
missing = [k for k, v in _required.items() if not v]
if missing:
    raise RuntimeError(f"Missing required env vars: {', '.join(missing)}")