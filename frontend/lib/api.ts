// lib/api.ts
export type QueryToken = { token: string };
export type QueryDone = { done: true; sources: Source[] };
export type Source = { source_number: number; page: number | string; content: string };

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, doc_id: docId }),
    });

    if (!res.ok || !res.body) {
      const errData = await res.json().catch(() => ({}));
      onError(errData.error || "Query failed");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

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

        const parsed = JSON.parse(payload);
        if ("token" in parsed) {
          onToken(parsed.token);
        } else if ("done" in parsed) {
          onDone(parsed.sources);
        }
      }
    }
  } catch {
    onError("Network error. Is the backend running?");
  }
}
