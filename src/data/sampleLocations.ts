import type { Location } from "../types/game";

export const sampleLocations: Location[] = [
  {
    id: "study",
    name: "Study",
    shroud: 2,
    clues: 2,
    revealed: true,
    connections: ["hallway"],
    investigatorsHere: ["roland-banks"],
  },
  {
    id: "hallway",
    name: "Hallway",
    shroud: 1,
    clues: 0,
    revealed: true,
    connections: ["study", "attic", "cellar"],
    investigatorsHere: [],
  },
  {
    id: "attic",
    name: "Attic",
    shroud: 1,
    clues: 2,
    revealed: true,
    connections: ["hallway"],
    investigatorsHere: [],
  },
  {
    id: "cellar",
    name: "Cellar",
    shroud: 4,
    clues: 2,
    revealed: true,
    connections: ["hallway"],
    investigatorsHere: [],
  },
];

