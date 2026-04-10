import type { PlayerCard } from "../types/game";
import { playerDeck } from "../data/playerDeck";

type ArkhamDeckResponse = {
  investigator_code?: string;
  slots?: Record<string, number>;
};

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  // fallback
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function cloneCard(card: PlayerCard): PlayerCard {
  return {
    ...card,
    instanceId: `${card.code}-${generateId()}`,
  };
}

export async function loadArkhamDeck(deckId: string): Promise<{
  investigatorCode: string | null;
  cards: PlayerCard[];
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

  const deckCards: PlayerCard[] = [];
  //let copyIndex = 0;

  for (const [code, count] of Object.entries(data.slots)) {
    const matchingCard = playerDeck.find((card) => card.code === code);

    if (!matchingCard) {
      continue;
    }

    for (let i = 0; i < count; i += 1) {
      deckCards.push(cloneCard(matchingCard));
    }
  }

  return {
    investigatorCode: data.investigator_code?.trim() ?? null,
    cards: deckCards,
  };
}
