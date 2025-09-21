import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        당신만의 <span>특별한 레시피</span>를
        <br />
        찾아보세요
      </h1>
      <p className={styles.description}>
        다양한 레시피를 발견하고, 공유하고, 직접 만들어보세요!
      </p>
      <Link href="/recipes" className={styles.ctaButton}>
        레시피 보러가기
      </Link>
    </main>
  );
}
