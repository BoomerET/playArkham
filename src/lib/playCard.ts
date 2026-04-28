import type { PlayerCard, Investigator } from "../types/game";

export function playCard(params: {
    hand: PlayerCard[];
    discard: PlayerCard[];
    investigator: Investigator;
    card: PlayerCard;
    cost?: number;
}): {
    newHand: PlayerCard[];
    newDiscard: PlayerCard[];
    newInvestigator: Investigator;
} {
    const cost = params.cost ?? 0;

    const newHand = params.hand.filter(
        (c) => c.instanceId !== params.card.instanceId,
    );

    const newDiscard = [...params.discard, params.card];

    const newInvestigator = {
        ...params.investigator,
        resources: params.investigator.resources - cost,
    };

    return {
        newHand,
        newDiscard,
        newInvestigator,
    };
}
