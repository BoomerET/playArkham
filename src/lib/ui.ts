import type { Faction, PlayerCard } from "../types/game";

export function getFactionClassName(faction: Faction): string {
  return `faction-${faction}`;
}

export function getCardTypeClassName(card: PlayerCard): string {
  return `card-type-${card.type}`;
}

