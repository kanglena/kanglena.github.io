export const CATEGORY_META: Record<string, { label: string; color: string }> = {
  dev: { label: "코딩", color: "var(--sky)" },
  creative: { label: "창작", color: "var(--coral)" },
  "dev-log": { label: "코딩 일기", color: "var(--sky)" },
  making: { label: "창작 일기", color: "var(--coral)" },
  thoughts: { label: "그냥 생각", color: "var(--mustard)" },
};
export function categoryMeta(key: string) {
  return CATEGORY_META[key] ?? { label: key, color: "var(--mint)" };
}
export const VALID: Record<string, string[]> = {
  projects: ["dev", "creative"],
  posts: ["dev-log", "making", "thoughts"],
};
