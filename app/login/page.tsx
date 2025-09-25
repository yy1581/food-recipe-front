"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { authAPI } from "@/lib/api";
import styles from "./page.module.css";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    // 실시간 에러 제거
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id.trim()) {
      setError("아이디를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await authAPI.login(id.trim());

      if (result.success) {
        // 로그인 성공
        alert("로그인되었습니다!");
        // 짧은 지연 후 페이지 이동 (쿠키 설정 완료 보장)
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } else {
        setError(result.message);
      }
    } catch (error: any) {
      console.error("로그인 실패:", error);
      setError(
        error.message || "네트워크 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>로그인</h2>
          <p className={styles.subtitle}>아이디를 입력하여 로그인하세요</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="id" className={styles.label}>
              아이디
            </label>
            <input
              id="id"
              name="id"
              type="text"
              value={id}
              onChange={handleChange}
              className={`${styles.input} ${error ? styles.inputError : ""}`}
              placeholder="아이디를 입력하세요"
              disabled={isLoading}
            />
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !id.trim()}
            className={styles.submitButton}
          >
            {isLoading ? "확인 중..." : "로그인"}
          </Button>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              계정이 없으신가요?{" "}
              <a href="/signup" className={styles.footerLink}>
                회원가입하기
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
