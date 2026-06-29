import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

async function proxy(req: NextRequest, id: string) {
  const sessionCookie = req.cookies.get("shipnex-session");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (sessionCookie) headers["Cookie"] = `shipnex-session=${sessionCookie.value}`;

  const res = await fetch(`${BACKEND}/api/hubs/${id}`, {
    method: req.method,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxy(req, id);
}
