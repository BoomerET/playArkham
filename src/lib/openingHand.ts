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
        deck: [...remainingDeck, ...skippedWeaknesses],
    };
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
