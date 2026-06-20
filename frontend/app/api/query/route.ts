import { NextRequest } from "next/server";

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export async function POST(request : NextRequest) {
  const body = await request.json()

  const { question , doc_id} = body;

  if(!question || !doc_id){
     return new Response(
      JSON.stringify({ error: "question and doc_id are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const fastapiResponse = await fetch(`${FASTAPI_URL}/query`, {
    method : "POST",
    headers : {"Content-Type": "application/json"},
    body : JSON.stringify({question,doc_id}),
  });

  if (!fastapiResponse.ok || !fastapiResponse.body) {
    return new Response(
      JSON.stringify({ error: "Query failed on backend" }),
      { status: fastapiResponse.status || 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(fastapiResponse.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
