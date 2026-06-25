// Deprecated: Authentication logic moved to standalone backend in /backend folder
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Deprecated. Use backend server at http://localhost:5000" }, { status: 410 });
}
