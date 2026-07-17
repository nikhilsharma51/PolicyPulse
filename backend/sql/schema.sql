-- PolicyPulse Supabase schema
-- Run this in the Supabase SQL editor

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(768),
  chunk_index INT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ragas_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  faithfulness FLOAT,
  answer_relevancy FLOAT,
  context_precision FLOAT,
  context_recall FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chunks_doc_id ON chunks(doc_id);
CREATE INDEX IF NOT EXISTS idx_ragas_scores_doc_id ON ragas_scores(doc_id);

-- Dense vector search
CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(768),
  match_doc_id UUID,
  match_count INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    c.id,
    c.content,
    c.metadata,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM chunks c
  WHERE c.doc_id = match_doc_id
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Full-text search
CREATE OR REPLACE FUNCTION match_chunks_fts(
  query_text TEXT,
  match_doc_id UUID,
  match_count INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  rank FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    c.id,
    c.content,
    c.metadata,
    ts_rank(to_tsvector('english', c.content), plainto_tsquery('english', query_text)) AS rank
  FROM chunks c
  WHERE c.doc_id = match_doc_id
    AND to_tsvector('english', c.content) @@ plainto_tsquery('english', query_text)
  ORDER BY rank DESC
  LIMIT match_count;
$$;
