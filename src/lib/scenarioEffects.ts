import type { GameLocation } from "../types/game";

export interface ScenarioEffectState {
  locations: GameLocation[];
  log: string[];
}

export function applyScenarioActAdvanceEffects(
  scenarioId: string,
  actId: string,
  state: ScenarioEffectState,
): ScenarioEffectState {
  if (scenarioId === "the-gathering" && actId === "gathering-act-2a") {
    const hallway = state.locations.find((location) => location.id === "hallway");

    if (!hallway) {
      return state;
    }

    if (hallway.isVisible && hallway.revealed) {
      return state;
    }

    return {
      locations: state.locations.map((location) =>
        location.id === "hallway"
          ? {
              ...location,
              isVisible: true,
              revealed: true,
            }
          : location,
      ),
      log: [...state.log, "Act effect: The Hallway is revealed."],
    };
  }

  return state;
}

export function applyScenarioAgendaAdvanceEffects(
  scenarioId: string,
  agendaId: string,
  state: ScenarioEffectState,
): ScenarioEffectState {
  if (scenarioId === "the-gathering" && agendaId === "gathering-agenda-2a") {
    const cellar = state.locations.find((location) => location.id === "cellar");

    if (!cellar) {
      return state;
    }

    if (cellar.isVisible) {
      return state;
    }

    return {
      locations: state.locations.map((location) =>
        location.id === "cellar"
          ? {
              ...location,
              isVisible: true,
            }
          : location,
      ),
      log: [...state.log, "Agenda effect: The Cellar is now visible."],
    };
  }

  return state;
}
