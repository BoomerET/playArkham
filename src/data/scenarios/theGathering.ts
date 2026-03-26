import type { ScenarioDefinition } from "./scenarioTypes";

export const theGatheringScenario: ScenarioDefinition = {
  id: "the-gathering",
  name: "The Gathering",
  description: "A simple house map with a central hallway.",
  startingLocationId: "study",

  locations: [
    {
      id: "study",
      name: "Study",
      shroud: 2,
      clues: 2,
      revealed: true,
      connections: ["hallway"],
      investigatorsHere: [],
      mapPosition: { x: 22, y: 50 },
      isVisible: true,
    },
    {
      id: "hallway",
      name: "Hallway",
      shroud: 1,
      clues: 0,
      revealed: false,
      connections: ["study", "attic", "cellar"],
      investigatorsHere: [],
      mapPosition: { x: 50, y: 50 },
      isVisible: false,
    },
    {
      id: "attic",
      name: "Attic",
      shroud: 1,
      clues: 2,
      revealed: false,
      connections: ["hallway"],
      investigatorsHere: [],
      mapPosition: { x: 50, y: 18 },
      isVisible: false,
    },
    {
      id: "cellar",
      name: "Cellar",
      shroud: 4,
      clues: 2,
      revealed: false,
      connections: ["hallway"],
      investigatorsHere: [],
      mapPosition: { x: 50, y: 82 },
      isVisible: false,
    },
  ],

  enemySpawns: [],

  agendas: [
    {
      id: "gathering-agenda-1a",
      kind: "agenda",
      sequence: "1a",
      title: "What's Going On?!",
      text: "Something is terribly wrong inside your home. The darkness is closing in.",
      threshold: 3,
      thresholdLabel: "Doom",
      startingProgress: 0,
    },
    {
      id: "gathering-agenda-2a",
      kind: "agenda",
      sequence: "2a",
      title: "The House Stirs",
      text: "The unnatural presence in the house grows stronger with every passing moment.",
      threshold: 5,
      thresholdLabel: "Doom",
      startingProgress: 0,
      onAdvance: {
        showLocationIds: ["cellar"],
        spawnEnemies: [
          {
            enemyId: "ghoul-priest",
            locationId: "cellar",
          },
        ],
        engageOnSpawn: false,
        logEntries: [
          "Agenda effect: The Cellar is now visible.",
          "Agenda effect: A terrible presence stirs below.",
        ],
      },
    },
    {
      id: "gathering-agenda-3a",
      kind: "agenda",
      sequence: "3a",
      title: "Consumed by the House",
      text: "The house has fully awakened, and there is no escape from the darkness within.",
      threshold: 99,
      thresholdLabel: "Doom",
      startingProgress: 0,
      onAdvance: {
        loseScenario: true,
        resolutionText:
          "The darkness in your home overwhelms you. You are consumed by the nightmare within.",
        logEntries: [
          "Agenda effect: The house closes in around you.",
        ],
      },
    },
  ],

  acts: [
    {
      id: "gathering-act-1a",
      kind: "act",
      sequence: "1a",
      title: "Trapped",
      text: "You need to find a way through the house and discover what is causing these strange events.",
      threshold: 2,
      thresholdLabel: "Clues",
      startingProgress: 0,
    },
    {
      id: "gathering-act-2a",
      kind: "act",
      sequence: "2a",
      title: "Into the Dark",
      text: "The path deeper into the house opens. You steel yourself and press onward.",
      threshold: 2,
      thresholdLabel: "Clues",
      startingProgress: 0,
      onAdvance: {
        revealLocationIds: ["hallway"],
        logEntries: ["Act effect: The Hallway is revealed."],
      },
    },
    {
      id: "gathering-act-3a",
      kind: "act",
      sequence: "3a",
      title: "Escape the House",
      text: "You have discovered enough to flee the nightmare before it consumes you.",
      threshold: 1,
      thresholdLabel: "Clues",
      startingProgress: 0,
      onAdvance: {
        winScenario: true,
        resolutionText:
          "You escape your house alive, shaken by what you have seen, but determined to uncover the truth.",
        logEntries: [
          "Act effect: You have survived the nightmare in your home.",
        ],
      },
    },
  ],
};
