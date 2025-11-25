"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { Error } from "@/components/Error";
import { LoadingSpinner } from "@/components/Spinner";
import styles from "./page.module.css";
import MyRecipeList from "@/components/MyRecipeList";
import Recipe from "@/types/recipe";
import { MockRecipes } from "../../lib/mock/mock";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // 레시피 삭제 핸들러
  const handleDeleteRecipe = (recipeId: number) => {
    setRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe.id !== recipeId)
    );
    // 실제 구현에서는 API 호출로 서버에서도 삭제
    // await recipeAPI.deleteRecipe(recipeId);
  };

  useEffect(() => {
    // 인증 상태 확인
    const userId = authAPI.getCurrentUserId();
    if (!userId) {
      router.push("/login?redirect=/my-recipes");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      setRecipes(MockRecipes); // Mock 데이터 사용
    } catch (e) {
      console.error("레시피 히스토리 불러오기 실패:", e);
      setError("레시피 히스토리를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Error message={error} />
      </div>
    );
  }

  return (
    <MyRecipeList recipes={recipes} onDeleteRecipe={handleDeleteRecipe} />
  );
}
