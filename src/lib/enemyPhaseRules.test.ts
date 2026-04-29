import { expect, it } from "vitest";
import { runEnemyPhase } from "./enemyPhaseRules";
import type { Enemy, Investigator } from "../types/game";

function investigator(): Investigator {
    return {
        id: "investigator-1",
        name: "Test Investigator",
        faction: "neutral",
        portrait: "",
        health: 7,
        sanity: 7,
        resources: 5,
        clues: 0,
        damage: 0,
        horror: 0,
        willpower: 3,
        intellect: 3,
        combat: 3,
        agility: 3,
    };
}

function enemy(overrides: Partial<Enemy> = {}): Enemy {
    return {
        id: "enemy-1",
        code: "enemy-code",
        name: "Test Enemy",
        fight: 2,
        evade: 2,
        health: 2,
        damage: 1,
        horror: 1,
        locationId: "location-1",
        engagedInvestigatorId: "investigator-1",
        exhausted: false,
        damageOnEnemy: 0,
        ...overrides,
    };
}

it("runs enemy phase and applies attacks", () => {
    const result = runEnemyPhase({
        investigator: investigator(),
        enemies: [enemy()],
    });

    expect(result.investigator.damage).toBe(1);
    expect(result.enemies[0].exhausted).toBe(true);
    expect(result.logTexts).toHaveLength(1);
});