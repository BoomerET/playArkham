import type { Enemy, Investigator } from "../types/game";
import { resolveEnemyAttacks } from "./enemyAttackRules";

export function runEnemyPhase(params: {
    investigator: Investigator;
    enemies: Enemy[];
}): {
    investigator: Investigator;
    enemies: Enemy[];
    logTexts: string[];
    attackedEnemyIds: string[];
} {
    const attackResult = resolveEnemyAttacks({
        investigator: params.investigator,
        enemies: params.enemies,
    });

    return {
        investigator: attackResult.investigator,
        enemies: attackResult.enemies,
        logTexts: attackResult.logTexts,
        attackedEnemyIds: attackResult.attackedEnemyIds,
    };
}
