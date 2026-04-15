import { describe, expect, it } from "vitest";
import { applyConditionalLocationVisibility } from "../../store/locationVisibility";
import type { GameLocation } from "../../types/game";
import { type CampaignState } from "../../lib/campaignSetup"

describe("applyConditionalLocationVisibility", () => {
  it("reveals a hidden location when its flag condition is met", () => {
    const locations: GameLocation[] = [
      {
        id: "hall",
        shroud: 1,
        clues: 0,
        code: "8675309a",
        name: "Hall",
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
        code: "8675309b",
        name: "Secret Room",
        shroud: 1,
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
        code: "8675309c",
        clues: 1,
        shroud: 0,
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

