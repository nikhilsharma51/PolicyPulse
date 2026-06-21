# PolicyPulse

A document question-answering system built to demonstrate production-style RAG architecture — hybrid retrieval, cross-encoder reranking, and grounded generation with citations — wrapped in a full-stack Next.js + FastAPI application.

Upload a policy document (insurance, legal, or any dense PDF), ask questions in plain English, and get streamed, cited answers grounded strictly in the document's content.

## Live demo

> Note: backend is hosted on Render's free tier and spins down after inactivity. The first request may take ~30 seconds to wake up.

[Add your deployed URL here]

## Video Demo
[https://youtu.be/Nt3XbODsZH8]

## Why this exists

Most RAG demos stop at "embed and cosine search." PolicyPulse exists to show the next layer: what it actually takes to make retrieval reliable enough to trust — and how to know, quantitatively, whether it's working.

## Architecture

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Next.js     │ ───► │  FastAPI backend  │ ───► │  Supabase        │
│  TypeScript  │      │  RAG pipeline      │      │  pgvector + FTS  │
└─────────────┘      └──────────────────┘      └─────────────────┘
                              │
                              ▼
                      ┌──────────────────┐
                      │  Gemini 1.5 Flash  │
                      │  embeddings + gen  │
                      └──────────────────┘
```

**Ingestion** — PDF uploaded → text extracted page-by-page → chunked (512 chars, 50 overlap) → embedded via Gemini → stored in Supabase with both a vector column and a full-text search column.

**Retrieval** — incoming question is embedded, then run through two parallel searches: dense (pgvector cosine similarity) and sparse (Postgres full-text search / BM25-style ranking). Results are merged using Reciprocal Rank Fusion, then re-scored by a cross-encoder model before the top 5 chunks are sent to the LLM.

**Generation** — Gemini 1.5 Flash answers strictly from the retrieved context, streamed token-by-token over SSE, with explicit refusal when the answer isn't in the document. Every answer is attached to its source chunks for citation.

**Evaluation** — RAGAS scores (faithfulness, answer relevancy, context precision) run against a hand-written golden question set, giving a quantitative read on retrieval and generation quality rather than relying on eyeballing outputs.

## Why hybrid search, not just embeddings

Dense vector search is excellent at semantic similarity but weak at exact-match recall — clause numbers, dollar figures, and policy IDs often get buried because their embeddings don't cluster near the question's embedding. Postgres full-text search catches these directly. Reciprocal Rank Fusion combines both result sets by rank position rather than raw score, since cosine similarity and `ts_rank` scores live on incompatible scales and can't be merged directly.

## Why reranking

The initial retrieval step is fast but approximate, returning 20 candidate chunks. The cross-encoder (`ms-marco-MiniLM-L-6-v2`) jointly scores the query against each candidate chunk's full text — more expensive per comparison, but meaningfully more accurate at picking the actual best-matching passages. Running it on a narrowed candidate set keeps total latency reasonable.

## Why a refusal-aware system prompt

A RAG system that always answers — even when the retrieved context doesn't contain the answer — is the most common failure mode in portfolio projects, and it quietly destroys faithfulness scores. PolicyPulse's system prompt explicitly instructs the model to decline when context is insufficient, and this is one of the first things tested against the live demo.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript | Server components for data fetching, streaming UI via SSE |
| Backend | FastAPI (Python) | Async-native, clean typing, fast to iterate |
| Vector DB | Supabase (pgvector) | Free tier, SQL-native, avoids a separate vector DB service |
| Keyword search | Postgres full-text search | Built into Supabase, zero extra infrastructure |
| Embeddings | Gemini `text-embedding-004` | Free tier, 768-dim, strong MTEB performance |
| Reranker | `cross-encoder/ms-marco-MiniLM-L-6-v2` | Free, runs locally, well-validated for passage reranking |
| Generation | Gemini 1.5 Flash | Free tier, fast, large context window |
| Evaluation | RAGAS | Standard library for RAG-specific quality metrics |

## Local setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `.env`:

```
GOOGLE_API_KEY=your-gemini-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

Run the database schema (see `backend/sql/schema.sql`) in the Supabase SQL editor, then:

```bash
uvicorn app.main:app --reload --port 8000
```

Visit `http://localhost:8000/docs` for the interactive API explorer.

### Frontend

```bash
cd frontend
npm install
```

Create `.env.local`:

```
FASTAPI_URL=http://localhost:8000
```

```bash
npm run dev
```

Visit `http://localhost:3000`.

## API overview

| Endpoint | Method | Purpose |
|---|---|---|
| `/health` | GET | Service health check |
| `/ingest` | POST | Upload a PDF, chunk + embed + store |
| `/query` | POST | Ask a question, returns streamed SSE answer with citations |
| `/documents` | GET | List ingested documents |
| `/documents/{id}` | GET | Get a single document's status |
| `/eval/scores` | GET | Retrieve RAGAS evaluation scores for a document |

## What's deliberately out of scope

This is a portfolio project, not a production system, and a few things were left out on purpose rather than by oversight:

- **No authentication** — the demo is intentionally open. Auth adds real engineering surface area but doesn't demonstrate anything about retrieval quality, which is the point of this project.
- **No async job queue for ingestion** — ingestion is synchronous and blocks until complete. Fine at portfolio scale; the natural next step would be a background worker for large documents.
- **Reranker may be disabled on the free-tier deployment** — due to Render's 512MB memory limit, the cross-encoder reranking step may run only in local development and the evaluation pipeline. RAGAS scores reported here reflect the full pipeline including reranking.

## Possible next steps

- Swap the `ivfflat` pgvector index for `hnsw` for better recall at scale
- Add query rewriting (HyDE or step-back prompting) for ambiguous questions
- Multi-document comparison (e.g. "how does this policy's deductible compare to that one?")
- Move ingestion to a background queue for large files
- Per-user authentication and row-level security in Supabase

