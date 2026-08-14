import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PRIMARY_HOST = "freeteleprompter.in";
const WWW_HOST = `www.${PRIMARY_HOST}`;

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");

  if (!host || host !== WWW_HOST) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.protocol = "https";
  url.host = PRIMARY_HOST;
  url.port = "";

  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: [
    "/((?!api/auth|api/health|_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image|twitter-image|manifest.webmanifest).*)"
  ]
};
