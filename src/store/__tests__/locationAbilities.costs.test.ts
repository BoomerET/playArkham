import { describe, expect, it, vi, beforeEach } from "vitest";
import { useGameStore } from "../gameStore";

describe("locationAbility action costs", () => {
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
                resources: 5,
                clues: 0,
            },
            turn: {
                ...state.turn,
                phase: "investigation",
                actionsRemaining: 3,
            },
            enemies: [],
            locations: [
                {
                    id: "student-union",
                    name: "Student Union",
                    clues: 0,
                    revealed: true,
                    connections: [],
                    investigatorsHere: ["investigator-1"],
                    isVisible: true,
                    mapPosition: { x: 0, y: 0 },
                    text: [],
                    traits: [],
                    abilities: [
                        {
                            label: "Big Effort",
                            trigger: "doubleAction",
                            costsActions: 2,
                            text: "Spend 2 actions to gain 1 resource.",
                            effect: {
                                kind: "gainResources",
                                amount: 1,
                            },
                        },
                    ],
                },
            ],
            log: [],
        });
    });

    it("spends 2 actions for a doubleAction ability", () => {
        useGameStore.getState().locationAbility(0);

        const state = useGameStore.getState();

        expect(state.turn.actionsRemaining).toBe(1);
        expect(state.investigator.resources).toBe(6);
    });

    it("does not execute if fewer than 2 actions remain", () => {
        useGameStore.setState((state) => ({
            ...state,
            turn: {
                ...state.turn,
                actionsRemaining: 1,
            },
        }));

        useGameStore.getState().locationAbility(0);

        const state = useGameStore.getState();

        expect(state.turn.actionsRemaining).toBe(1);
        expect(state.investigator.resources).toBe(5);
        expect(
            state.log.some(
                (entry) =>
                    typeof entry !== "string" &&
                    entry.text.includes("Not enough actions remaining"),
            ),
        ).toBe(true);
    });
});
