import type { PlayerCard } from "../types/game";

export function discardFromPlayArea(params: {
    playArea: PlayerCard[];
    discard: PlayerCard[];
    card: PlayerCard;
}): {
    newPlayArea: PlayerCard[];
    newDiscard: PlayerCard[];
    status: "discardedFromPlayArea" | "notInPlayArea";
} {
    const inPlay = params.playArea.some(
        (c) => c.instanceId === params.card.instanceId,
    );

    if (!inPlay) {
        return {
            newPlayArea: params.playArea,
            newDiscard: params.discard,
            status: "notInPlayArea",
        };
    }

    return {
        newPlayArea: params.playArea.filter(
            (c) => c.instanceId !== params.card.instanceId,
        ),
        newDiscard: [...params.discard, params.card],
        status: "discardedFromPlayArea",
    };
}