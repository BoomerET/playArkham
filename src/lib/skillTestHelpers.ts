import type {
  CommittedSkillCard,
  PlayerCard,
  SkillType,
} from "../types/game";
import { normalizeSkillIcon } from "../components/skillIconUtils";

export function countMatchingIcons(
  card: PlayerCard,
  skill: SkillType,
): number {
  if (!card.icons || !skill) {
    return 0;
  }

  const normalizedSkill = normalizeSkillIcon(skill);

  if (!normalizedSkill) {
    return 0;
  }

  return card.icons.reduce<number>((count, icon) => {
    const normalizedIcon = normalizeSkillIcon(icon);

    if (
      normalizedIcon === normalizedSkill ||
      normalizedIcon === "wild"
    ) {
      return count + 1;
    }

    return count;
  }, 0);
}

export function hasCommittedCardByName(
  committedCards: CommittedSkillCard[],
  cardName: string,
): boolean {
  return committedCards.some((entry) => entry.card.name === cardName);
}
