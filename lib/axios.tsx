import axios from "axios";

// 간단한 baseURL 설정 - 상대 경로 사용
const getBaseURL = () => {
  // 프로덕션에서는 상대 경로, 개발에서는 절대 경로
  if (process.env.NODE_ENV === "production") {
    return "http://localhost:8080"; // 상대 경로 사용 (현재 도메인)
  }
  return "http://localhost:3000"; // 개발 환경
};

const instance = axios.create({
  baseURL: "http://localhost:8080", // ✅ 스프링 서버 주소
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 포함
  timeout: 10000,
});

export default instance;
