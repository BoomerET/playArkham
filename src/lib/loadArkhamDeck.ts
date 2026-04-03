import type { PlayerCard } from "../types/game";
import { playerDeck } from "../data/playerDeck";

type ArkhamDeckResponse = {
  slots: Record<string, number>;
};

export async function loadArkhamDeck(
  deckId: number,
): Promise<PlayerCard[]> {
  const response = await fetch(
    `https://arkhamdb.com/api/public/deck/${deckId}.json`,
  );

  if (!response.ok) {
    throw new Error("Failed to load deck from ArkhamDB");
  }

  const data = (await response.json()) as ArkhamDeckResponse;

  const result: PlayerCard[] = [];

  for (const [code, count] of Object.entries(data.slots)) {
    const cardTemplate = playerDeck.find(
      (card) => card.code === code,
    );

    if (!cardTemplate) {
      console.warn(`Card code ${code} not found locally`);
      continue;
    }

    for (let i = 0; i < count; i++) {
      result.push({
        ...cardTemplate,
        id: `${cardTemplate.code}-${i}-${Math.random()
          .toString(36)
          .slice(2, 6)}`,
      });
    }
  }

  return result;
}
