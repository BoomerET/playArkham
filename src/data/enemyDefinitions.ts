import type { EnemyDefinition } from "../types/game";

export const enemyDefinitions: EnemyDefinition[] = [
  {
    id: "ghoul-priest",
    name: "Ghoul Priest",
    fight: 4,
    evade: 4,
    health: 5,
    damage: 2,
    horror: 2,
  },
  {
    id: "swarm-of-rats",
    name: "Swarm of Rats",
    fight: 1,
    evade: 1,
    health: 1,
    damage: 1,
    horror: 0,
  },
];
