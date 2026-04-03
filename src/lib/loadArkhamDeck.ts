import type { PlayerCard } from "../types/game";
import { playerDeck } from "../data/playerDeck";

type ArkhamDeckResponse = {
  slots?: Record<string, number>;
};

function cloneCard(card: PlayerCard, index: number): PlayerCard {
  return {
    ...card,
    id: `${card.code ?? card.id}-${index}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
  };
}

export async function loadArkhamDeck(deckId: string): Promise<PlayerCard[]> {
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
  let copyIndex = 0;

  for (const [code, count] of Object.entries(data.slots)) {
    const matchingCard = playerDeck.find((card) => card.code === code);

    if (!matchingCard) {
      continue;
    }

    for (let i = 0; i < count; i += 1) {
      deckCards.push(cloneCard(matchingCard, copyIndex));
      copyIndex += 1;
    }
  }

  return deckCards;
}
