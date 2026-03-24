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
    },
    {
      id: "hallway",
      name: "Hallway",
      shroud: 1,
      clues: 0,
      revealed: true,
      connections: ["study", "attic", "cellar"],
      investigatorsHere: [],
      mapPosition: { x: 50, y: 50 },
    },
    {
      id: "attic",
      name: "Attic",
      shroud: 1,
      clues: 2,
      revealed: true,
      connections: ["hallway"],
      investigatorsHere: [],
      mapPosition: { x: 50, y: 18 },
    },
    {
      id: "cellar",
      name: "Cellar",
      shroud: 4,
      clues: 2,
      revealed: true,
      connections: ["hallway"],
      investigatorsHere: [],
      mapPosition: { x: 50, y: 82 },
    },
  ],
  enemySpawns: [
    {
      enemyId: "ghoul-priest",
      locationId: "cellar",
    },
  ],
};
