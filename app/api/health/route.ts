import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "freeteleprompter.in",
    timestamp: new Date().toISOString()
  });
}
