import { NextRequest, NextResponse } from "next/server";
import { MockUserData } from "../../../mock/mock";

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
      errorResponse.headers.set("Access-Control-Allow-Origin", "*");
      errorResponse.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      errorResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
      return errorResponse;
    }

    const trimmedId = id.trim();

    // 사용자 존재 확인
    if (!MockUserData.hasUser(trimmedId)) {
      const errorResponse = NextResponse.json(
        { message: "존재하지 않는 아이디입니다." },
        { status: 401 }
      );
      errorResponse.headers.set("Access-Control-Allow-Origin", "*");
      errorResponse.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      errorResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
      return errorResponse;
    }

    // 로그인 성공
    const response = NextResponse.json(
      {
        success: true,
        message: "로그인 성공",
        data: { userId: trimmedId },
      },
      { status: 200 }
    );

    // CORS 헤더 설정
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Access-Control-Allow-Credentials", "true");

    // 사용자 쿠키 생성
    response.cookies.set("user-id", trimmedId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
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
    errorResponse.headers.set("Access-Control-Allow-Origin", "*");
    errorResponse.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    errorResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return errorResponse;
  }
}

// OPTIONS 메서드 처리 (CORS preflight)
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}
