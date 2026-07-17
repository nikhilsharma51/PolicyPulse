import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  const docId = request.nextUrl.searchParams.get("doc_id");
  const limit = request.nextUrl.searchParams.get("limit") ?? "20";

  if (!docId) {
    return NextResponse.json({ error: "doc_id is required" }, { status: 400 });
  }

  const res = await fetch(
    `${FASTAPI_URL}/eval/scores?doc_id=${encodeURIComponent(docId)}&limit=${limit}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch eval scores" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.doc_id) {
    return NextResponse.json({ error: "doc_id is required" }, { status: 400 });
  }

  const res = await fetch(`${FASTAPI_URL}/eval/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doc_id: body.doc_id }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json(
      { error: data.detail || data.error || "Failed to start evaluation" },
      { status: res.status }
    );
  }

  return NextResponse.json(data);
}
