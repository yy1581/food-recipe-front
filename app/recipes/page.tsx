"use client";

import { Button } from "@/components/Button";
import { LoadingSpinner } from "@/components/Spinner";
import { Error } from "@/components/Error";
import { recipeAPI, authAPI } from "@/lib/api";
import { RecipeHistoryManager } from "@/lib/recipeHistory";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import styles from "./page.module.css";

function RecipesContent() {
  const [value, setValue] = useState("");
  const [recipe, setRecipe] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!value.trim()) {
      setError("음식 이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");
    setRecipe("");
    const params = new URLSearchParams();
    params.append("value", value.trim());
    router.replace(`/recipes?${params.toString()}`);

    try {
      const result = await recipeAPI.generateRecipe(value.trim());

      if (result.success && result.data) {
        setRecipe(result.data.recipe);

        // 로그인된 사용자의 경우 히스토리에 저장
        const userId = authAPI.getCurrentUserId();
        if (userId) {
          RecipeHistoryManager.addRecipe({
            foodName: result.data.foodName,
            recipe: result.data.recipe,
            userId: userId,
          });
        }
      } else {
        setError(result.message || "레시피 생성에 실패했습니다.");
      }
    } catch (err) {
      console.error("레시피 생성 실패:", err);
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlQuery = searchParams.get("value");
    if (urlQuery) {
      setValue(urlQuery);
    }
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>레시피 생성</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="음식 이름을 입력하세요 (예: 김밥, 냉면, 비빔밥)"
            className={styles.input}
            disabled={isLoading}
          />

          <Button
            type="submit"
            loading={isLoading}
            disabled={!value.trim()}
            className={styles.submitButton}
          >
            생성
          </Button>
        </div>
      </form>

      {error && (
        <Error
          message={error}
          type="error"
          dismissible
          onDismiss={() => setError("")}
        />
      )}

      {recipe && (
        <div className={styles.recipeContainer}>
          <h2 className={styles.recipeTitle}>생성된 레시피</h2>
          <div className={styles.recipeContent}>{recipe}</div>
        </div>
      )}

      {isLoading && (
        <div className={styles.loadingContainer}>
          <LoadingSpinner text="맛있는 레시피를 생성하고 있습니다..." />
        </div>
      )}
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="페이지를 불러오는 중..." />}>
      <RecipesContent />
    </Suspense>
  );
}
