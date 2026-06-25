import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ message: "Logout successful" });
  response.cookies.delete("shipnex-session");

  try {
    // Also notify Express backend to clear its cookies
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    // Fail silently if backend is offline
  }

  return response;
}
