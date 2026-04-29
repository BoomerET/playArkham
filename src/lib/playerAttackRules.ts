import type { Enemy } from "../types/game";

export function attackEnemy(params: {
    enemies: Enemy[];
    enemyId: string;
    damage: number;
}): {
    enemies: Enemy[];
    defeatedEnemyIds: string[];
    status: "hit" | "notFound";
    logTexts: string[];
} {
    let found = false;
    const defeatedEnemyIds: string[] = [];
    const logTexts: string[] = [];

    const enemies = params.enemies
        .map((enemy) => {
            if (enemy.id !== params.enemyId) return enemy;

            found = true;

            const newDamage = enemy.damageOnEnemy + params.damage;

            const defeated = newDamage >= enemy.health;

            if (defeated) {
                defeatedEnemyIds.push(enemy.id);
                logTexts.push(`${enemy.name} is defeated.`);
                return null; // remove later
            }

            logTexts.push(
                `Hit ${enemy.name} for ${params.damage} damage (${newDamage}/${enemy.health}).`,
            );

            return {
                ...enemy,
                damageOnEnemy: newDamage,
            };
        })
        .filter((e): e is Enemy => e !== null);

    if (!found) {
        return {
            enemies: params.enemies,
            defeatedEnemyIds: [],
            status: "notFound",
            logTexts: [],
        };
    }

    return {
        enemies,
        defeatedEnemyIds,
        status: "hit",
        logTexts,
    };
}
