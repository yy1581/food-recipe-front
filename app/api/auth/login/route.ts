import { NextRequest, NextResponse } from "next/server";
import { MockUserData } from "../../../../lib/mock/mock";
import { getAllowedOrigin } from "@/lib/cors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId } = body;

    // 입력값 검증
    if (!memberId || typeof memberId !== "string") {
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

    const trimmedId = memberId.trim();

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

    // 사용자 쿠키 생성
    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("user-id", trimmedId, {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60, // 1시간
      path: "/",
    });
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
