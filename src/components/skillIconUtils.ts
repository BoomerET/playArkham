export type SkillIconType =
  | "willpower"
  | "intellect"
  | "combat"
  | "agility";

export function normalizeSkillIcon(value: string): SkillIconType | null {
  const normalized = value.trim().toLowerCase();

  if (
    normalized === "willpower" ||
    normalized === "intellect" ||
    normalized === "combat" ||
    normalized === "agility"
  ) {
    return normalized;
  }

  return null;
}
