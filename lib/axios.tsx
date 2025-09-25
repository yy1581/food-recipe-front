import axios from "axios";

// 환경변수에서 백엔드 URL을 가져오거나 로컬 개발용 기본값 사용
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 포함
  timeout: 10000,
});

export default instance;
