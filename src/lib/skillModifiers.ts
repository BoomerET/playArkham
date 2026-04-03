import type { PlayerCard, SkillModifierDetail, SkillType } from "../types/game";

export function getSkillModifiersFromPlayArea(
  playArea: PlayerCard[],
  skill: SkillType,
): SkillModifierDetail[] {
  const modifiers: SkillModifierDetail[] = [];

  for (const card of playArea) {
    if (card.type !== "asset") {
      continue;
    }

    if (card.exhausted) {
      continue;
    }

    if (card.name === "Magnifying Glass" && skill === "intellect") {
      modifiers.push({
        source: card.name,
        skill,
        amount: 1,
      });
      continue;
    }

    if (card.name === "Beat Cop" && skill === "combat") {
      modifiers.push({
        source: card.name,
        skill,
        amount: 1,
      });
      continue;
    }

    if (card.name === "Holy Rosary" && skill === "willpower") {
      modifiers.push({
        source: card.name,
        skill,
        amount: 1,
      });
      continue;
    }
  }

  return modifiers;
}
