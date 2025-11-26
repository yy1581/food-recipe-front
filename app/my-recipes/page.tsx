"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI, recipeAPI } from "@/lib/api";
import { Error } from "@/components/Error";
import { LoadingSpinner } from "@/components/Spinner";
import styles from "./page.module.css";
import MyRecipeList from "@/components/MyRecipeList";
import Recipe from "@/types/recipe";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // 메시지 삭제 핸들러
  const handleDeleteRecipe = async (recipeId: number) => {
    try {
      await recipeAPI.deleteMessage(String(recipeId));
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.id !== recipeId)
      );
    } catch (error) {
      console.error("메시지 삭제 실패:", error);
      setError("메시지 삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      // 인증 상태 확인
      const userId = authAPI.getCurrentUserId();
      if (!userId) {
        router.push("/login?redirect=/my-recipes");
        return;
      }
      
      setIsLoading(true);
      setError("");
      
      try {
        const response = await recipeAPI.getRecipeHistory();
        if (response.success && response.data) {
          setRecipes(response.data);
        } else {
          setError(response.message || "레시피를 불러올 수 없습니다.");
        }
      } catch (e) {
        console.error("레시피 히스토리 불러오기 실패:", e);
        setError("레시피 히스토리를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
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
