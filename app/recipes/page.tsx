"use client";

import { Button } from "@/components/Button";
import { LoadingSpinner } from "@/components/Spinner";
import { Error } from "@/components/Error";
import { recipeAPI, authAPI } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense, useRef } from "react";
import styles from "./page.module.css";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

function RecipesContent() {
  const [userInputMessage, setUserInputMessage] = useState("");
  const [recipe, setRecipe] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInputMessage.trim()) {
      setError("메시지를 입력해주세요.");
      return;
    }

  setIsLoading(true);
  setError("");
  setRecipe([]);

  const userMsg = { id: String(Date.now()) + Math.random(), role: "user" as const, text: userInputMessage.trim() };
  setMessages((m) => [...m, userMsg]);
    const params = new URLSearchParams();
    params.append("value", userInputMessage.trim());
    router.replace(`/recipes?${params.toString()}`);

    try {
      const result = await recipeAPI.generateRecipe(userInputMessage.trim());

      if (result.success && result.data) {
        const steps = result.data.recipe || [];
        setRecipe(steps);
        
        const assistantMessages = steps.map((s, i) => ({
          id: `${Date.now()}-${i}-${Math.random()}`,
          role: "assistant" as const,
          text: s,
        }));
        
        setMessages((m) => [...m, ...assistantMessages]);
        // 로그인된 사용자의 경우 히스토리에 저장
      } else {
        setError(result.message || "레시피 생성에 실패했습니다.");
      }
    } catch (err) {
      console.error("레시피 생성 실패:", err);
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      // 바닥으로 스크롤
      setTimeout(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 50);
    }
  };

  useEffect(() => {
    const urlQuery = searchParams.get("value");
    if (urlQuery) {
      setUserInputMessage(urlQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    const updateUser = () => {
      const id = authAPI.getCurrentUserId();
      setCurrentUserId(id);
    };

    updateUser();
    window.addEventListener("focus", updateUser);
    return () => window.removeEventListener("focus", updateUser);
  }, []);

  return (
    <div className={styles.container}>
      
      <div className={styles.recipeContainer}>
        <div className={styles.chatContainer} ref={chatRef} aria-live="polite">
          
          {messages.map((m) => (
            <div key={m.id} className={`${styles.message} ${m.role === "user" ? styles.user : ""}`}>
              {m.role === "assistant" && <div className={`${styles.avatar} ${styles.assistant}`}>A</div>}
              <div className={`${styles.bubble} ${m.role === "user" ? styles.user : styles.assistant}`}>
                {m.text}
              </div>
              {m.role === "user" && (
                <div
                  className={`${styles.avatar} ${styles.user}`}
                  title={currentUserId || "사용자"}
                >
                  {currentUserId ? currentUserId.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
          ))}
          {error && (
            <Error
              message={error}
              type="error"
              dismissible
              onDismiss={() => setError("")}
            />
          )}
          {isLoading && (
            <div className={styles.loadingContainer}>
              <LoadingSpinner text="맛있는 레시피를 생성하고 있습니다..." />
            </div>
          )}
        </div>        
      </div>      

      <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={userInputMessage}
              onChange={(e) => setUserInputMessage(e.target.value)}
              placeholder="질문을 입력해 주세요"
              className={styles.input}
              disabled={isLoading}
            />

            <Button
              type="submit"
              loading={isLoading}
              disabled={!userInputMessage.trim()}
              className={styles.submitButton}
            >
              생성
            </Button>
          </div>
        </form>
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
