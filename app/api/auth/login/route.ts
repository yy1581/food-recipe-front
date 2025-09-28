import { NextRequest, NextResponse } from "next/server";
import { MockUserData } from "../../../mock/mock";
import { getAllowedOrigin } from "@/lib/cors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    // 입력값 검증
    if (!id || typeof id !== "string") {
      const errorResponse = NextResponse.json(
        { message: "아이디를 입력해주세요." },
        { status: 400 }
      );
      const origin = getAllowedOrigin(request.headers.get("origin"));
      errorResponse.headers.set("Access-Control-Allow-Origin", origin);
      errorResponse.headers.set(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
      );
      errorResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
      errorResponse.headers.set("Access-Control-Allow-Credentials", "true");
      return errorResponse;
    }

    const trimmedId = id.trim();

    // 사용자 존재 확인
    if (!MockUserData.hasUser(trimmedId)) {
      const errorResponse = NextResponse.json(
        { message: "존재하지 않는 아이디입니다." },
        { status: 401 }
      );
      const origin = getAllowedOrigin(request.headers.get("origin"));
      errorResponse.headers.set("Access-Control-Allow-Origin", origin);
      errorResponse.headers.set(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
      );
      errorResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
      errorResponse.headers.set("Access-Control-Allow-Credentials", "true");
      return errorResponse;
    }

    // 로그인 성공
    const response = NextResponse.json(
      {
        success: true,
        message: "로그인 성공",
        data: {
          userId: trimmedId,
          cookieSet: true,
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );

    // CORS 헤더 설정
    const origin = getAllowedOrigin(request.headers.get("origin"));
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Access-Control-Allow-Credentials", "true");

    // 사용자 쿠키 생성 - 프로덕션 환경 고려
    const isProduction = process.env.NODE_ENV === "production";

    console.log("=== 쿠키 설정 디버그 ===");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Origin:", request.headers.get("origin"));
    console.log("Host:", request.headers.get("host"));
    console.log("User-Agent:", request.headers.get("user-agent"));
    console.log("Is Production:", isProduction);

    // 프로덕션에서는 sameSite를 none으로, secure를 true로 설정
    response.cookies.set("user-id", trimmedId, {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60, // 1시간
      path: "/",
    });

    console.log("쿠키 설정 완료:", trimmedId);

    return response;
  } catch (error) {
    console.error("로그인 처리 중 오류:", error);
    const errorResponse = NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
    const origin = getAllowedOrigin(request.headers.get("origin"));
    errorResponse.headers.set("Access-Control-Allow-Origin", origin);
    errorResponse.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    errorResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
    errorResponse.headers.set("Access-Control-Allow-Credentials", "true");
    return errorResponse;
  }
}

// OPTIONS 메서드 처리 (CORS preflight)
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  const origin = getAllowedOrigin(request.headers.get("origin"));
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}
