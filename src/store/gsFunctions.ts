// Exported functions for gameStore.ts
import type {
    Enemy,
    EncounterCard,

} from "../types/game";

export function readyEnemies(enemies: Enemy[]): Enemy[] {
    return enemies.map((enemy) =>
        enemy.exhausted
            ? { ...enemy, exhausted: false }
            : enemy,
    );
}

export function takeSetAsideEncounterCardByCode(args: {
    setAsideEncounterCards: EncounterCard[];
    cardCode: string;
}): {
    card: EncounterCard | null;
    remainingSetAsideEncounterCards: EncounterCard[];
} {
    const { setAsideEncounterCards, cardCode } = args;

    const index = setAsideEncounterCards.findIndex(
        (card) => card.code === cardCode,
    );

    if (index === -1) {
        return {
            card: null,
            remainingSetAsideEncounterCards: setAsideEncounterCards,
        };
    }

    return {
        card: setAsideEncounterCards[index],
        remainingSetAsideEncounterCards: [
            ...setAsideEncounterCards.slice(0, index),
            ...setAsideEncounterCards.slice(index + 1),
        ],
    };
}
