import { buildScenarioEnemies } from "./buildScenarioEnemies";
import type { ScenarioCardDefinition, ScenarioDefinition } from "../data/scenarios/scenarioTypes";
import type { Enemy, GameLocation } from "../types/game";

type ScenarioEffectState = {
  locations: GameLocation[];
  enemies: Enemy[];
  log: string[];
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

  const spawnedEnemies =
    spawnEnemies.length > 0 ? buildScenarioEnemies(spawnEnemies) : [];

  return {
    locations: updatedLocations,
    enemies: [...state.enemies, ...spawnedEnemies],
    log: [...state.log, ...logEntries],
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
