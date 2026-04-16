import { describe, expect, it, beforeEach } from "vitest";
import { useGameStore } from "../gameStore";

describe("interactive target selection", () => {
    beforeEach(() => {
        const state = useGameStore.getState();

        useGameStore.setState({
            ...state,
            campaignState: {
                previousScenarioOutcome: null,
                randomizedSelectionsByCampaignKey: {},
                scenarioFlags: {},
            },
            investigator: {
                ...state.investigator,
                id: "investigator-1",
                name: "Joe Diamond",
            },
            turn: {
                ...state.turn,
                phase: "investigation",
                actionsRemaining: 3,
            },
            locations: [
                {
                    id: "student-union",
                    name: "Student Union",
                    shroud: 0,
                    code: "8675309g",
                    clues: 0,
                    revealed: true,
                    connections: ["dormitories"],
                    investigatorsHere: ["investigator-1"],
                    isVisible: true,
                    mapPosition: { x: 0, y: 0 },
                    text: [],
                    traits: [],
                    abilities: [
                        {
                            label: "Call Them Over",
                            trigger: "action",
                            costsActions: 1,
                            text: "Choose an enemy at a connecting location. That enemy moves here and engages you.",
                            effect: {
                                kind: "engageEnemyFromConnectedLocation",
                            },
                        },
                    ],
                },
                {
                    id: "dormitories",
                    name: "Dormitories",
                    shroud: 0,
                    code: "8675309h",
                    clues: 0,
                    revealed: true,
                    connections: ["student-union"],
                    investigatorsHere: [],
                    isVisible: true,
                    mapPosition: { x: 1, y: 0 },
                    text: [],
                    traits: [],
                },
                {
                    id: "quad",
                    name: "Quad",
                    shroud: 0,
                    code: "8675309i",
                    clues: 0,
                    revealed: true,
                    connections: [],
                    investigatorsHere: [],
                    isVisible: true,
                    mapPosition: { x: 2, y: 0 },
                    text: [],
                    traits: [],
                },
            ],
            enemies: [
                {
                    id: "enemy-valid",
                    name: "Ghoul Minion",
                    fight: 2,
                    evade: 2,
                    health: 2,
                    damage: 1,
                    horror: 0,
                    locationId: "dormitories",
                    engagedInvestigatorId: null,
                    exhausted: false,
                    damageOnEnemy: 0,
                },
                {
                    id: "enemy-invalid",
                    name: "Corpse-Hungry Ghoul",
                    fight: 3,
                    evade: 2,
                    health: 3,
                    damage: 1,
                    horror: 1,
                    locationId: "quad",
                    engagedInvestigatorId: null,
                    exhausted: false,
                    damageOnEnemy: 0,
                },
            ],
            pendingInteractiveTargetSelection: null,
            log: [],
        });
    });

    it("only offers connected enemies as valid targets", () => {
        useGameStore.getState().locationAbility(0);

        const state = useGameStore.getState();

        expect(state.pendingInteractiveTargetSelection).not.toBeNull();
        expect(state.pendingInteractiveTargetSelection?.validEnemyIds).toEqual([
            "enemy-valid",
        ]);
    });

    it("moves the chosen valid enemy and engages it", () => {
        useGameStore.getState().locationAbility(0);
        useGameStore.getState().chooseInteractiveEnemyTarget("enemy-valid");

        const state = useGameStore.getState();
        const movedEnemy = state.enemies.find((e) => e.id === "enemy-valid");

        expect(movedEnemy?.locationId).toBe("student-union");
        expect(movedEnemy?.engagedInvestigatorId).toBe("investigator-1");
        expect(state.pendingInteractiveTargetSelection).toBeNull();
    });
});
