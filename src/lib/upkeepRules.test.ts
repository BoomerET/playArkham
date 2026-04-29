import { describe, expect, it } from "vitest";
import { runUpkeep } from "./upkeepRules";
import type { Enemy, Investigator, PlayerCard } from "../types/game";

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

function card(name: string): PlayerCard {
    return {
        instanceId: name,
        name,
        type: "asset",
        faction: "neutral",
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
        engagedInvestigatorId: null,
        exhausted: true,
        damageOnEnemy: 0,
        ...overrides,
    };
}

describe("runUpkeep", () => {
    it("gains a resource, draws a card, readies enemies, and advances round", () => {
        const drawn = card("Drawn Card");

        const result = runUpkeep({
            investigator: investigator(),
            deck: [drawn],
            hand: [],
            discard: [],
            enemies: [enemy()],
            round: 1,
        });

        expect(result.investigator.resources).toBe(6);
        expect(result.hand).toEqual([drawn]);
        expect(result.deck).toEqual([]);
        expect(result.enemies[0].exhausted).toBe(false);
        expect(result.readyCount).toBe(1);
        expect(result.nextRound).toBe(2);
    });
});
