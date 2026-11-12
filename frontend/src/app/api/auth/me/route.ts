import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(req: NextRequest) {
  const isOptional = req.nextUrl.searchParams.get("optional") === "1";
  const sessionCookie = req.cookies.get("shipnex-session");

  if (!sessionCookie) {
    return isOptional
      ? NextResponse.json(null, { status: 200 })
      : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(`${BACKEND}/api/auth/me`, {
      headers: {
        Cookie: `shipnex-session=${sessionCookie.value}`,
      },
    });

    if (!response.ok) {
      return isOptional
        ? NextResponse.json(null, { status: 200 })
        : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return isOptional
      ? NextResponse.json(null, { status: 200 })
      : NextResponse.json({ error: "Failed to fetch session from backend" }, { status: 500 });
  }
}
