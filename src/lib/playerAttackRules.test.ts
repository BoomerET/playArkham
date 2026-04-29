import { describe, expect, it } from "vitest";
import { attackEnemy } from "./playerAttackRules";
import type { Enemy } from "../types/game";

function enemy(overrides: Partial<Enemy> = {}): Enemy {
    return {
        id: "enemy-1",
        code: "enemy",
        name: "Ghoul",
        fight: 2,
        evade: 2,
        health: 3,
        damage: 1,
        horror: 1,
        locationId: "loc-1",
        engagedInvestigatorId: "investigator-1",
        exhausted: false,
        damageOnEnemy: 0,
        ...overrides,
    };
}

describe("attackEnemy", () => {
    it("applies damage to enemy", () => {
        const result = attackEnemy({
            enemies: [enemy()],
            enemyId: "enemy-1",
            damage: 1,
        });

        expect(result.enemies[0].damageOnEnemy).toBe(1);
        expect(result.status).toBe("hit");
    });

    it("defeats enemy when damage >= health", () => {
        const result = attackEnemy({
            enemies: [enemy()],
            enemyId: "enemy-1",
            damage: 3,
        });

        expect(result.enemies).toHaveLength(0);
        expect(result.defeatedEnemyIds).toEqual(["enemy-1"]);
    });

    it("returns notFound when enemy is missing", () => {
        const result = attackEnemy({
            enemies: [],
            enemyId: "missing",
            damage: 1,
        });

        expect(result.status).toBe("notFound");
    });
});