import { describe, expect, it, beforeEach } from "vitest";
import { useGameStore } from "../gameStore";

describe("Aloof enemy behavior", () => {
    beforeEach(() => {
        const state = useGameStore.getState();

        useGameStore.setState({
            ...state,
            investigator: {
                ...state.investigator,
                id: "investigator-1",
                name: "Joe Diamond",
            },
            locations: [
                {
                    id: "student-union",
                    name: "Student Union",
                    clues: 0,
                    code: "8675309h",
                    shroud: 0,
                    revealed: true,
                    connections: [],
                    investigatorsHere: ["investigator-1"],
                    isVisible: true,
                    mapPosition: { x: 0, y: 0 },
                    text: [],
                    traits: [],
                },
            ],
            enemies: [
                {
                    id: "enemy-aloof",
                    name: "Suspicious Cultist",
                    fight: 2,
                    evade: 2,
                    health: 3,
                    damage: 1,
                    horror: 1,
                    locationId: "student-union",
                    engagedInvestigatorId: null,
                    exhausted: false,
                    damageOnEnemy: 0,
                    ability: ["Aloof"],
                },
            ],
            log: [],
        });
    });

    it("does not auto-engage an aloof enemy at the investigator's location", () => {
        const state = useGameStore.getState();
        const aloofEnemy = state.enemies.find((e) => e.id === "enemy-aloof");

        expect(aloofEnemy?.engagedInvestigatorId).toBeNull();
    });
});
