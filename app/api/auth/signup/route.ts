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

    // 중복 검사 및 사용자 등록
    if (!MockUserData.addUser(trimmedId)) {
      const errorResponse = NextResponse.json(
        { message: "이미 사용 중인 아이디입니다." },
        { status: 409 }
      );
      errorResponse.headers.set("Access-Control-Allow-Origin", "*");
      errorResponse.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      errorResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
      return errorResponse;
    }

    // 쿠키 설정을 위한 응답 생성
    const response = NextResponse.json(
      {
        message: "회원가입이 완료되었습니다.",
        userId: trimmedId,
      },
      { status: 201 }
    );

    // CORS 헤더 설정
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Access-Control-Allow-Credentials", "true");

    // HTTP-only 쿠키 설정 (보안성을 위해)
    response.cookies.set("auth-token", trimmedId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS에서만 전송
      sameSite: "strict", // CSRF 공격 방지
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/",
    });

    // 클라이언트에서 접근 가능한 사용자 정보 쿠키 (선택사항)
    response.cookies.set("user-id", trimmedId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("회원가입 처리 중 오류:", error);
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

// 등록된 사용자 목록 확인용 (개발용)
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  return NextResponse.json({
    users: MockUserData.getUsersArray(),
    count: MockUserData.getUserCount(),
  });
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
