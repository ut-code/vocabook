import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// ログイン必須のパス
const PROTECTED_PREFIX = "/my-notebooks";
// ログイン済みなら見せる必要のない（アクセス済みなら追い出す）パス
const AUTH_ROUTES = ["/login", "/signup"];

// Cookieの有無だけを見る楽観的チェック（DBは見ない）。
// 本当の認可チェックは各ページ・Server Action側（lib/session.ts の requireUser）で行う
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  if (pathname.startsWith(PROTECTED_PREFIX) && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (AUTH_ROUTES.includes(pathname) && sessionCookie) {
    return NextResponse.redirect(new URL(PROTECTED_PREFIX, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/my-notebooks/:path*", "/login", "/signup"],
};
