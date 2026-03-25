import type { ScenarioDefinition } from "./scenarioTypes";

export const spreadingFlamesScenario: ScenarioDefinition = {
  id: "spreading-flames",
  name: "Spreading Flames",
  description: "A simple beach where people are trying to have a good time.",
  startingLocationId: "changeroom",
  locations: [
    {
      id: "friends-room",
      name: "Your Friend's Room",
      shroud: 2,
      clues: 2,
      revealed: true,
      connections: [],
      investigatorsHere: [],
      mapPosition: { x: 22, y: 50 },
      isVisible: true,
    },
  ],
  enemySpawns: [
    {
      enemyId: "ghoul-priest",
      locationId: "cellar",
    },
  ],
};
