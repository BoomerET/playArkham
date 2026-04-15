import { describe, expect, it } from "vitest";
import { resolveLocationAbilityEffect } from "../../store/locationAbilities";
import type { Enemy, GameLocation, Investigator } from "../../types/game";
import { type CampaignState } from "../../lib/campaignSetup";

describe("resolveLocationAbilityEffect", () => {
  it("moves a chosen enemy from a connected location and engages it", () => {
    const investigator: Investigator = {
      id: "investigator-1",
      name: "Joe Diamond",
      faction: "seeker",
      health: 8,
      sanity: 6,
      damage: 0,
      horror: 0,
      resources: 5,
      clues: 0,
      willpower: 3,
      intellect: 4,
      combat: 2,
      agility: 3,
      portrait: "",
      portraitBack: "",
      portraitHead: "",
      code: "12004",
    };

    const locations: GameLocation[] = [
      {
        id: "student-union",
        name: "Student Union",
        code: "8675309d",
        clues: 0,
        shroud: 0,
        revealed: true,
        connections: ["dormitories"],
        investigatorsHere: [investigator.id],
        isVisible: true,
        mapPosition: { x: 0, y: 0 },
        text: [],
        traits: [],
      },
      {
        id: "dormitories",
        name: "Dormitories",
        code: "8675309e",
        clues: 0,
        shroud: 0,
        revealed: true,
        connections: ["student-union"],
        investigatorsHere: [],
        isVisible: true,
        mapPosition: { x: 1, y: 0 },
        text: [],
        traits: [],
      },
    ];

    const enemies: Enemy[] = [
      {
        id: "enemy-1",
        name: "Ghoul",
        fight: 2,
        evade: 2,
        health: 3,
        damage: 1,
        horror: 0,
        locationId: "dormitories",
        engagedInvestigatorId: null,
        exhausted: false,
        damageOnEnemy: 0,
      },
    ];

    const campaignState: CampaignState = {
      previousScenarioOutcome: null,
      randomizedSelectionsByCampaignKey: {},
      scenarioFlags: {},
    };

    const result = resolveLocationAbilityEffect({
      effect: { kind: "engageEnemyFromConnectedLocation" },
      investigator,
      currentLocationId: "student-union",
      locations,
      enemies,
      campaignState,
      targetEnemyId: "enemy-1",
    });

    expect(result.enemies[0].locationId).toBe("student-union");
    expect(result.enemies[0].engagedInvestigatorId).toBe(investigator.id);
  });

  it("sets a scenario flag", () => {
    const investigator = {
      id: "investigator-1",
      name: "Joe Diamond",
      faction: "seeker",
      health: 8,
      sanity: 6,
      damage: 0,
      horror: 0,
      resources: 5,
      clues: 0,
      willpower: 3,
      intellect: 4,
      combat: 2,
      agility: 3,
      portrait: "",
      portraitBack: "",
      portraitHead: "",
      code: "12004",
    } satisfies Investigator;

    const result = resolveLocationAbilityEffect({
      effect: { kind: "setScenarioFlag", key: "testFlag", value: true },
      investigator,
      currentLocationId: "student-union",
      locations: [],
      enemies: [],
      campaignState: {
        previousScenarioOutcome: null,
        randomizedSelectionsByCampaignKey: {},
        scenarioFlags: {},
      },
    });

    expect(result.campaignState.scenarioFlags.testFlag).toBe(true);
  });
});

