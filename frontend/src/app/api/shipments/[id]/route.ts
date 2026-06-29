import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

async function proxy(req: NextRequest, id: string) {
  const sessionCookie = req.cookies.get("shipnex-session");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (sessionCookie) headers["Cookie"] = `shipnex-session=${sessionCookie.value}`;

  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    try { body = JSON.stringify(await req.json()); } catch {}
  }

  const res = await fetch(`${BACKEND}/api/shipments/${id}`, { method: req.method, headers, body });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxy(req, id);
}
