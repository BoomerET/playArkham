import type { Enemy } from "../types/game";

export function engageEnemiesAtLocation(params: {
    enemies: Enemy[];
    investigatorId: string;
    locationId: string | null;
}): {
    enemies: Enemy[];
    logTexts: string[];
} {
    if (!params.locationId) {
        return {
            enemies: params.enemies,
            logTexts: [],
        };
    }

    const logTexts: string[] = [];

    const updatedEnemies = params.enemies.map((enemy) => {
        const shouldEngage =
            enemy.locationId === params.locationId &&
            enemy.engagedInvestigatorId == null;

        if (!shouldEngage) return enemy;

        logTexts.push(`${enemy.name} engages you.`);

        return {
            ...enemy,
            engagedInvestigatorId: params.investigatorId,
        };
    });

    return {
        enemies: updatedEnemies,
        logTexts,
    };
}

export function engageEnemiesAtLocationRule(params: {
    enemies: Enemy[];
    investigatorId: string;
    locationId: string | null;
}): {
    enemies: Enemy[];
    engagedEnemyIds: string[];
} {
    if (!params.locationId) {
        return {
            enemies: params.enemies,
            engagedEnemyIds: [],
        };
    }

    const engagedEnemyIds: string[] = [];

    const enemies = params.enemies.map((enemy) => {
        if (
            enemy.locationId === params.locationId &&
            enemy.engagedInvestigatorId === null &&
            !enemy.exhausted &&
            !(enemy.ability?.includes("Aloof") ?? false)
        ) {
            engagedEnemyIds.push(enemy.id);

            return {
                ...enemy,
                engagedInvestigatorId: params.investigatorId,
            };
        }

        return enemy;
    });

    return {
        enemies,
        engagedEnemyIds,
    };
}
