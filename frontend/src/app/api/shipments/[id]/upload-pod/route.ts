import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionCookie = req.cookies.get("shipnex-session");
  const headers: Record<string, string> = {};
  if (sessionCookie) headers["Cookie"] = `shipnex-session=${sessionCookie.value}`;

  // Stream the multipart body directly to the backend without modification
  const body = await req.arrayBuffer();
  const contentType = req.headers.get("content-type") || "";
  headers["content-type"] = contentType;

  const res = await fetch(`${BACKEND}/api/shipments/${id}/upload-pod`, {
    method: "POST",
    headers,
    body,
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
