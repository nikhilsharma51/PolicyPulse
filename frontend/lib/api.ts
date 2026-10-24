export type QueryToken = { token: string };
export type QueryDone = { done: true; sources: Source[] };
export type Source = { source_number: number; page: number | string; content: string };

export type Document = {
  id: string;
  name: string;
  status?: string;
  chunk_count?: number | null;
  created_at: string;
};

export type EvalScore = {
  id: string;
  doc_id: string;
  question: string;
  answer?: string | null;
  faithfulness?: number | null;
  answer_relevancy?: number | null;
  context_precision?: number | null;
  context_recall?: number | null;
  created_at: string;
};

export async function fetchDocuments(limit = 50): Promise<Document[]> {
  const res = await fetch(`/api/documents?limit=${limit}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to fetch documents");
  }
  return res.json();
}

export async function fetchEvalScores(
  docId: string,
  limit = 20
): Promise<EvalScore[]> {
  const res = await fetch(
    `/api/eval?doc_id=${encodeURIComponent(docId)}&limit=${limit}`
  );
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to fetch eval scores");
  }
  return res.json();
}

export async function runEval(docId: string): Promise<{ status: string; message: string }> {
  const res = await fetch("/api/eval", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doc_id: docId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Failed to start evaluation");
  }
  return data;
}

export async function streamQuery(
  question: string,
  docId: string,
  onToken: (token: string) => void,
  onDone: (sources: Source[]) => void,
  onError: (message: string) => void
) {
  try {
    const res = await fetch("/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_KEY || ""}`,
      },
      body: JSON.stringify({ question, doc_id: docId }),
    });

    if (!res.ok || !res.body) {
      const errData = await res.json().catch(() => ({}));
      onError(errData.detail || errData.error || `Query failed: ${res.status}`);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let hasError = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();

        if (payload === "[DONE]") continue;

        try {
          const parsed = JSON.parse(payload);

          if ("error" in parsed) {
            onError(parsed.error);
            hasError = true;
            return;
          }
          if ("token" in parsed && typeof parsed.token === "string") {
            onToken(parsed.token);
          } else if ("done" in parsed && parsed.done === true) {
            onDone(Array.isArray(parsed.sources) ? parsed.sources : []);
          }
        } catch (parseError) {
          console.warn("Failed to parse SSE message:", payload, parseError);
        }
      }
    }

    if (!hasError && buffer.trim()) {
      console.warn("Stream ended with unparsed buffer:", buffer);
      onError("Stream ended unexpectedly");
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    onError(`Network error: ${message}. Is the backend running?`);
  }
}
