import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  const limit = request.nextUrl.searchParams.get("limit") ?? "50";
  const res = await fetch(`${FASTAPI_URL}/documents?limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: res.status }
    );
  }
  const data = await res.json();
  return NextResponse.json(data);
}
