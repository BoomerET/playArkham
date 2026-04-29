import type { Enemy } from "../types/game";

export function evadeEnemy(params: {
    enemies: Enemy[];
    enemyId: string;
}): {
    enemies: Enemy[];
    status: "evaded" | "notFound";
    logText: string | null;
} {
    let found = false;

    const enemies = params.enemies.map((enemy) => {
        if (enemy.id !== params.enemyId) return enemy;

        found = true;

        return {
            ...enemy,
            exhausted: true,
            engagedInvestigatorId: null,
        };
    });

    if (!found) {
        return {
            enemies: params.enemies,
            status: "notFound",
            logText: null,
        };
    }

    const enemy = params.enemies.find((e) => e.id === params.enemyId);

    return {
        enemies,
        status: "evaded",
        logText: `${enemy?.name ?? "Enemy"} evaded and exhausted.`,
    };
}
