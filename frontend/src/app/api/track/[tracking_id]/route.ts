import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(req: NextRequest, { params }: { params: Promise<{ tracking_id: string }> }) {
  const { tracking_id } = await params;
  const res = await fetch(`${BACKEND}/api/track/${tracking_id}`);
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
