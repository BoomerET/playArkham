import type {
  ChaosToken,
  EnemySpawn,
  GameLocation,
  ScenarioCardKind,
  EncounterCard,
  ScenarioStatus,
  CardAbilityDefinition,
} from "../../types/game";

export interface ScenarioAdvanceEffects {
  showLocationIds?: string[];
  revealLocationIds?: string[];
  hideLocationIds?: string[];
  unrevealLocationIds?: string[];
  spawnEnemies?: EnemySpawn[];
  engageOnSpawn?: boolean;
  revealSpawnLocations?: boolean;
  logEntries?: string[];
  agendaProgressDelta?: number;
  actProgressDelta?: number;
  setAgendaProgress?: number;
  setActProgress?: number;
  advanceAgenda?: boolean;
  advanceAct?: boolean;
  winScenario?: boolean;
  loseScenario?: boolean;
  resolutionText?: string;
  resolutionTitle?: string;
  resolutionSubtitle?: string;
  grantEncounterCardToInvestigator?: string;
  setPreviousScenarioOutcome?: string;

  spawnSetAsideEnemy?: {
    enemyCode: string;
    locationId: string;
  };

  attachSetAsideCardToLocation?: {
    cardCode: string;
    locationId: string;
  };
}

export interface ScenarioCardDefinition {
  id: string;
  code?: string;
  kind: ScenarioCardKind;
  sequence: string;
  title: string;
  text: string;
  threshold: number;
  thresholdLabel: string;
  startingProgress?: number;
  onAdvance?: ScenarioAdvanceEffects;
  abilities?: CardAbilityDefinition[];
}

export type ScenarioResolutionEffects = {
  scenarioStatus?: ScenarioStatus;
  resolutionText?: string;
  resolutionTitle?: string;
  resolutionSubtitle?: string;
  setPreviousScenarioOutcome?: string;
};

export type ScenarioResignResolution = {
  title?: string;
  subtitle?: string;
  text: string;
  effects?: ScenarioResolutionEffects;
};

export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  startingLocationId: string;
  locations: GameLocation[];
  enemySpawns?: EnemySpawn[];
  chaosBag?: ChaosToken[];
  agendas?: ScenarioCardDefinition[];
  acts?: ScenarioCardDefinition[];
  setupNotes?: ScenarioSetupNotes;
  randomizedSelections?: ScenarioRandomizedSelection[];
  campaignKey?: string;
  campaignOutcome?: string;
  randomizedLocationOptions?: ScenarioRandomizedLocationGroup[];
  encounterCardCodes?: string[];
  encounterDeck?: EncounterCard[];
  resign?: ScenarioResignResolution;
  abilities?: CardAbilityDefinition[];
  locationAttachments?: {
    locationId: string;
    cardCode: string;
  }[];
  setAsideEncounterCards?: EncounterCard[];
}

export interface ScenarioRandomizedLocationOption {
  optionId: string;
  location: GameLocation;
}

export interface ScenarioRandomizedLocationGroup {
  slotId: string;
  placeholderLocationId: string;
  options: ScenarioRandomizedLocationOption[];
}

export interface ScenarioSetupNotes {
  previousScenarioOutcome?: string;
  notes?: string[];
}

export interface ScenarioRandomizedSelection {
  slotId: string;
  chosenOptionId: string;
  optionIds: string[];
}

export interface ScenarioSetupNotes {
  previousScenarioOutcome?: string;
  notes?: string[];
}

export interface ScenarioRandomizedSelection {
  slotId: string;
  chosenOptionId: string;
  optionIds: string[];
}
