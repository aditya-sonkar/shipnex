import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tracking_id: string }> }
) {
  const { tracking_id } = await params;
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND}/api/ai/track/${tracking_id}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to communicate with AI Assistant", details: err?.message },
      { status: 500 }
    );
  }
}

