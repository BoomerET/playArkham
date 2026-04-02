import type { ScenarioDefinition } from "./scenarioTypes";

export const spreadingFlamesScenario: ScenarioDefinition = {
  id: "spreading-flames",
  name: "Spreading Flames",
  description:
    "A recent spate of fires and grisly “accidents” have the entire city on edge.",
  startingLocationId: "friends-room",
  locations: [
    {
      id: "friends-room",
      name: "Your Friend's Room",
      shroud: 2,
      clues: 2,
      revealed: true,
      connections: ["dormitories"],
      investigatorsHere: [],
      mapPosition: { x: 22, y: 78 },
      isVisible: true,
      onAdvance: {
        showLocationIds: ["dormitories", "miskatonic-quad"],
        logEntries: ["Act effect: The Hallway is revealed."],
        advanceAgenda: true,
      }
    },
    {
      id: "dormitories",
      name: "Dormitories",
      shroud: 3,
      clues: 1,
      revealed: false,
      connections: ["friends-room", "miskatonic-quad"],
      investigatorsHere: [],
      mapPosition: { x: 50, y: 78 },
      isVisible: false,
    },
    {
      id: "miskatonic-quad",
      name: "Miskatonic Quad",
      shroud: 1,
      clues: 0,
      revealed: false,
      connections: [
        "dormitories",
        "science-hall",
        "science-hall",
        "orne-library",
        "warren-observatory",
      ],
      investigatorsHere: [],
      mapPosition: { x: 50, y: 50 },
      isVisible: false,
    },
    {
      id: "science-hall",
      name: "Science Hall",
      shroud: 2,
      clues: 1,
      revealed: false,
      connections: ["miskatonic-quad"],
      investigatorsHere: [],
      mapPosition: { x: 78, y: 50 },
      isVisible: false,
    },
    {
      id: "orne-library",
      name: "Orne Library",
      shroud: 4,
      clues: 1,
      revealed: false,
      connections: ["miskatonic-quad"],
      investigatorsHere: [],
      mapPosition: { x: 22, y: 50 },
      isVisible: false,
    },
    {
      id: "warren-observatory",
      name: "Warren Observatory",
      shroud: 3,
      clues: 1,
      revealed: false,
      connections: ["miskatonic-quad"],
      investigatorsHere: [],
      mapPosition: { x: 50, y: 22 },
      isVisible: false,
    },
  ],
  enemySpawns: [
    {
      enemyId: "ghoul-priest",
      locationId: "cellar",
    },
  ],
  acts: [
    {
      id: "spreading-flames-act-1",
      kind: "act",
      sequence: "1a",
      title: "Where There's Smoke",
      text: "You are searching the dormitories for nay sign of your friend.",
      threshold: 2,
      thresholdLabel: "Clues",
      onAdvance: {
        showLocationIds: ["dormitories", "miskatonic-quad"],
      }
    },
  ],
};
