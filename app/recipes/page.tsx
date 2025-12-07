"use client";

import ChatInterface, { Message } from "@/components/ChatInterface";
import { LoadingSpinner } from "@/components/Spinner";
import { recipeAPI } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import styles from "./page.module.css";

function RecipesContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const searchParams = useSearchParams();
  const queryValue = searchParams.get("value") || "";
  const router = useRouter();

  const handleSubmit = async (message: string) => {
    setIsLoading(true);
    setError("");

    const userMsg: Message = { 
      id: String(Date.now()) + Math.random(), 
      role: "user", 
      text: message 
    };
    setMessages((m) => [...m, userMsg]);
    
    const params = new URLSearchParams();
    params.append("value", message);
    router.replace(`/recipes?${params.toString()}`);

    try {
      const result = await recipeAPI.generateRecipe(message);

      if (result.success && result.data) {
        const recipeText = result.data.recipe || "";
        
        const assistantMessage: Message = {
          id: `${Date.now()}-recipe`,
          role: "assistant",
          text: recipeText,
        };
        
        setMessages((m) => [...m, assistantMessage]);
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

  return (
    <div className={styles.container}>
      <ChatInterface
        messages={messages}
        onMessagesChange={setMessages}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        onErrorDismiss={() => setError("")}
        inputPlaceholder="질문을 입력해 주세요"
        submitButtonText="생성"
        showInput={true}
        inputValue={queryValue}
      />
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
