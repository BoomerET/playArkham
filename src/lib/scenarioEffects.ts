import { buildScenarioEnemies } from "./buildScenarioEnemies";
import type {
  ScenarioCardDefinition,
  ScenarioDefinition,
} from "../data/scenarios/scenarioTypes";
import type {
  Enemy,
  GameLocation,
  ScenarioCardState,
} from "../types/game";

export type ScenarioEffectState = {
  agenda: ScenarioCardState | null;
  act: ScenarioCardState | null;
  locations: GameLocation[];
  enemies: Enemy[];
  log: unknown[];
  investigatorId: string;
  currentLocationId: string | null;
  selectedEnemyTargetId: string | null;
};

type ScenarioEffectResult = ScenarioEffectState & {
  advanceAgendaRequested?: boolean;
  advanceActRequested?: boolean;
};

function applyCardAdvanceEffects(
  card: ScenarioCardDefinition | undefined,
  state: ScenarioEffectState,
): ScenarioEffectResult {
  if (!card?.onAdvance) {
    return state;
  }

  const {
    showLocationIds = [],
    revealLocationIds = [],
    spawnEnemies = [],
    logEntries = [],
    advanceAgenda = false,
    advanceAct = false,
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

  const spawnedEnemies =
    spawnEnemies.length > 0 ? buildScenarioEnemies(spawnEnemies) : [];

  return {
    ...state,
    locations: updatedLocations,
    enemies: [...state.enemies, ...spawnedEnemies],
    log: [...state.log, ...logEntries],
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
