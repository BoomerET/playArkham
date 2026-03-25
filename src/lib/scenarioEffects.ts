import type {
  ScenarioCardDefinition,
  ScenarioDefinition,
} from "../data/scenarios/scenarioTypes";
import { buildScenarioEnemies } from "./buildScenarioEnemies";
import { getPreferredEnemyTargetId } from "./gameStateHelpers";
import type { Enemy, GameLocation } from "../types/game";

type ScenarioEffectState = {
  locations: GameLocation[];
  enemies: Enemy[];
  log: string[];
  investigatorId: string;
  currentLocationId: string | null;
  selectedEnemyTargetId: string | null;
};

function applyCardAdvanceEffects(
  card: ScenarioCardDefinition | undefined,
  state: ScenarioEffectState,
): ScenarioEffectState {
  if (!card?.onAdvance) {
    return state;
  }

  const {
    showLocationIds = [],
    revealLocationIds = [],
    spawnEnemies = [],
    engageOnSpawn = true,
    logEntries = [],
  } = card.onAdvance;

  const showSet = new Set(showLocationIds);
  const revealSet = new Set(revealLocationIds);

  const updatedLocations = state.locations.map((location) => {
    if (revealSet.has(location.id)) {
      return {
        ...location,
        isVisible: true,
        revealed: true,
      };
    }

    if (showSet.has(location.id)) {
      return {
        ...location,
        isVisible: true,
      };
    }

    return location;
  });

  const rawSpawnedEnemies =
    spawnEnemies.length > 0 ? buildScenarioEnemies(spawnEnemies) : [];

  const spawnedEnemies = rawSpawnedEnemies.map((enemy) => {
    const shouldEngageOnSpawn =
      engageOnSpawn &&
      state.currentLocationId !== null &&
      enemy.locationId === state.currentLocationId &&
      enemy.engagedInvestigatorId === null &&
      !enemy.exhausted;

    if (!shouldEngageOnSpawn) {
      return enemy;
    }

    return {
      ...enemy,
      engagedInvestigatorId: state.investigatorId,
    };
  });

  const updatedEnemies = [...state.enemies, ...spawnedEnemies];

  const spawnedEngagedEnemy = spawnedEnemies.find(
    (enemy) => enemy.engagedInvestigatorId === state.investigatorId,
  );

  const selectedEnemyTargetId = state.currentLocationId
    ? getPreferredEnemyTargetId(
        updatedEnemies,
        state.currentLocationId,
        state.investigatorId,
        spawnedEngagedEnemy?.id ?? state.selectedEnemyTargetId,
      )
    : null;

  const engagementLogEntries =
    spawnedEnemies.some(
      (enemy) => enemy.engagedInvestigatorId === state.investigatorId,
    ) && state.currentLocationId
      ? ["Scenario effect: A newly spawned enemy engaged the investigator."]
      : [];

  return {
    locations: updatedLocations,
    enemies: updatedEnemies,
    log: [...state.log, ...logEntries, ...engagementLogEntries],
    investigatorId: state.investigatorId,
    currentLocationId: state.currentLocationId,
    selectedEnemyTargetId,
  };
}

export function applyScenarioActAdvanceEffects(
  scenario: ScenarioDefinition,
  actId: string,
  state: ScenarioEffectState,
): ScenarioEffectState {
  const act = scenario.acts?.find((entry) => entry.id === actId);
  return applyCardAdvanceEffects(act, state);
}

export function applyScenarioAgendaAdvanceEffects(
  scenario: ScenarioDefinition,
  agendaId: string,
  state: ScenarioEffectState,
): ScenarioEffectState {
  const agenda = scenario.agendas?.find((entry) => entry.id === agendaId);
  return applyCardAdvanceEffects(agenda, state);
}
