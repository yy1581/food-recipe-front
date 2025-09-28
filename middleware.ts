import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // API 라우트에 대한 CORS 처리
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Preflight OPTIONS 요청 처리
    if (request.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 200 });
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Access-Control-Max-Age", "86400");
      return response;
    }

    // 일반 요청에 대한 CORS 헤더 추가
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
