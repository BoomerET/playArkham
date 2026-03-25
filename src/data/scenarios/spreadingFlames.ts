import type { ScenarioDefinition } from "./scenarioTypes";

export const spreadingFlamesScenario: ScenarioDefinition = {
  id: "spreading-flames",
  name: "Spreading Flames",
  description: "A recent spate of fires and grisly “accidents” have the entire city on edge.",
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
      mapPosition: { x: 22, y: 50 },
      isVisible: true,
    },
    {
      id: "dormitories",
      name: "Dormitories",
      shroud: 3,
      clues: 1,
      revealed: false,
      connections: ["friends-room"],
      investigatorsHere: [],
      mapPosition: { x: 50, y: 50 },
      isVisible: false,
    },
  ],
  enemySpawns: [
    {
      enemyId: "ghoul-priest",
      locationId: "cellar",
    },
  ],
};

