import type {
  ScenarioCardDefinition,
  ScenarioDefinition,
} from "../data/scenarios/scenarioTypes";
import { buildScenarioEnemies } from "./buildScenarioEnemies";
import { getPreferredEnemyTargetId } from "./gameStateHelpers";
import type {
  Enemy,
  GameLocation,
  GameLogItem,
  ScenarioCardState,
} from "../types/game";

export type ScenarioEffectState = {
  locations: GameLocation[];
  enemies: Enemy[];
  log: GameLogItem[];
  investigatorId: string;
  currentLocationId: string | null;
  selectedEnemyTargetId: string | null;
  agenda: ScenarioCardState | null;
  act: ScenarioCardState | null;
};

export type ScenarioEffectResult = ScenarioEffectState & {
  advanceAgendaRequested: boolean;
  advanceActRequested: boolean;
};

function applyCardAdvanceEffects(
  card: ScenarioCardDefinition | undefined,
  state: ScenarioEffectState,
): ScenarioEffectResult {
  if (!card?.onAdvance) {
    return {
      ...state,
      advanceAgendaRequested: false,
      advanceActRequested: false,
    };
  }

  const {
    showLocationIds = [],
    revealLocationIds = [],
    spawnEnemies = [],
    engageOnSpawn = true,
    revealSpawnLocations = false,
    logEntries = [],
    agendaProgressDelta,
    actProgressDelta,
    setAgendaProgress,
    setActProgress,
    advanceAgenda = false,
    advanceAct = false,
  } = card.onAdvance;

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

  const revealSet = new Set(revealLocationIds);
  const showSet = new Set(showLocationIds);
  const spawnedRevealSet = new Set(
    revealSpawnLocations ? spawnedEnemies.map((enemy) => enemy.locationId) : [],
  );

  const updatedLocations = state.locations.map((location) => {
    if (revealSet.has(location.id) || spawnedRevealSet.has(location.id)) {
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

  const updatedAgenda = state.agenda
    ? {
        ...state.agenda,
        progress: Math.max(
          0,
          setAgendaProgress ??
            state.agenda.progress + (agendaProgressDelta ?? 0),
        ),
      }
    : null;

  const updatedAct = state.act
    ? {
        ...state.act,
        progress: Math.max(
          0,
          setActProgress ?? state.act.progress + (actProgressDelta ?? 0),
        ),
      }
    : null;

  return {
    locations: updatedLocations,
    enemies: updatedEnemies,
    log: [...state.log, ...logEntries, ...engagementLogEntries],
    investigatorId: state.investigatorId,
    currentLocationId: state.currentLocationId,
    selectedEnemyTargetId,
    agenda: updatedAgenda,
    act: updatedAct,
    advanceAgendaRequested: advanceAgenda,
    advanceActRequested: advanceAct,
  };
}

export function applyScenarioActAdvanceEffects(
  scenario: ScenarioDefinition,
  actId: string,
  state: ScenarioEffectState,
): ScenarioEffectResult {
  const act = scenario.acts?.find((entry) => entry.id === actId);
  return applyCardAdvanceEffects(act, state);
}

export function applyScenarioAgendaAdvanceEffects(
  scenario: ScenarioDefinition,
  agendaId: string,
  state: ScenarioEffectState,
): ScenarioEffectResult {
  const agenda = scenario.agendas?.find((entry) => entry.id === agendaId);
  return applyCardAdvanceEffects(agenda, state);
}
