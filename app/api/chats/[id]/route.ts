import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: messageId } = await params;

    if (!messageId) {
      return NextResponse.json(
        { success: false, message: "메시지 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 쿠키에서 인증 정보 가져오기 (선택사항)
    const token = request.cookies.get("auth-token")?.value;
    const userId = request.cookies.get("user-id")?.value;

    // 현재는 모크 응답 (실제 백엔드 연결 시 주석 해제)
    console.log("메시지 삭제 수신:", { messageId, userId });

    // 임시 성공 응답
    return NextResponse.json({
      success: true,
      message: "메시지가 성공적으로 삭제되었습니다.",
      data: { messageId },
    });

    /* 실제 백엔드 연결 시 사용
    if (!token || !userId) {
      return NextResponse.json(
        { success: false, message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 백엔드 서버에 메시지 삭제 요청
    const response = await axios.delete(`${API_URL}/api/chats/${messageId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({
      success: true,
      message: "메시지가 성공적으로 삭제되었습니다.",
      data: response.data,
    });
    */
  } catch (error: unknown) {
    console.error("메시지 삭제 실패:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || "메시지 삭제 중 오류가 발생했습니다.";

      return NextResponse.json({ success: false, message }, { status });
    }

    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
