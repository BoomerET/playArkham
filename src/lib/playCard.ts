import type { PlayerCard, Investigator } from "../types/game";

export function playCard(params: {
    hand: PlayerCard[];
    discard: PlayerCard[];
    playArea: PlayerCard[];
    investigator: Investigator;
    card: PlayerCard;
    cost?: number;
}): {
    newHand: PlayerCard[];
    newDiscard: PlayerCard[];
    newPlayArea: PlayerCard[];
    newInvestigator: Investigator;
} {
    const cost = params.cost ?? 0;

    const newHand = params.hand.filter(
        (card) => card.instanceId !== params.card.instanceId,
    );

    const newInvestigator = {
        ...params.investigator,
        resources: params.investigator.resources - cost,
    };

    const isAsset = params.card.type === "asset";

    const cardInHand = params.hand.some(
        (card) => card.instanceId === params.card.instanceId,
    );

    if (!cardInHand) {
        return {
            newHand: params.hand,
            newDiscard: params.discard,
            newPlayArea: params.playArea,
            newInvestigator: params.investigator,
        };
    }

    return {
        newHand,
        newDiscard: isAsset
            ? params.discard
            : [...params.discard, params.card],
        newPlayArea: isAsset
            ? [...params.playArea, params.card]
            : params.playArea,
        newInvestigator,
    };
}