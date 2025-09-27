import React from "react";
import styles from "./Error.module.css";

interface ErrorProps {
  message?: string;
  type?: "error" | "warning" | "info";
  size?: "small" | "medium" | "large";
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function Error({
  message = "오류가 발생했습니다.",
  type = "error",
  size = "medium",
  dismissible = false,
  onDismiss,
  className = "",
}: ErrorProps) {
  const errorClasses = [styles.error, styles[type], styles[size], className]
    .filter(Boolean)
    .join(" ");

  const getIcon = () => {
    switch (type) {
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      case "error":
      default:
        return "❌";
    }
  };

  return (
    <div className={errorClasses} role="alert">
      <div className={styles.content}>
        <span className={styles.icon}>{getIcon()}</span>
        <span className={styles.message}>{message}</span>
      </div>
      {dismissible && (
        <button
          className={styles.dismissButton}
          onClick={onDismiss}
          aria-label="에러 메시지 닫기"
        >
          ×
        </button>
      )}
    </div>
  );
}

// 특화된 에러 컴포넌트들
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className={styles.errorContainer}>
      <Error
        message="네트워크 연결을 확인해주세요."
        type="error"
        size="medium"
      />
      {onRetry && (
        <button className={styles.retryButton} onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}

export function ValidationError({ errors }: { errors: string[] }) {
  if (!errors.length) return null;

  return (
    <div className={styles.validationContainer}>
      {errors.map((error, index) => (
        <Error key={index} message={error} type="warning" size="small" />
      ))}
    </div>
  );
}

export function PageError({
  title = "페이지 오류",
  message = "페이지를 불러올 수 없습니다.",
  onReload,
}: {
  title?: string;
  message?: string;
  onReload?: () => void;
}) {
  return (
    <div className={styles.pageError}>
      <div className={styles.pageErrorContent}>
        <h2 className={styles.pageErrorTitle}>{title}</h2>
        <Error message={message} type="error" size="large" />
        {onReload && (
          <button className={styles.reloadButton} onClick={onReload}>
            페이지 새로고침
          </button>
        )}
      </div>
    </div>
  );
}

export default Error;
