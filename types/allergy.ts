export const ALLERGY_OPTIONS = [
  "땅콩",
  "견과류",
  "우유",
  "달걀",
  "대두",
  "밀",
  "생선",
  "갑각류",
  "조개류",
] as const;

export type AllergyOption = (typeof ALLERGY_OPTIONS)[number];
