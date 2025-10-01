import Recipe from "@/types/recipe";

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

// 레시피 목 데이터

export const MockRecipes: Recipe[] = [
  {
    id: 1,
    name: "김치찌개",
    description: [
      "김치를 적당한 크기로 썰어 준비합니다.",
      "돼지고기를 한입 크기로 자릅니다.",
      "�팬에 기름을 두르고 김치를 볶습니다.",
      "고기를 넣고 함께 볶아줍니다.",
      "물을 붓고 끓어오르면 두부와 파를 넣습니다.",
      "간을 맞춰 완성합니다."
    ],
  },
  {
    id: 2,
    name: "된장찌개",
    description: [
      "멸치와 다시마로 육수를 우려냅니다.",
      "된장을 체에 걸러 육수에 풉니다.",
      "두부, 감자, 양파를 썰어 넣습니다.",
      "호박과 버섯을 추가합니다.",
      "끓어오르면 파를 넣고 마무리합니다."
    ],
  },
  {
    id: 3,
    name: "비빔밥",
    description: [
      "밥을 따뜻하게 준비합니다.",
      "시금치, 당근, 도라지를 각각 데쳐서 양념합니다.",
      "콩나물도 데쳐서 무쳐둡니다.",
      "계란 후라이를 만듭니다.",
      "그릇에 밥을 담고 나물들을 예쁘게 올립니다.",
      "고추장과 참기름을 넣고 잘 비벼 드세요."
    ],
  },
  {
    id: 4,
    name: "불고기",
    description: [
      "소고기를 얇게 채썰어 준비합니다.",
      "간장, 설탕, 배즙, 마늘로 양념장을 만듭니다.",
      "고기에 양념장을 넣고 30분간 재웁니다.",
      "양파와 대파를 썰어둡니다.",
      "팬에 재운 고기와 야채를 볶아 완성합니다."
    ],
  },
  {
    id: 5,
    name: "잡채",
    description: [
      "당면을 뜨거운 물에 불려둡니다.",
      "각종 야채들을 채썰어 준비합니다.",
      "팬에 기름을 두르고 야채를 각각 볶습니다.",
      "당면을 삶아서 찬물에 헹궈둡니다.",
      "모든 재료와 당면을 섞어 양념합니다.",
      "참기름을 넣고 마지막으로 버무려 완성합니다."
    ],
  },
];
