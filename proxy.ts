import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = new Set(["ar", "fr", "en"]);

export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const lang = nextUrl.searchParams.get("lang");
  if (lang && LOCALES.has(lang)) {
    const url = nextUrl.clone();
    url.pathname = `/${lang}`;
    url.searchParams.delete("lang");
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
