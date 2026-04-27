import type
{
  PlayerCard,
  LoadedDeck,
  DeckMetadata,
  DeckBuildMetadata,
  DeckValidationMetadata,
} from "../types/game";

import { playerDeck } from "../data/playerDeck";

import seedrandom from "seedrandom";

type ArkhamDeckResponse = {
  investigator_code?: string;
  name?: string;
  slots?: Record<string, number>;
};

type BuildDeckCardsResult = {
  cards: PlayerCard[];
  metadata: DeckBuildMetadata;
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
): DeckValidationMetadata {
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

export function chooseRandomWeakness(
  weaknessPool: PlayerCard[],
  usedWeaknessCodes: Set<string>,
  rng: () => number,
): PlayerCard | null {
  const available = weaknessPool.filter(
    (weakness) =>
      weakness.code != null && !usedWeaknessCodes.has(weakness.code),
  );

  const chosenPool = available.length > 0 ? available : weaknessPool;

  if (chosenPool.length === 0) {
    return null;
  }

  const chosen = chosenPool[Math.floor(rng() * chosenPool.length)];

  if (chosen.code) {
    usedWeaknessCodes.add(chosen.code);
  }

  return chosen;
}

export function resolveRandomWeaknessPlaceholders(params: {
  count: number;
  weaknessPool: PlayerCard[];
  usedWeaknessCodes: Set<string>;
  rng: () => number;
}): {
  cards: PlayerCard[];
  randomWeaknesses: string[];
  validationWarnings: string[];
} {
  const cards: PlayerCard[] = [];
  const randomWeaknesses: string[] = [];
  const validationWarnings: string[] = [];

  for (let i = 0; i < params.count; i += 1) {
    const chosen = chooseRandomWeakness(
      params.weaknessPool,
      params.usedWeaknessCodes,
      params.rng,
    );

    if (!chosen) {
      validationWarnings.push(
        "Random weakness placeholder found, but no weaknesses are available.",
      );
      continue;
    }

    randomWeaknesses.push(chosen.name);
    cards.push(cloneCard(chosen));
  }

  return {
    cards,
    randomWeaknesses,
    validationWarnings,
  };
}

export function addCopiesOfCard(params: {
  card: PlayerCard;
  count: number;
  deckCards: PlayerCard[];
}): void {
  for (let i = 0; i < params.count; i += 1) {
    params.deckCards.push(cloneCard(params.card));
  }
}

export function findPlayerCardByCode(code: string): PlayerCard | null {
  return playerDeck.find((card) => card.code === code) ?? null;
}

export function addUnsupportedCardCode(params: {
  code: string;
  unsupportedCodes: string[];
}): void {
  console.warn(`Unsupported card code: ${params.code}`);
  params.unsupportedCodes.push(params.code);
}

export function resolveDeckSlotCard(params: {
  code: string;
  count: number;
  deckCards: PlayerCard[];
  unsupportedCodes: string[];
}): void {
  const matchingCard = findPlayerCardByCode(params.code);

  if (!matchingCard) {
    addUnsupportedCardCode({
      code: params.code,
      unsupportedCodes: params.unsupportedCodes,
    });
    return;
  }

  addCopiesOfCard({
    card: matchingCard,
    count: params.count,
    deckCards: params.deckCards,
  });
}

export function buildDeckCardsFromSlots(
  slots: Record<string, number>,
  rng: () => number = Math.random,
): BuildDeckCardsResult {
  const deckCards: PlayerCard[] = [];
  const unsupportedCodes: string[] = [];
  const randomWeaknesses: string[] = [];
  const validationMetadata = validateDeckSlots(slots);

  const weaknessPool = getBasicWeaknessPool();
  const usedWeaknessCodes = new Set<string>();

  for (const [code, count] of Object.entries(slots)) {
    if (isRandomWeaknessPlaceholder(code)) {
      const resolvedWeaknesses = resolveRandomWeaknessPlaceholders({
        count,
        weaknessPool,
        usedWeaknessCodes,
        rng,
      });

      deckCards.push(...resolvedWeaknesses.cards);
      randomWeaknesses.push(...resolvedWeaknesses.randomWeaknesses);
      validationMetadata.validationWarnings.push(
        ...resolvedWeaknesses.validationWarnings,
      );

      continue;
    }

    resolveDeckSlotCard({
      code,
      count,
      deckCards,
      unsupportedCodes,
    });
  }

  const metadata: DeckBuildMetadata = {
    unsupportedCodes,
    randomWeaknesses,
    ...validationMetadata,
  };

  return {
    cards: deckCards,
    metadata,
  };
}
