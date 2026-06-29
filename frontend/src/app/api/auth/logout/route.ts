import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ message: "Logout successful" });
  response.cookies.delete("shipnex-session");

  try {
    // Also notify Express backend to clear its cookies
    await fetch(`${BACKEND}/api/auth/logout`, {
      method: "POST",
    });
  } catch (error) {
    // Fail silently if backend is offline
  }

  return response;
}
