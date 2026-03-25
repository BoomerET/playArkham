import type {
  CommittedSkillCard,
  PlayerCard,
  SkillType,
} from "../types/game";

export function countMatchingIcons(card: PlayerCard, skill: SkillType): number {
  return (card.icons ?? []).filter((icon) => icon === skill).length;
}

export function hasCommittedCardByName(
  committedCards: CommittedSkillCard[],
  cardName: string,
): boolean {
  return committedCards.some((entry) => entry.card.name === cardName);
}
