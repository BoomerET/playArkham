import { describe, expect, it } from "vitest";
import { applyConditionalLocationVisibility } from "../gameStateHelpers"; // adjust path if needed
import type { CampaignState, GameLocation } from "../../types/game";

describe("applyConditionalLocationVisibility", () => {
  it("reveals a hidden location when its flag condition is met", () => {
    const locations: GameLocation[] = [
      {
        id: "hall",
        name: "Hall",
        clues: 0,
        revealed: true,
        connections: ["secret-room"],
        investigatorsHere: [],
        isVisible: true,
        mapPosition: { x: 0, y: 0 },
        text: [],
        traits: [],
      },
      {
        id: "secret-room",
        name: "Secret Room",
        clues: 1,
        revealed: false,
        connections: ["hall"],
        investigatorsHere: [],
        isVisible: false,
        mapPosition: { x: 1, y: 0 },
        text: [],
        traits: [],
        revealCondition: {
          key: "testFlag",
          equals: true,
        },
      },
    ];

    const campaignState: CampaignState = {
      previousScenarioOutcome: null,
      randomizedSelectionsByCampaignKey: {},
      scenarioFlags: {
        testFlag: true,
      },
    };

    const result = applyConditionalLocationVisibility({
      locations,
      campaignState,
    });

    expect(result.find((l) => l.id === "secret-room")?.isVisible).toBe(true);
  });

  it("keeps a hidden location hidden when its flag condition is not met", () => {
    const locations: GameLocation[] = [
      {
        id: "secret-room",
        name: "Secret Room",
        clues: 1,
        revealed: false,
        connections: [],
        investigatorsHere: [],
        isVisible: false,
        mapPosition: { x: 1, y: 0 },
        text: [],
        traits: [],
        revealCondition: {
          key: "testFlag",
          equals: true,
        },
      },
    ];

    const campaignState: CampaignState = {
      previousScenarioOutcome: null,
      randomizedSelectionsByCampaignKey: {},
      scenarioFlags: {},
    };

    const result = applyConditionalLocationVisibility({
      locations,
      campaignState,
    });

    expect(result[0].isVisible).toBe(false);
  });
});

