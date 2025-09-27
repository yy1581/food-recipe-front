import React from "react";
import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "white";
  variant?: "circle" | "dots" | "pulse" | "bars";
  text?: string;
  className?: string;
}

export function Spinner({
  size = "medium",
  color = "primary",
  variant = "circle",
  text,
  className = "",
}: SpinnerProps) {
  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return (
          <div className={`${styles.dots} ${styles[size]} ${styles[color]}`}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        );

      case "pulse":
        return (
          <div
            className={`${styles.pulse} ${styles[size]} ${styles[color]}`}
          ></div>
        );

      case "bars":
        return (
          <div className={`${styles.bars} ${styles[size]} ${styles[color]}`}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
        );

      case "circle":
      default:
        return (
          <div
            className={`${styles.spinner} ${styles[size]} ${styles[color]} ${className}`}
          >
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      {renderSpinner()}
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}

// 특화된 스피너 컴포넌트들
export function LoadingSpinner({ text = "로딩 중..." }: { text?: string }) {
  return <Spinner variant="circle" size="medium" color="primary" text={text} />;
}

export function ButtonSpinner() {
  return <Spinner variant="circle" size="small" color="white" />;
}

export function PageSpinner({
  text = "페이지를 불러오는 중...",
}: {
  text?: string;
}) {
  return <Spinner variant="circle" size="large" color="primary" text={text} />;
}

export default Spinner;
