import styles from "./page.module.css";
import { CategoryCardList } from "@/components/CardList";

type Category = {
  imageUrl: string;
  value: string;
  subItems: string[];
};

const categoryItems: Category[] = [
  {
    imageUrl: "/korean.png",
    value: "한식",
    subItems: ["김밥", "냉면", "비빔밥", "불고기", "된장찌개"],
  },
  {
    imageUrl: "/western.png",
    value: "양식",
    subItems: ["파스타", "피자", "스테이크", "리조또"],
  },
  {
    imageUrl: "/dessert.png",
    value: "디저트",
    subItems: ["케이크", "마카롱", "쿠키", "아이스크림"],
  },
];

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>레시피 챗봇</h1>
        <p className={styles.subtitle}>
          원하는 요리 카테고리를 선택하여 레시피를 찾아보세요!
        </p>
      </section>
      <CategoryCardList items={categoryItems} />
    </div>
  );
}
