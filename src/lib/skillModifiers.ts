import type {
  PassiveSkillModifier,
  PlayerCard,
  SkillModifierDetail,
  SkillType,
} from "../types/game";

export type SkillTestKind = "investigate" | "fight" | "evade" | "none";

export type SkillModifierContext = {
  skill: SkillType;
  testKind: SkillTestKind;
};

function getPassiveSkillModifiers(card: PlayerCard): PassiveSkillModifier[] {
  return Array.isArray(card.passiveSkillModifiers)
    ? card.passiveSkillModifiers
    : [];
}

function modifierApplies(
  modifier: PassiveSkillModifier,
  context: SkillModifierContext,
): boolean {
  if (modifier.skill !== context.skill) {
    return false;
  }

  const appliesTo = modifier.appliesTo ?? "any";

  if (appliesTo === "any") {
    return true;
  }

  return appliesTo === context.testKind;
}

export function getSkillModifiersFromPlayArea(
  playArea: PlayerCard[],
  context: SkillModifierContext,
): SkillModifierDetail[] {
  const details: SkillModifierDetail[] = [];

  for (const card of playArea) {
    if (card.exhausted) {
      continue;
    }

    const modifiers = getPassiveSkillModifiers(card);

    for (const modifier of modifiers) {
      if (!modifierApplies(modifier, context)) {
        continue;
      }

      details.push({
        source: card.name,
        skill: modifier.skill,
        amount: modifier.amount,
      });
    }
  }

  return details;
}
