export const ALLERGY_OPTIONS = [
  "알류",
  "우유",
  "메밀",
  "땅콩",
  "대두",
  "밀",
  "잣",
  "호두",
  "게",
  "새우",
  "오징어",
  "고등어",
  "조개류",
  "복숭아",
  "토마토",
  "닭고기",
  "돼지고기",
  "쇠고기",
  "아황산류"
] as const;

export type AllergyOption = (typeof ALLERGY_OPTIONS)[number];
