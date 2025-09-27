"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import styles from "./page.module.css";

export default function SignupPage() {
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

  const validateId = (): boolean => {
    if (!id.trim()) {
      setError("아이디를 입력해주세요.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateId()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id.trim() }),
        credentials: "include", // 쿠키 포함
      });

      const data = await response.json();

      if (response.ok) {
        // 회원가입 성공 - 백엔드에서 쿠키를 자동으로 설정
        alert("회원가입이 완료되었습니다!");
        router.push("/"); // 메인 페이지로 리다이렉트
      } else {
        // 에러 처리
        if (response.status === 409) {
          setError("이미 사용 중인 아이디입니다.");
        } else {
          setError(data.message || "회원가입 중 오류가 발생했습니다.");
        }
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>회원가입</h2>
          <p className={styles.subtitle}>
            아이디만 입력하여 간편하게 가입하세요
          </p>
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
            {isLoading ? "확인 중..." : "회원가입"}
          </Button>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              이미 계정이 있으신가요?{" "}
              <a href="/login" className={styles.footerLink}>
                로그인하기
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
