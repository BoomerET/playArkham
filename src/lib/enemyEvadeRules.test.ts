import { describe, expect, it } from "vitest";
import { evadeEnemy } from "./enemyEvadeRules";
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
        engagedInvestigatorId: "investigator-1",
        exhausted: false,
        damageOnEnemy: 0,
        ...overrides,
    };
}

describe("evadeEnemy", () => {
    it("exhausts and disengages the enemy", () => {
        const result = evadeEnemy({
            enemies: [enemy()],
            enemyId: "enemy-1",
        });

        expect(result.enemies[0].exhausted).toBe(true);
        expect(result.enemies[0].engagedInvestigatorId).toBe(null);
        expect(result.status).toBe("evaded");
    });

    it("returns notFound if enemy does not exist", () => {
        const result = evadeEnemy({
            enemies: [],
            enemyId: "missing",
        });

        expect(result.status).toBe("notFound");
    });
});
