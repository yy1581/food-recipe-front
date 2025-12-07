import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(request: NextRequest) {
  try {
    // 쿠키에서 인증 정보 가져오기 (선택사항)
    const token = request.cookies.get("auth-token")?.value;
    const userId = request.cookies.get("user-id")?.value;

    // 현재는 모크 응답 (실제 백엔드 연결 시 주석 해제)
    console.log("레시피 히스토리 조회:", { userId });

    // 임시 목 데이터 반환
    const mockData = [
      {
        id: 1,
        query: "김치찌개",
        description: "1. 김치를 적당한 크기로 썰어 준비합니다.\n\n2. 돼지고기를 한입 크기로 자릅니다.\n\n3. 팬에 기름을 두르고 김치를 볶습니다.\n\n4. 고기를 넣고 함께 볶아줍니다.\n\n5. 물을 붓고 끓어오르면 두부와 파를 넣습니다.\n\n6. 간을 맞춰 완성합니다.",
      },
      {
        id: 2,
        query: "된장찌개",
        description: "1. 멸치와 다시마로 육수를 우려냅니다.\n\n2. 된장을 체에 걸러 육수에 풉니다.\n\n3. 두부, 감자, 양파를 썰어 넣습니다.\n\n4. 호박과 버섯을 추가합니다.\n\n5. 끓어오르면 파를 넣고 마무리합니다.",
      },
      {
        id: 3,
        query: "비빔밥",
        description: "1. 밥을 따뜻하게 준비합니다.\n\n2. 시금치, 당근, 도라지를 각각 데쳐서 양념합니다.\n\n3. 콩나물도 데쳐서 무쳐둡니다.\n\n4. 계란 후라이를 만듭니다.\n\n5. 그릇에 밥을 담고 나물들을 예쁘게 올립니다.\n\n6. 고추장과 참기름을 넣고 잘 비벼 드세요.",
      },
    ];

    return NextResponse.json({
      success: true,
      message: "레시피 히스토리를 성공적으로 조회했습니다.",
      data: mockData,
    });

    /* 실제 백엔드 연결 시 사용
    if (!token || !userId) {
      return NextResponse.json(
        { success: false, message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 백엔드 서버에서 레시피 히스토리 조회
    const response = await axios.get(`${API_URL}/api/chats/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({
      success: true,
      message: "레시피 히스토리를 성공적으로 조회했습니다.",
      data: response.data,
    });
    */
  } catch (error: unknown) {
    console.error("레시피 히스토리 조회 실패:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message ||
        "레시피 히스토리 조회 중 오류가 발생했습니다.";

      return NextResponse.json({ success: false, message }, { status });
    }

    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
