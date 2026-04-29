import { describe, expect, it } from "vitest";
import { engageEnemiesAtLocation } from "./enemyEngagementRules";
import type { Enemy } from "../types/game";

function enemy(overrides: Partial<Enemy> = {}): Enemy {
    return {
        id: "enemy-1",
        code: "enemy",
        name: "Ghoul",
        fight: 2,
        evade: 2,
        health: 2,
        damage: 1,
        horror: 1,
        locationId: "loc-1",
        engagedInvestigatorId: null,
        exhausted: false,
        damageOnEnemy: 0,
        ...overrides,
    };
}

describe("engageEnemiesAtLocation", () => {
    it("engages enemies at the investigator location", () => {
        const result = engageEnemiesAtLocation({
            enemies: [enemy()],
            investigatorId: "investigator-1",
            locationId: "loc-1",
        });

        expect(result.enemies[0].engagedInvestigatorId).toBe("investigator-1");
        expect(result.logTexts).toEqual(["Ghoul engages you."]);
    });

    it("does not engage enemies at other locations", () => {
        const result = engageEnemiesAtLocation({
            enemies: [enemy({ locationId: "loc-2" })],
            investigatorId: "investigator-1",
            locationId: "loc-1",
        });

        expect(result.enemies[0].engagedInvestigatorId).toBe(null);
        expect(result.logTexts).toEqual([]);
    });
});
