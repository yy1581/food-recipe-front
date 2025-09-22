"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./CardList.module.css";

interface Card {
  imageUrl: string;
  value: string;
}

interface CategoryCard extends Card {
  subItems: string[];
}

export function DefaultCardList({ items }: { items: Card[] }) {
  return (
    <ul className={styles.cardList}>
      {items.map((item) => (
        <li key={item.value}>
          <Link href={`/recipes?value=${item.value}`}>
            <CardItem imageUrl={item.imageUrl} value={item.value} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function CategoryCardList({ items }: { items: CategoryCard[] }) {
  const [opened, setOpened] = useState<string | null>(null);

  const handleToggle = (value: string) => {
    setOpened((prev) => (prev === value ? null : value));
  };

  return (
    <ul className={styles.cardList}>
      {items.map((item) => {
        return (
          <li key={item.value}>
            <CardItem
              imageUrl={item.imageUrl}
              value={item.value}
              isOpen={opened === item.value}
              onToggle={() => handleToggle(item.value)}
              subItems={item.subItems}
            />
          </li>
        );
      })}
    </ul>
  );
}

function CardItem({
  imageUrl,
  value,
  isOpen,
  onToggle,
  subItems,
}: {
  imageUrl?: string;
  value?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  subItems?: string[];
}) {
  return (
    <div
      className={styles.cardItem}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle && onToggle();
        }
      }}
    >
      <div className={styles.imageWrapper}>
        <Image
          alt={value || ""}
          src={imageUrl || ""}
          width={200}
          height={200}
        />
      </div>
      <p className={styles.cardValue}>{value}</p>
      {isOpen && subItems && subItems.length > 0 && (
        <div className={styles.subList} onClick={(e) => e.stopPropagation()}>
          {subItems.map((name) => (
            <Link
              key={name}
              href={`/recipes?value=${encodeURIComponent(name)}`}
              className={styles.subItem}
            >
              {name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
