import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, feedback } = body;

    if (!messageId) {
      return NextResponse.json(
        { success: false, message: "메시지 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 쿠키에서 인증 토큰 가져오기 (선택사항)
    const token = request.cookies.get("auth-token")?.value;
    const userId = request.cookies.get("user-id")?.value;

    // 현재는 모크 응답 (실제 백엔드 연결 시 주석 해제)
    console.log("피드백 수신:", { messageId, feedback, userId });

    // 임시 성공 응답
    return NextResponse.json({
      success: true,
      message: "피드백이 성공적으로 전송되었습니다.",
      data: { messageId, feedback },
    });

    /* 실제 백엔드 연결 시 사용
    if (!token || !userId) {
      return NextResponse.json(
        { success: false, message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 백엔드 서버에 피드백 전송
    const response = await axios.post(
      `${API_URL}/api/chats/feedback`,
      {
        messageId,
        feedback,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "피드백이 성공적으로 전송되었습니다.",
      data: response.data,
    });
    */
  } catch (error: unknown) {
    console.error("피드백 전송 실패:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || "피드백 전송 중 오류가 발생했습니다.";

      return NextResponse.json(
        { success: false, message },
        { status }
      );
    }

    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
