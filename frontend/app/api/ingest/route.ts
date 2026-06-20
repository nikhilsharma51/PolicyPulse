
import { error } from "console";
import { NextResponse, NextRequest } from "next/server";

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided !" },
        { status: 400 }
      );
    }

    const proxyForm = new FormData()
    proxyForm.append("file", file)

    const response = await fetch(`${FASTAPI_URL}/ingest`, {
      method: "POST",
      body: proxyForm
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: "Ingestion failed",
      }));
      return NextResponse.json(
        { error: errorData.detail || errorData.error || "Ingestion failed" },
        { status: response.status }
      );
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (err) {
    console.error("Ingest proxy error:", err);
    return NextResponse.json(
      { error: "Internal server error during ingestion" },
      { status: 500 }
    );
  }

}