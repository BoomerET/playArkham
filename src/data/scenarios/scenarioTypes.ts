import type { ChaosToken, EnemySpawn, GameLocation } from "../../types/game";

export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  startingLocationId: string;
  locations: GameLocation[];
  enemySpawns: EnemySpawn[];
  chaosBag?: ChaosToken[];
}
