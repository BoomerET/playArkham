import type {
  ScenarioCardDefinition,
  ScenarioDefinition,
} from "../data/scenarios/scenarioTypes";
import type { ScenarioCardState } from "../types/game";

export function buildScenarioCardState(
  definition: ScenarioCardDefinition,
): ScenarioCardState {
  return {
    id: definition.id,
    kind: definition.kind,
    sequence: definition.sequence,
    title: definition.title,
    text: definition.text,
    progress: definition.startingProgress ?? 0,
    threshold: definition.threshold,
    thresholdLabel: definition.thresholdLabel,
    code: definition.code,
  };
}

export function getInitialAgendaState(
  scenario: ScenarioDefinition,
): ScenarioCardState | null {
  const definition = scenario.agendas?.[0];

  if (!definition) {
    return {
      id: `${scenario.id}-agenda-placeholder`,
      kind: "agenda",
      sequence: "A",
      title: scenario.name,
      text: "No agenda data has been defined for this scenario yet.",
      progress: 0,
      threshold: 3,
      thresholdLabel: "Doom",
    };
  }

  return buildScenarioCardState(definition);
}

export function getInitialActState(
  scenario: ScenarioDefinition,
): ScenarioCardState | null {
  const definition = scenario.acts?.[0];

  if (!definition) {
    return {
      id: `${scenario.id}-act-placeholder`,
      kind: "act",
      sequence: "1a",
      title: scenario.name,
      text: "No act data has been defined for this scenario yet.",
      progress: 0,
      threshold: 2,
      thresholdLabel: "Clues",
    };
  }

  return buildScenarioCardState(definition);
}
