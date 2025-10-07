"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { Button } from "@/components/Button";
import { Error } from "@/components/Error";
import { ALLERGY_OPTIONS, type AllergyOption } from "@/types/allergy";
import styles from "./page.module.css";

// 사용자 설정 관련 타입
export interface UserSettings {
  allergies: AllergyOption[];
  difficulty: "easy" | "medium" | "hard";
}

export default function SettingsPage() {
  const [userSettings, setUserSettings] = useState<UserSettings>({
    allergies: [],
    difficulty: "easy",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    // 인증 상태 확인
    const userId = authAPI.getCurrentUserId();
    if (!userId) {
      router.push("/login?redirect=/settings");
      return;
    }

    // 저장된 설정 불러오기 (localStorage 사용)
    // 나중에 백엔드 연동 가능
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setUserSettings({
          allergies: settings.allergies || [],
          difficulty: settings.difficulty || "easy",
        });
      } catch (e) {
        console.error("설정 불러오기 실패:", e);
      }
    }
  }, [router]);

  const handleAllergyToggle = (allergy: AllergyOption) => {
    const currentAllergies = userSettings.allergies;
    if (currentAllergies.includes(allergy)) {
      setUserSettings({
        ...userSettings,
        allergies: currentAllergies.filter((a) => a !== allergy),
      });
    } else {
      setUserSettings({
        ...userSettings,
        allergies: [...currentAllergies, allergy],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // localStorage에 설정 저장
      localStorage.setItem("userSettings", JSON.stringify(userSettings));

      setSuccess("설정이 성공적으로 저장되었습니다!");

      // 3초 후 성공 메시지 제거
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("설정 저장 실패:", err);
      setError("설정 저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>설정</h1>

      {error && (
        <Error
          message={error}
          type="error"
          dismissible
          onDismiss={() => setError("")}
        />
      )}

      {success && (
        <Error
          message={success}
          type="info"
          dismissible
          onDismiss={() => setSuccess("")}
        />
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>알레르기 정보</h2>
          <p className={styles.sectionDescription}>
            알레르기가 있는 식재료를 선택하면 해당 재료를 사용하지 않는 레시피를
            추천합니다.
          </p>

          <div className={styles.allergyGrid}>
            {ALLERGY_OPTIONS.map((allergy) => (
              <button
                key={allergy}
                type="button"
                className={`${styles.allergyButton} ${
                  userSettings.allergies.includes(allergy)
                    ? styles.selected
                    : ""
                }`}
                onClick={() => handleAllergyToggle(allergy)}
              >
                {allergy}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>요리 난이도</h2>

          <div className={styles.inputGroup}>
            <label htmlFor="difficulty" className={styles.label}>
              요리 난이도
            </label>
            <select
              id="difficulty"
              className={styles.select}
              value={userSettings.difficulty}
              onChange={(e) =>
                setUserSettings({
                  ...userSettings,
                  difficulty: e.target.value as "easy" | "medium" | "hard",
                })
              }
            >
              <option value="easy">초급 (간단한 요리)</option>
              <option value="medium">중급 (보통 난이도)</option>
              <option value="hard">고급 (복잡한 요리)</option>
            </select>
          </div>
        </section>

        <div className={styles.buttonGroup}>
          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={isLoading}
            className={styles.saveButton}
          >
            저장
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="large"
            onClick={() => router.push("/")}
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
