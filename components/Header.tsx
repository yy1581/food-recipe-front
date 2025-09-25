"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import style from "./Header.module.css";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      authAPI.logout();
      setIsAuthenticated(false);
      setUserId(null);
      setIsDropdownOpen(false);
      alert("로그아웃되었습니다!");
      router.push("/");
    } catch (error: any) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    // 페이지 로드 시 인증 상태 확인
    const checkAuthStatus = () => {
      const authenticated = authAPI.isAuthenticated();
      const currentUserId = authAPI.getCurrentUserId();

      setIsAuthenticated(authenticated);
      setUserId(currentUserId);
    };

    checkAuthStatus();

    const handleFocus = () => {
      checkAuthStatus();
    };

    // 드롭다운 외부 클릭 시 메뉴 닫기
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header className={style.header}>
      <div className={style.container}>
        <Link href="/" className={style.logo}>
          사이트이름
        </Link>
        <nav className={style.nav}>
          <Link href="/recipes">레시피 목록</Link>
          <Link href="/recipes/generate">레시피 생성</Link>
        </nav>
        <div className={style.authLinks}>
          {isAuthenticated ? (
            <div className={style.userMenu} ref={dropdownRef}>
              <button onClick={toggleDropdown} className={style.userMenuButton}>
                <span className={style.userInfo}>{userId}님</span>
                <span className={style.arrow}>▼</span>
              </button>
              {isDropdownOpen && (
                <div className={style.dropdown}>
                  <Link
                    href="/mypage"
                    className={style.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    내 레시피
                  </Link>
                  <Link
                    href="/settings"
                    className={style.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    설정
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={style.dropdownItemButton}
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">로그인</Link>
              <Link href="/signup">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
