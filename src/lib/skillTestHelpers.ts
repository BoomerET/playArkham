import type {
  CommittedSkillCard,
  PlayerCard,
  SkillType,
} from "../types/game";
import { normalizeSkillIcon } from "../components/skillIconUtils";

export function countMatchingIcons(card: PlayerCard, skill: SkillType): number {
  return (card.icons ?? []).reduce((total, icon) => {
    const normalizedIcon = normalizeSkillIcon(icon);

    if (normalizedIcon === null) {
      return total;
    }

    if (normalizedIcon === skill || normalizedIcon === "wild") {
      return total + 1;
    }

    return total;
  }, 0);
}

export function hasCommittedCardByName(
  committedCards: CommittedSkillCard[],
  cardName: string,
): boolean {
  return committedCards.some((entry) => entry.card.name === cardName);
}
