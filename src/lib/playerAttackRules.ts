import type { Enemy } from "../types/game";

export function attackEnemy(params: {
    enemies: Enemy[];
    enemyId: string;
    damage: number;
}): {
    enemies: Enemy[];
    defeatedEnemies: Enemy[];
    status: "hit" | "notFound";
    logTexts: string[];
} {
    let found = false;
    const defeatedEnemies: Enemy[] = [];
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
                return null;
            }

            logTexts.push(
                `Hit ${enemy.name} for ${params.damage} damage (${newDamage}/${enemy.health}).`,
            );

            return {
                ...enemy,
                damageOnEnemy: newDamage,
            };
        })
        .filter((enemy): enemy is Enemy => enemy !== null);

    if (!found) {
        return {
            enemies: params.enemies,
            defeatedEnemies: [],
            status: "notFound",
            logTexts: [],
        };
    }

    return {
        enemies,
        defeatedEnemies,
        status: "hit",
        logTexts,
    };
}