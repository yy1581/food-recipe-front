import Link from "next/link";
import style from "./Header.module.css";

export default function Header() {
  return (
    <header className={style.header}>
      <div className={style.container}>
        <Link href="/" className={style.logo}>
          레시피로고
        </Link>
        <nav className={style.nav}>
          <Link href="/recipes">레시피 목록</Link>
          <Link href="/recipes/generate">레시피 생성</Link>
        </nav>
        <div className={style.authLinks}>
          <Link href="/login">로그인</Link>
          <Link href="/signup">회원가입</Link>
        </div>
      </div>
    </header>
  );
}
