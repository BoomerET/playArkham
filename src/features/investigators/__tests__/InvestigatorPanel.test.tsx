import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import InvestigatorPanel from "../InvestigatorPanel";

// mock the store module your component imports
vi.mock("../../../store/gameStore", () => {
  const state = {
    pendingAssetPlay: null,
    togglePendingAssetReplacementChoice: vi.fn(),
    confirmAssetReplacement: vi.fn(),
    cancelPendingAssetPlay: vi.fn(),
    investigator: {
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
    },
    playArea: [],
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
            label: "Set Test Flag",
            trigger: "action",
            text: "You flip a mysterious switch.",
            effect: {
              kind: "setScenarioFlag",
              key: "testFlag",
              value: true,
            },
          },
          {
            label: "Hidden Compartment",
            trigger: "action",
            text: "The switch reveals a hidden compartment.",
            effect: {
              kind: "gainResources",
              amount: 1,
            },
            requiresFlag: {
              key: "testFlag",
              equals: true,
            },
          },
        ],
      },
    ],
    campaignState: {
      previousScenarioOutcome: null,
      randomizedSelectionsByCampaignKey: {},
      scenarioFlags: {},
    },
    turn: {
      phase: "investigation",
      round: 1,
      actionsRemaining: 3,
      currentInvestigatorIndex: 0,
    },
    selectedEnemyTargetId: null,
    setSelectedEnemyTarget: vi.fn(),
    spendResource: vi.fn(),
    gainClue: vi.fn(),
    takeDamage: vi.fn(),
    takeHorror: vi.fn(),
    takeResourceAction: vi.fn(),
    takeDrawAction: vi.fn(),
    investigateAction: vi.fn(),
    fightAction: vi.fn(),
    evadeAction: vi.fn(),
    engageEnemy: vi.fn(),
    parleyAction: vi.fn(),
    resignAction: vi.fn(),
    locationAbility: vi.fn(),
    pendingInteractiveTargetSelection: null,
    chooseInteractiveEnemyTarget: vi.fn(),
    cancelInteractiveTargetSelection: vi.fn(),
  };

  return {
    useGameStore: (selector: (s: typeof state) => unknown) => selector(state),
  };
});

describe("InvestigatorPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows only abilities whose flag requirements are satisfied", () => {
    render(<InvestigatorPanel />);

    expect(screen.getByText(/Set Test Flag/i)).toBeInTheDocument();
    expect(screen.queryByText(/Hidden Compartment/i)).not.toBeInTheDocument();
  });
});

