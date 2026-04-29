import type {
    Enemy,
    //GameLogItem,
    Investigator,
    PlayerCard,
} from "../types/game";

import { drawCardsWithDiscardReshuffle } from "./openingHand";

import { readyEnemies } from "./enemyReadyRules";

export function runUpkeep(params: {
    investigator: Investigator;
    deck: PlayerCard[];
    hand: PlayerCard[];
    discard: PlayerCard[];
    enemies: Enemy[];
    round: number;
}): {
    investigator: Investigator;
    deck: PlayerCard[];
    hand: PlayerCard[];
    discard: PlayerCard[];
    enemies: Enemy[];
    nextRound: number;
    drawnCard: PlayerCard | null;
    readyCount: number;
    reshuffledDiscard: boolean;
} {
    const nextRound = params.round + 1;

    const drawResult = drawCardsWithDiscardReshuffle({
        deck: params.deck,
        discard: params.discard,
        count: 1,
    });

    const updatedEnemies = readyEnemies(params.enemies);
    const readyCount = params.enemies.filter((enemy) => enemy.exhausted).length;

    return {
        investigator: {
            ...params.investigator,
            resources: params.investigator.resources + 1,
        },
        deck: drawResult.deck,
        hand: [...params.hand, ...drawResult.drawn],
        discard: drawResult.discard,
        enemies: updatedEnemies,
        nextRound,
        drawnCard: drawResult.drawn[0] ?? null,
        readyCount,
        reshuffledDiscard: drawResult.reshuffledDiscard,
    };
}
