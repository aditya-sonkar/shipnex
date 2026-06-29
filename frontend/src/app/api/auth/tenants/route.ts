import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

async function proxyRequest(req: NextRequest, backendPath: string) {
  const sessionCookie = req.cookies.get("shipnex-session");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (sessionCookie) {
    headers["Cookie"] = `shipnex-session=${sessionCookie.value}`;
  }

  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      body = JSON.stringify(await req.json());
    } catch {
      body = undefined;
    }
  }

  const res = await fetch(`${BACKEND}${backendPath}`, {
    method: req.method,
    headers,
    body,
  });

  const data = await res.json().catch(() => ({}));
  const response = NextResponse.json(data, { status: res.status });

  // Forward Set-Cookie if present
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}

export async function GET(req: NextRequest) {
  return proxyRequest(req, "/api/auth/tenants");
}
