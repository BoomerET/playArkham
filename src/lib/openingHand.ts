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
