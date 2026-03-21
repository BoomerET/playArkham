import type { PlayerCard, SkillModifierDetail, SkillType } from "../types/game";

export function getSkillModifiersFromPlayArea(
  playArea: PlayerCard[],
  skill: SkillType,
): SkillModifierDetail[] {
  const modifiers: SkillModifierDetail[] = [];

  for (const card of playArea) {
    if (card.name === "Magnifying Glass" && skill === "intellect") {
      modifiers.push({
        source: card.name,
        skill,
        amount: 1,
      });
    }

    if (card.name === "Machete" && skill === "combat") {
      modifiers.push({
        source: card.name,
        skill,
        amount: 1,
      });
    }
  }

  return modifiers;
}

