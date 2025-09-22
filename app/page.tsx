import Link from "next/link";
import styles from "./page.module.css";
import CardList from "@/components/CardList";

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>나만의 레시피</h1>
        <p className={styles.subtitle}>
          세상의 모든 레시피를 발견하고, 당신만의 특별한 레시피를 공유해보세요.
        </p>
      </section>
      <CardList />
    </div>
  );
}
