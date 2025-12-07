// 목 데이터 - 사용자 관리
export class MockUserData {
  private static users = new Set<string>([
    "admin",
    "user1",
    "test",
    "홍길동",
    "demo",
  ]);

  // 사용자 목록 가져오기
  static getUsers(): Set<string> {
    return this.users;
  }

  // 사용자 존재 확인
  static hasUser(id: string): boolean {
    return this.users.has(id);
  }

  // 새 사용자 추가
  static addUser(id: string): boolean {
    if (this.users.has(id)) {
      return false; // 이미 존재
    }
    this.users.add(id);
    return true; // 추가 성공
  }

  // 사용자 목록을 배열로 반환
  static getUsersArray(): string[] {
    return Array.from(this.users);
  }

  // 사용자 수 반환
  static getUserCount(): number {
    return this.users.size;
  }

  // 개발용 - 모든 사용자 삭제
  static clearUsers(): void {
    this.users.clear();
  }

  // 개발용 - 기본 사용자들 다시 추가
  static resetUsers(): void {
    this.users.clear();
    this.users.add("admin");
    this.users.add("user1");
    this.users.add("test");
    this.users.add("홍길동");
    this.users.add("demo");
  }
}
