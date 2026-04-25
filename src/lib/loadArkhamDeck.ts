import type { PlayerCard } from "../types/game";
import { playerDeck } from "../data/playerDeck";

type ArkhamDeckResponse = {
  investigator_code?: string;
  slots?: Record<string, number>;
};

export type ArkhamBuildDeckJson = {
  investigator_code?: string;
  investigator_name?: string;
  name?: string;
  slots?: Record<string, number>;
};

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function cloneCard(card: PlayerCard): PlayerCard {
  return {
    ...card,
    instanceId: `${card.code}-${generateId()}`,
  };
}

type DeckBuildResult = {
  cards: PlayerCard[];
  unsupportedCodes: string[];
};

function isRandomWeaknessPlaceholder(code: string): boolean {
  return code === "01000";
}

export async function loadArkhamDeck(deckId: string): Promise<{
  investigatorCode: string | null;
  cards: PlayerCard[];
  unsupportedCodes: string[];
}> {
  const trimmedDeckId = deckId.trim();

  if (!trimmedDeckId) {
    throw new Error("Deck ID is empty.");
  }

  const response = await fetch(
    `https://arkhamdb.com/api/public/deck/${trimmedDeckId}.json`,
  );

  if (!response.ok) {
    throw new Error(`Failed to load ArkhamDB deck ${trimmedDeckId}.`);
  }

  const data = (await response.json()) as ArkhamDeckResponse;

  if (!data.slots) {
    throw new Error("ArkhamDB deck response did not include slots.");
  }

  const buildResult = buildDeckCardsFromSlots(data.slots);

  return {
    investigatorCode: data.investigator_code?.trim() ?? null,
    cards: buildResult.cards,
    unsupportedCodes: buildResult.unsupportedCodes,
  };
}

export function loadArkhamBuildDeckFromJson(deckJson: ArkhamBuildDeckJson): {
  investigatorCode: string | null;
  investigatorName: string | null;
  deckName: string | null;
  cards: PlayerCard[];
  unsupportedCodes: string[];
} {
  if (!deckJson.slots) {
    throw new Error("Arkham.build deck JSON did not include slots.");
  }

  const buildResult = buildDeckCardsFromSlots(deckJson.slots);

  return {
    investigatorCode: deckJson.investigator_code?.trim() ?? null,
    investigatorName: deckJson.investigator_name?.trim() ?? null,
    deckName: deckJson.name?.trim() ?? null,
    cards: buildResult.cards,
    unsupportedCodes: buildResult.unsupportedCodes,
  };
}
