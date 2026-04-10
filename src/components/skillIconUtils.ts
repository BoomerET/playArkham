export type SkillIconType =
  | "willpower"
  | "intellect"
  | "combat"
  | "agility"
  | "wild";

export function normalizeSkillIcon(value: string): SkillIconType | null {
  const normalized = value.trim().toLowerCase();

  switch (normalized) {
    case "willpower":
    case "will":
    case "brain":
      return "willpower";

    case "intellect":
    case "book":
      return "intellect";

    case "combat":
    case "fist":
      return "combat";

    case "agility":
    case "foot":
      return "agility";

    case "wild":
    case "?":
    case "question":
      return "wild";

    default:
      return null;
  }
}
