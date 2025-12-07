"use client";

import { Button } from "@/components/Button";
import { LoadingSpinner } from "@/components/Spinner";
import { Error } from "@/components/Error";
import { authAPI, recipeAPI } from "@/lib/api";
import { useEffect, useState, useRef } from "react";
import styles from "./ChatInterface.module.css";

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  feedback?: "like" | null;
};

interface ChatInterfaceProps {
  messages: Message[];
  onMessagesChange?: (messages: Message[]) => void;
  onSubmit?: (message: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  onErrorDismiss?: () => void;
  inputPlaceholder?: string;
  submitButtonText?: string;
  showInput?: boolean;
  className?: string;
  inputValue?: string;
}

export default function ChatInterface({
  messages,
  onMessagesChange,
  onSubmit,
  isLoading = false,
  error = "",
  onErrorDismiss,
  inputPlaceholder = "질문을 입력해 주세요",
  submitButtonText = "생성",
  showInput = true,
  className = "",
  inputValue = "",
}: ChatInterfaceProps) {
  const [userInputMessage, setUserInputMessage] = useState(inputValue);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);

  const handleFeedback = async (messageId: string) => {
    if (!isAuthenticated) return;
    
    // UI 먼저 업데이트
    if (onMessagesChange) {
      const currentMessage = messages.find(msg => msg.id === messageId);
      const newFeedback: "like" | null = currentMessage?.feedback === "like" ? null : "like";
      
      const updatedMessages = messages.map((msg) =>
        msg.id === messageId
          ? { ...msg, feedback: newFeedback }
          : msg
      );
      onMessagesChange(updatedMessages);
    }
    
    // 서버에 피드백 전송
    try {
      await recipeAPI.submitFeedback(messageId);
      console.log("피드백 전송 성공");
    } catch (error) {
      console.error("피드백 전송 실패:", error);
      // 실패 시 UI 롤백
      if (onMessagesChange) {
        onMessagesChange(messages);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInputMessage.trim() || !onSubmit) {
      return;
    }

    await onSubmit(userInputMessage.trim());
    setUserInputMessage("");

    // 바닥으로 스크롤
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 50);
  };

  useEffect(() => {
    if (inputValue) {
      setUserInputMessage(inputValue);
    }
  }, [inputValue]);

  useEffect(() => {
    const updateUser = () => {
      const id = authAPI.getCurrentUserId();
      const authenticated = authAPI.isAuthenticated();
      setCurrentUserId(id);
      setIsAuthenticated(authenticated);
    };

    updateUser();
    window.addEventListener("focus", updateUser);
    return () => window.removeEventListener("focus", updateUser);
  }, []);

  useEffect(() => {
    // 새 메시지가 추가되면 자동 스크롤
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.recipeContainer}>
        <div className={styles.chatContainer} ref={chatRef} aria-live="polite">
          {messages.map((m) => (
            <div key={m.id} className={`${styles.message} ${m.role === "user" ? styles.user : ""}`}>
              {m.role === "assistant" && <div className={`${styles.avatar} ${styles.assistant}`}>A</div>}
              <div className={styles.bubbleWrapper}>
                <div className={`${styles.bubble} ${m.role === "user" ? styles.user : styles.assistant}`}>
                  {m.text}
                </div>
                {m.role === "assistant" && (
                  <div className={styles.feedbackButtons}>
                    <button
                      type="button"
                      className={`${styles.feedbackBtn} ${m.feedback === "like" ? styles.active : ""} ${!isAuthenticated ? styles.disabled : ""}`}
                      onClick={() => handleFeedback(m.id)}
                      disabled={!isAuthenticated}
                      title={isAuthenticated ? "좋아요" : "로그인이 필요합니다"}
                      aria-label="좋아요"
                    >
                      ❤️
                    </button>
                  </div>
                )}
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
              onDismiss={onErrorDismiss}
            />
          )}
          {isLoading && (
            <div className={styles.loadingContainer}>
              <LoadingSpinner text="맛있는 레시피를 생성하고 있습니다..." />
            </div>
          )}
        </div>
      </div>

      {showInput && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={userInputMessage}
              onChange={(e) => setUserInputMessage(e.target.value)}
              placeholder={inputPlaceholder}
              className={styles.input}
              disabled={isLoading}
            />

            <Button
              type="submit"
              loading={isLoading}
              disabled={!userInputMessage.trim()}
              className={styles.submitButton}
            >
              {submitButtonText}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
