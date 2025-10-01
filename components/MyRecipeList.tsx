"use client";

import Recipe from "@/types/recipe";
import { useState } from "react";
import styles from "./MyRecipeList.module.css";

export default function MyRecipeList({ recipes }: { recipes: Recipe[] }) {
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
              <MyRecipeListItem recipe={recipe} />
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

function MyRecipeListItem({ recipe }: { recipe: Recipe }) {
  return (
    <div className={styles.itemContent}>
      <h3 className={styles.itemTitle}>{recipe.name}</h3>
    </div>
  );
}

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  return (
    <div className={styles.detailContainer}>
      <div className={styles.recipeHeader}>
        <h3 className={styles.recipeTitle}>{recipe.name}</h3>
      </div>
      <div className={styles.recipeSteps}>
        <h4 className={styles.stepsTitle}>조리 과정</h4>
        <ol className={styles.stepsList}>
          {recipe.description.map((step, index) => (
            <li key={index} className={styles.stepItem}>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
