import type { ChaosToken, Enemy, GameLocation } from "../../types/game";

export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  startingLocationId: string;
  locations: GameLocation[];
  enemies: Enemy[];
  chaosBag?: ChaosToken[];
}
