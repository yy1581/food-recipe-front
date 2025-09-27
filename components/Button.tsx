import { ButtonHTMLAttributes, ReactNode } from "react";
import { ButtonSpinner } from "./Spinner";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClasses} disabled={disabled || loading} {...props}>
      {loading ? (
        <div className={styles.loadingContent}>
          <ButtonSpinner />
          <span className={styles.loadingText}>처리 중...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
