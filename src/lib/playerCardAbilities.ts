import type { CardCounterType, PlayerCard } from "../types/game";

export type ActivatedCardAbilityEffect = {
  counterType: CardCounterType;
  counterCost: number;
  investigateDifficultyModifier?: number;
  fightCombatModifier?: number;
  fightDamageBonus?: number;
  logText: string;
};

function getCounterValue(card: PlayerCard, counterType: CardCounterType): number {
  return card.counters?.[counterType] ?? 0;
}

export function canActivatePlayAreaCardAbility(card: PlayerCard): boolean {
  if (card.type !== "asset") {
    return false;
  }

  if (card.name === "Flashlight") {
    return getCounterValue(card, "supply") >= 1;
  }

  if (card.name === ".45 Automatic") {
    return getCounterValue(card, "ammo") >= 1;
  }

  return false;
}

export function getActivatedCardAbilityEffect(
  card: PlayerCard,
): ActivatedCardAbilityEffect | null {
  if (card.type !== "asset") {
    return null;
  }

  if (card.name === "Flashlight") {
    return {
      counterType: "supply",
      counterCost: 1,
      investigateDifficultyModifier: 2,
      logText:
        "Used Flashlight. Spend 1 supply: the next investigation gets shroud -2.",
    };
  }

  if (card.name === ".45 Automatic") {
    return {
      counterType: "ammo",
      counterCost: 1,
      fightCombatModifier: 1,
      fightDamageBonus: 1,
      logText:
        "Used .45 Automatic. Spend 1 ammo: the next fight gets +1 combat and +1 damage.",
    };
  }

  return null;
}
