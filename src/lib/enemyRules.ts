import type { Investigator } from "../types/game";

export function resolveEnemyAttack(params: {
    investigator: Investigator;
    enemyName: string;
    damage: number;
    horror: number;
}): {
    investigator: Investigator;
    logText: string;
} {
    return {
        investigator: {
            ...params.investigator,
            damage: params.investigator.damage + params.damage,
            horror: params.investigator.horror + params.horror,
        },
        logText: `${params.enemyName} attacks! Took ${params.damage} damage and ${params.horror} horror.`,
    };
}
