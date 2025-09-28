// CORS 헬퍼 함수들
export const ALLOWED_ORIGINS = [
  "https://food-recipe-front.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
];

export function getAllowedOrigin(requestOrigin: string | null): string {
  if (!requestOrigin) {
    return ALLOWED_ORIGINS[0]; // 기본값으로 Vercel 도메인 사용
  }

  // 요청 origin이 허용된 목록에 있는지 확인
  if (ALLOWED_ORIGINS.includes(requestOrigin)) {
    return requestOrigin;
  }

  // 허용되지 않은 origin인 경우 기본값 반환
  return ALLOWED_ORIGINS[0];
}

export function setCorsHeaders(response: Response, origin: string): void {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");
}