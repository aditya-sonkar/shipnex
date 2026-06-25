import { NextRequest, NextResponse } from "next/server";

const BACKEND = "http://localhost:5000";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("shipnex-session");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (sessionCookie) headers["Cookie"] = `shipnex-session=${sessionCookie.value}`;

  const res = await fetch(`${BACKEND}/api/shipments/mine`, { method: "GET", headers });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
