import { NextRequest, NextResponse } from "next/server"


const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000"

export async function GET(request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;
    const res = await fetch(`${FASTAPI_URL}/documents/${id}`);
    if (!res.ok) {
        return NextResponse.json({ error: "Document not found" }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
}