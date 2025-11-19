"use client";

import Recipe from "@/types/recipe";
import { useState } from "react";
import ChatInterface, { Message } from "@/components/ChatInterface";
import styles from "./MyRecipeList.module.css";

interface MyRecipeListProps {
  recipes: Recipe[];
  onDeleteRecipe?: (recipeId: number) => void;
}

export default function MyRecipeList({ recipes, onDeleteRecipe }: MyRecipeListProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  if (recipes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📝</div>
        <h3 className={styles.emptyTitle}>생성된 레시피가 없습니다</h3>
        <p className={styles.emptyText}>새로운 레시피를 생성해보세요!</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>내 레시피 히스토리</h2>
      </div>

      <div className={styles.content}>
        <div className={styles.recipeList}>
          {recipes.map((recipe, index) => (
            <div
              key={recipe.id || index}
              className={`${styles.recipeItem} ${
                selectedRecipe?.id === recipe.id ? styles.selected : ""
              }`}
              onClick={() => handleClick(recipe)}
            >
              <MyRecipeListItem recipe={recipe} onDelete={onDeleteRecipe} />
            </div>
          ))}
        </div>

        <div className={styles.recipeDetail}>
          {selectedRecipe ? (
            <RecipeDetail recipe={selectedRecipe} />
          ) : (
            <div className={styles.noSelection}>
              <div className={styles.placeholderIcon}>👈</div>
              <p className={styles.placeholderText}>
                레시피를 선택하면 상세 내용이 표시됩니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MyRecipeListItemProps {
  recipe: Recipe;
  onDelete?: (recipeId: number) => void;
}

function MyRecipeListItem({ recipe, onDelete }: MyRecipeListItemProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 아이템 클릭 이벤트 방지
    if (confirm(`"${recipe.name}" 레시피를 삭제하시겠습니까?`)) {
      onDelete?.(recipe.id);
      // 벡엔드에 삭제 요청 보내기
    }
  }

  return (
    <div className={styles.itemContent}>
      <div className={styles.itemInfo}>
        <h3 className={styles.itemTitle}>{recipe.name}</h3>
      </div>
      <button className={styles.deleteButton} onClick={handleDelete} title="레시피 삭제">
        <svg 
          className={styles.deleteIcon} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14ZM10 11v6M14 11v6" />
        </svg>
      </button>
    </div>
  );
}

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  // 레시피를 메시지 형식으로 변환
  const messages: Message[] = [
    {
      id: "user-question",
      role: "user",
      text: recipe.name,
    },
    ...recipe.description.map((step, index) => ({
      id: `step-${index}`,
      role: "assistant" as const,
      text: step,
    })),
  ];

  return (
    <div className={styles.detailContainer}>
      <ChatInterface
        messages={messages}
        showInput={false}
        className={styles.chatInterface}
      />
    </div>
  );
}
