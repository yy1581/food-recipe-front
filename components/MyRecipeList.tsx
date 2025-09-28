"use client";

import Recipe from "@/types/recipe";
import { useState } from "react";

export default function MyRecipeList({ recipes }: { recipes: Recipe[] }) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <div>
      <h2>내 레시피 히스토리</h2>
      <ul>
        {recipes.map((recipe, index) => (
          <li key={index} onClick={() => handleClick(recipe)}>
            <MyRecipeListItem recipe={recipe} />
          </li>
        ))}
      </ul>
      <div>
        {selectedRecipe ? (
          <RecipeDetail recipe={selectedRecipe} />
        ) : (
          <p>선택된 레시피가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

function MyRecipeListItem({ recipe }: { recipe: Recipe }) {
  return (
    <div>
      <h3>{recipe.name}</h3>
    </div>
  );
}

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  return (
    <div>
      <h3>{recipe.name}</h3>
      <p>{recipe.description}</p>
    </div>
  );
}
