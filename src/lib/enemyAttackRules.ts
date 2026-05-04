import type { Enemy, Investigator } from "../types/game";
import { resolveEnemyAttack } from "./enemyRules";

export function resolveEnemyAttacks(args: {
    investigator: Investigator;
    enemies: Enemy[];
}): {
    investigator: Investigator;
    enemies: Enemy[];
    logTexts: string[];
    attackedEnemyIds: string[];
} {
    const { investigator, enemies } = args;
    const attackedEnemyIds: string[] = [];

    let updatedInvestigator = investigator;
    const logTexts: string[] = [];

    const updatedEnemies = enemies.map((enemy) => {
        const isEngaged = enemy.engagedInvestigatorId === investigator.id;

        if (!isEngaged) return enemy;
        if (enemy.exhausted) return enemy;

        const attackResult = resolveEnemyAttack({
            investigator: updatedInvestigator,
            enemyName: enemy.name,
            damage: enemy.damage,
            horror: enemy.horror,
        });

        updatedInvestigator = attackResult.investigator;
        logTexts.push(attackResult.logText);

        return {
            ...enemy,
            exhausted: true,
        };
    });

    return {
        investigator: updatedInvestigator,
        enemies: updatedEnemies,
        logTexts,
        attackedEnemyIds,
    };
}
