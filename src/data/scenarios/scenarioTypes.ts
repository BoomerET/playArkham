import type {
  ChaosToken,
  EnemySpawn,
  GameLocation,
  ScenarioCardKind,
} from "../../types/game";

export interface ScenarioAdvanceEffects {
  showLocationIds?: string[];
  revealLocationIds?: string[];
  spawnEnemies?: EnemySpawn[];
  logEntries?: string[];
}

export interface ScenarioCardDefinition {
  id: string;
  kind: ScenarioCardKind;
  sequence: string;
  title: string;
  text: string;
  threshold: number;
  thresholdLabel: string;
  startingProgress?: number;
  onAdvance?: ScenarioAdvanceEffects;
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

export interface ScenarioAdvanceEffects {
  showLocationIds?: string[];
  revealLocationIds?: string[];
  spawnEnemies?: EnemySpawn[];
  engageOnSpawn?: boolean;
  logEntries?: string[];
}
