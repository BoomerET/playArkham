import type { PlayerCard } from "../types/game";

export function assignDamageToAsset(params: {
    playArea: PlayerCard[];
    cardInstanceId: string;
    amount: number;
}): {
    playArea: PlayerCard[];
    discardedCards: PlayerCard[];
    status: "assigned" | "notFound" | "cannotSoak";
} {
    const card = params.playArea.find(
        (entry) => entry.instanceId === params.cardInstanceId,
    );

    if (!card) {
        return { playArea: params.playArea, discardedCards: [], status: "notFound" };
    }

    if (!card.health || card.health <= 0) {
        return { playArea: params.playArea, discardedCards: [], status: "cannotSoak" };
    }

    const updatedCard = {
        ...card,
        damageOnCard: (card.damageOnCard ?? 0) + params.amount,
    };

    const defeated = (updatedCard.damageOnCard ?? 0) >= card.health;

    return {
        playArea: defeated
            ? params.playArea.filter((entry) => entry.instanceId !== card.instanceId)
            : params.playArea.map((entry) =>
                entry.instanceId === card.instanceId ? updatedCard : entry,
            ),
        discardedCards: defeated ? [updatedCard] : [],
        status: "assigned",
    };
}


export function assignHorrorToAsset(params: {
    playArea: PlayerCard[];
    cardInstanceId: string;
    amount: number;
}): {
    playArea: PlayerCard[];
    discardedCards: PlayerCard[];
    status: "assigned" | "notFound" | "cannotSoak";
} {
    const card = params.playArea.find(
        (entry) => entry.instanceId === params.cardInstanceId,
    );

    if (!card) {
        return { playArea: params.playArea, discardedCards: [], status: "notFound" };
    }

    if (!card.sanity || card.sanity <= 0) {
        return { playArea: params.playArea, discardedCards: [], status: "cannotSoak" };
    }

    const updatedCard = {
        ...card,
        horrorOnCard: (card.horrorOnCard ?? 0) + params.amount,
    };

    const defeated = (updatedCard.horrorOnCard ?? 0) >= card.sanity;

    return {
        playArea: defeated
            ? params.playArea.filter((entry) => entry.instanceId !== card.instanceId)
            : params.playArea.map((entry) =>
                entry.instanceId === card.instanceId ? updatedCard : entry,
            ),
        discardedCards: defeated ? [updatedCard] : [],
        status: "assigned",
    };
}
