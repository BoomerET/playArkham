import type
{
  PlayerCard,
  LoadedDeck,
  DeckMetadata,
  DeckBuildMetadata,
} from "../types/game";

import { playerDeck } from "../data/playerDeck";

import seedrandom from "seedrandom";

//export const normalizeLoadedDeck = (
//  deck: Partial<LoadedDeck>,
//): LoadedDeck => ({
//  investigatorCode: deck.investigatorCode ?? null,
//  investigatorName: deck.investigatorName ?? null,
//  deckName: deck.deckName ?? null,
//  cards: deck.cards ?? [],
//  unsupportedCodes: deck.unsupportedCodes ?? [],
//  randomWeaknesses: deck.randomWeaknesses ?? [],
//  validationWarnings: deck.validationWarnings ?? [],
//  validationErrors: deck.validationErrors ?? [],
//});

type ArkhamDeckResponse = {
  investigator_code?: string;
  name?: string;
  slots?: Record<string, number>;
};

type BuildDeckCardsResult = {
  cards: PlayerCard[];
  metadata: DeckBuildMetadata;
};

type DeckValidationResult = {
  validationWarnings: string[];
  validationErrors: string[];
};

export type ArkhamBuildDeckJson = {
  investigator_code?: string;
  investigator_name?: string;
  name?: string;
  slots?: Record<string, number>;
  validationWarnings?: string[];
}

function getBasicWeaknessPool(): PlayerCard[] {
  return playerDeck.filter((card) => card.isWeakness === true);
}

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

export function isRandomWeaknessPlaceholder(code: string): boolean {
  return code === "01000";
}

function getDeckLimit(card: PlayerCard): number {
  return card.deckLimit ?? 2;
}

export async function loadArkhamDeck(deckId: string): Promise<LoadedDeck> {
  const rng = seedrandom(deckId);
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

  const buildResult = buildDeckCardsFromSlots(data.slots, rng);

  const metadata: DeckMetadata = {
    investigatorCode: data.investigator_code?.trim() ?? null,
    investigatorName: null,
    deckName: data.name?.trim() ?? null,
    ...buildResult.metadata,
  };

  return {
    ...metadata,
    cards: buildResult.cards,
  };
}

export function loadArkhamBuildDeckFromJson(
  deckJson: ArkhamBuildDeckJson,
): LoadedDeck {
  if (!deckJson.slots) {
    throw new Error("Arkham.build deck JSON did not include slots.");
  }

  const buildResult = buildDeckCardsFromSlots(deckJson.slots);

  const metadata: DeckMetadata = {
    investigatorCode: deckJson.investigator_code?.trim() ?? null,
    investigatorName: deckJson.investigator_name?.trim() ?? null,
    deckName: deckJson.name?.trim() ?? null,
    ...buildResult.metadata,
  };

  return {
    ...metadata,
    cards: buildResult.cards,
  };
}

export function validateDeckSlots(
  slots: Record<string, number>,
): DeckValidationResult {
  const validationWarnings: string[] = [];
  const validationErrors: string[] = [];

  for (const [code, count] of Object.entries(slots)) {
    if (isRandomWeaknessPlaceholder(code)) {
      continue;
    }

    const matchingCard = playerDeck.find((card) => card.code === code);

    if (!matchingCard) {
      continue;
    }

    const deckLimit = getDeckLimit(matchingCard);

    if (!matchingCard.isWeakness && count > deckLimit) {
      validationWarnings.push(
        `${matchingCard.name} has ${count} copies; limit is ${deckLimit}.`,
      );
    }
  }

  return {
    validationWarnings,
    validationErrors,
  };
}

export function buildDeckCardsFromSlots(
  slots: Record<string, number>,
  rng: () => number = Math.random,
): BuildDeckCardsResult {
  const deckCards: PlayerCard[] = [];
  const unsupportedCodes: string[] = [];
  const randomWeaknesses: string[] = [];
  const validation = validateDeckSlots(slots);
  //const validationWarnings: string[] = [];

  const weaknessPool = getBasicWeaknessPool();
  const usedWeaknessCodes = new Set<string>();

  for (const [code, count] of Object.entries(slots)) {
    if (isRandomWeaknessPlaceholder(code)) {
      for (let i = 0; i < count; i += 1) {
        const available = weaknessPool.filter(
          (weakness) =>
            weakness.code != null && !usedWeaknessCodes.has(weakness.code),
        );

        const chosenPool = available.length > 0 ? available : weaknessPool;

        if (chosenPool.length === 0) {
          validation.validationWarnings.push(
            "Random weakness placeholder found, but no weaknesses are available.",
          );
          continue;
        }

        const chosen =
          chosenPool[Math.floor(rng() * chosenPool.length)];

        if (chosen.code) {
          usedWeaknessCodes.add(chosen.code);
        }

        randomWeaknesses.push(chosen.name);
        deckCards.push(cloneCard(chosen));
      }

      continue;
    }

    const matchingCard = playerDeck.find((card) => card.code === code);

    if (!matchingCard) {
      console.warn(`Unsupported card code: ${code}`);
      unsupportedCodes.push(code);
      continue;
    }

    for (let i = 0; i < count; i += 1) {
      deckCards.push(cloneCard(matchingCard));
    }
  }
  return {
    cards: deckCards,
    metadata: {
      unsupportedCodes,
      randomWeaknesses,
      validationWarnings: validation.validationWarnings,
      validationErrors: validation.validationErrors,
    },
  };
}
