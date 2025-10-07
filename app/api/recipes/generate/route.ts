import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { foodName } = body;

    // 입력값 검증
    if (!foodName || typeof foodName !== "string") {
      const errorResponse = NextResponse.json(
        { message: "음식 이름을 입력해주세요." },
        { status: 400 }
      );
      const origin =
        request.headers.get("origin") || "https://food-recipe-front.vercel.app";
      errorResponse.headers.set("Access-Control-Allow-Origin", origin);
      errorResponse.headers.set(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
      );
      errorResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
      errorResponse.headers.set("Access-Control-Allow-Credentials", "true");
      return errorResponse;
    }

    const trimmedFoodName = foodName.trim();

    // 테스트용 레시피 생성 (실제로는 백엔드 AI API 호출)
    const mockRecipe = generateMockRecipe(trimmedFoodName);

    const response = NextResponse.json(
      {
        success: true,
        message: "레시피가 생성되었습니다.",
        data: {
          foodName: trimmedFoodName,
          recipe: mockRecipe,
          generatedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );

    // CORS 헤더 설정
    const origin =
      request.headers.get("origin") || "https://food-recipe-front.vercel.app";
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  } catch (error) {
    console.error("레시피 생성 중 오류:", error);
    const errorResponse = NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
    const origin =
      request.headers.get("origin") || "https://food-recipe-front.vercel.app";
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
  const origin =
    request.headers.get("origin") || "https://food-recipe-front.vercel.app";
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

// 테스트용 모크 레시피 생성 함수
function generateMockRecipe(foodName: string): string[] {
  const recipes: { [key: string]: string[] } = {
    김밥: [
      "밥을 짓고 식혀둡니다.",
      "단무지, 당근, 시금치, 계란지단을 준비합니다.",
      "김 위에 밥을 얇게 펴고 재료들을 올립니다.",
      "단단히 말아서 한입 크기로 자릅니다.",
      "참기름을 발라 완성합니다."
    ],

    냉면: [
      "냉면 면을 찬물에 담가 불려둡니다.",
      "육수를 차갑게 준비합니다.",
      "오이, 배, 무를 채썰어 준비합니다.",
      "삶은 계란을 반으로 자릅니다.",
      "그릇에 면을 담고 차가운 육수를 부어 완성합니다."
    ],

    비빔밥: [
      "밥을 따뜻하게 준비합니다.",
      "시금치, 당근, 도라지, 콩나물을 각각 무쳐둡니다.",
      "계란 후라이를 올립니다.",
      "고추장과 참기름을 넣고 잘 비벼 드세요."
    ],

    라면: [
      "물 550ml를 끓입니다.",
      "면과 스프를 넣고 4분간 끓입니다.",
      "계란이나 파 등 토핑을 추가합니다.",
      "그릇에 담아 뜨겁게 드세요."
    ],

    짜장면: [
      "면을 삶아 찬물에 헹궈둡니다.",
      "돼지고기와 양파, 양배추를 볶습니다.",
      "춘장을 넣고 볶아 짜장소스를 만듭니다.",
      "면 위에 짜장소스를 올려 완성합니다."
    ]
  };

  return (
    recipes[foodName] || [
      `신선한 재료를 준비합니다.`,
      `재료를 적절한 크기로 손질합니다.`,
      `조리 방법에 따라 요리를 시작합니다.`,
      `간을 맞춰가며 조리합니다.`,
      `맛있게 플레이팅하여 완성합니다.`
    ]
  );
}
