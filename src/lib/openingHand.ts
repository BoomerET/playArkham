import type { PlayerCard } from "../types/game";

export function isOpeningHandWeakness(card: PlayerCard): boolean {
    return card.isWeakness === true;
}

export function drawOpeningHandWithoutWeaknesses(params: {
    deck: PlayerCard[];
    handSize: number;
}): {
    hand: PlayerCard[];
    deck: PlayerCard[];
    skippedWeaknesses: PlayerCard[];
} {
    let remainingDeck = [...params.deck];
    const hand: PlayerCard[] = [];
    const skippedWeaknesses: PlayerCard[] = [];

    while (hand.length < params.handSize && remainingDeck.length > 0) {
        const [topCard, ...rest] = remainingDeck;
        remainingDeck = rest;

        if (isOpeningHandWeakness(topCard)) {
            skippedWeaknesses.push(topCard);
            continue;
        }

        hand.push(topCard);
    }

    return {
        hand,
        deck: shuffleDeck([...remainingDeck, ...skippedWeaknesses]),
        skippedWeaknesses,
    };
}

export function shuffleDeck(
    deck: PlayerCard[],
    rng: () => number = Math.random,
): PlayerCard[] {
    const result = [...deck];

    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

export function drawCards(params: {
    deck: PlayerCard[];
    count: number;
}): {
    drawn: PlayerCard[];
    deck: PlayerCard[];
} {
    const drawn = params.deck.slice(0, params.count);
    const deck = params.deck.slice(params.count);

    return { drawn, deck };
}

export function shuffle<T>(items: T[]): T[] {
    const copy = [...items];

    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

export function performMulligan(params: {
    hand: PlayerCard[];
    deck: PlayerCard[];
    cardsToMulligan: PlayerCard[];
    rng?: () => number;
}): {
    newHand: PlayerCard[];
    newDeck: PlayerCard[];
} {
    const rng = params.rng ?? Math.random;

    const validMulliganCards = params.cardsToMulligan.filter(
        (card) => !isOpeningHandWeakness(card),
    );

    const cardsToKeep = params.hand.filter(
        (card) =>
            !validMulliganCards.some(
                (m) => m.instanceId === card.instanceId,
            ),
    );

    const returnedCards = validMulliganCards;

    const reshuffledDeck = shuffleDeck(
        [...params.deck, ...returnedCards],
        rng,
    );

    const drawCount = validMulliganCards.length;

    const drawn = reshuffledDeck.slice(0, drawCount);
    const remainingDeck = reshuffledDeck.slice(drawCount);

    return {
        newHand: [...cardsToKeep, ...drawn],
        newDeck: remainingDeck,
    };
}

export function discardCards(params: {
    hand: PlayerCard[];
    discardPile: PlayerCard[];
    cardsToDiscard: PlayerCard[];
}): {
    newHand: PlayerCard[];
    newDiscardPile: PlayerCard[];
} {
    const newHand = params.hand.filter(
        (card) =>
            !params.cardsToDiscard.some(
                (discard) => discard.instanceId === card.instanceId,
            ),
    );

    const newDiscardPile = [
        ...params.discardPile,
        ...params.cardsToDiscard,
    ];

    return {
        newHand,
        newDiscardPile,
    };
}