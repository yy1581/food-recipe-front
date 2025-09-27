import axios from "./axios";

// API 응답 타입 정의
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  status?: number;
}

// 레시피 생성 응답 타입 추가
export interface RecipeGenerateResponse {
  foodName: string;
  recipe: string;
  generatedAt: string;
}

// 쿠키 유틸리티 함수들
const cookieUtils = {
  // 쿠키 삭제
  delete: (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },

  // 쿠키 값 가져오기
  get: (name: string): string | null => {
    if (typeof document === "undefined") return null; // SSR 환경에서 안전하게

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(";").shift() || null;
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    return null;
  },

  // 모든 인증 관련 쿠키 삭제
  clearAuth: () => {
    cookieUtils.delete("auth-token");
    cookieUtils.delete("user-id");
  },
};

// 로그인 API
export const authAPI = {
  // 로그인
  login: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await axios.post("/api/auth/login", { id });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string }; status?: number };
      };
      throw {
        success: false,
        message:
          axiosError.response?.data?.message ||
          "로그인 중 오류가 발생했습니다.",
        status: axiosError.response?.status,
      };
    }
  },

  // 회원가입
  signup: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await axios.post("/api/auth/signup", { id });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string }; status?: number };
      };
      throw {
        success: false,
        message:
          axiosError.response?.data?.message ||
          "회원가입 중 오류가 발생했습니다.",
        status: axiosError.response?.status,
      };
    }
  },

  // 로그아웃
  logout: (): void => {
    try {
      cookieUtils.clearAuth();
    } catch (error: unknown) {
      console.error("로그아웃 중 오류가 발생했습니다.", error);
    }
  },

  // 현재 로그인 상태 확인
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false; // SSR에서는 false 반환
    const userId = cookieUtils.get("user-id");
    return userId !== null && userId.trim() !== "";
  },

  // 현재 사용자 ID 가져오기
  getCurrentUserId: (): string | null => {
    if (typeof window === "undefined") return null; // SSR에서는 null 반환
    return cookieUtils.get("user-id");
  },
};

// 레시피 API (추후 확장 가능)
export const recipeAPI = {
  // 레시피 목록 조회
  getRecipes: async (params?: { value?: string }): Promise<ApiResponse> => {
    try {
      const response = await axios.get("/api/recipes", { params });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string }; status?: number };
      };
      throw {
        success: false,
        message:
          axiosError.response?.data?.message ||
          "레시피 조회 중 오류가 발생했습니다.",
        status: axiosError.response?.status,
      };
    }
  },

  // 레시피 생성
  generateRecipe: async (
    foodName: string
  ): Promise<ApiResponse<RecipeGenerateResponse>> => {
    try {
      const response = await axios.post("/api/recipes/generate", { foodName });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string }; status?: number };
      };
      throw {
        success: false,
        message:
          axiosError.response?.data?.message ||
          "레시피 생성 중 오류가 발생했습니다.",
        status: axiosError.response?.status,
      };
    }
  },
};
