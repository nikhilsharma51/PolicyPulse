import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/x-pdf",
];
const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const authHeader = request.headers.get("Authorization");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.` },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Only PDF files are allowed.` },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "File name must end with .pdf" },
        { status: 400 }
      );
    }

    const proxyForm = new FormData();
    proxyForm.append("file", file);

    const response = await fetch(`${FASTAPI_URL}/ingest`, {
      method: "POST",
      body: proxyForm,
      headers: {
        ...(authHeader && { "Authorization": authHeader }),
      },
      signal: AbortSignal.timeout(5 * 60 * 1000),
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

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err) {
    console.error("Ingest proxy error:", err);

    const errorMessage = err instanceof Error ? err.message : "Internal server error";

    if (errorMessage.includes("timeout") || errorMessage.includes("Timeout")) {
      return NextResponse.json(
        { error: "Upload took too long. Please try a smaller file." },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
