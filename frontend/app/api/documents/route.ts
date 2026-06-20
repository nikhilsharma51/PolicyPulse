import { NextResponse } from "next/server";

const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000"

export async function GET(){
    const res = await fetch(`${FASTAPI_URL}/documents`);
    if(!res.ok){
        return NextResponse.json({error:"Failed to fetch documents"},{status : res.status})
    }
    const data = await res.json()
    return NextResponse.json(data)
}
