import type {
  ChaosToken,
  EnemySpawn,
  GameLocation,
  ScenarioCardKind,
} from "../../types/game";

export interface ScenarioCardDefinition {
  id: string;
  kind: ScenarioCardKind;
  sequence: string;
  title: string;
  text: string;
  threshold: number;
  thresholdLabel: string;
  startingProgress?: number;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  startingLocationId: string;
  locations: GameLocation[];
  enemySpawns: EnemySpawn[];
  chaosBag?: ChaosToken[];
  agendas?: ScenarioCardDefinition[];
  acts?: ScenarioCardDefinition[];
}
