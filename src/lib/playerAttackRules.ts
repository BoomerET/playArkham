import type { Enemy } from "../types/game";

export function attackEnemy(params: {
    enemies: Enemy[];
    enemyId: string;
    damage: number;
}): {
    enemies: Enemy[];
    defeatedEnemyIds: Enemy[];
    status: "hit" | "notFound";
    logTexts: string[];
} {
    let found = false;
    const defeatedEnemyIds: Enemy[] = [];
    const logTexts: string[] = [];

    const enemies = params.enemies
        .map((enemy) => {
            if (enemy.id !== params.enemyId) return enemy;

            found = true;

            const newDamage = enemy.damageOnEnemy + params.damage;

            const defeated = newDamage >= enemy.health;

            if (defeated) {
                defeatedEnemies.push({
                    ...enemy,
                    damageOnEnemy: newDamage,
                });
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
            defeatedEnemies: [],
        };
    }

    return {
        enemies,
        defeatedEnemyIds,
        defeatedEnemies,
        status: "hit",
        logTexts,
    };
}
