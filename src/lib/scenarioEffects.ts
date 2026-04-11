import type {
  ScenarioCardDefinition,
  ScenarioDefinition,
} from "../data/scenarios/scenarioTypes";
import type {
  Enemy,
  GameLocation,
  GameLogItem,
  PlayerCard,
  ScenarioCardState,
} from "../types/game";

export type ScenarioEffectState = {
  agenda: ScenarioCardState | null;
  act: ScenarioCardState | null;
  locations: GameLocation[];
  enemies: Enemy[];
  playArea: PlayerCard[];
  log: GameLogItem[];
  investigatorId: string;
  currentLocationId: string | null;
  selectedEnemyTargetId: string | null;
  grantedPlayerCards?: PlayerCard[];
  campaignOutcomeToSet?: string | null;
};

type ScenarioEffectResult = ScenarioEffectState & {
  advanceAgendaRequested?: boolean;
  advanceActRequested?: boolean;
};

function convertEncounterStoryCardToPlayerCard(
  scenario: ScenarioDefinition,
  encounterCardId: string,
): PlayerCard | null {
  const encounterCard = scenario.encounterDeck?.find(
    (card) => card.id === encounterCardId,
  );

  if (!encounterCard) {
    return null;
  }

  return {
    instanceId: encounterCard.id,
    name: encounterCard.name,
    type: "asset",
    faction: "neutral",
    text: Array.isArray(encounterCard.text)
      ? encounterCard.text.join(" ")
      : encounterCard.text,
    traits: encounterCard.traits,
    image: encounterCard.code ? `${encounterCard.code}.png` : undefined,
    exhausted: false,
  };
}

function applyCardAdvanceEffects(
  scenario: ScenarioDefinition,
  card: ScenarioCardDefinition | undefined,
  state: ScenarioEffectState,
): ScenarioEffectResult {
  if (!card?.onAdvance) {
    return state;
  }

  const {
    showLocationIds = [],
    revealLocationIds = [],
    hideLocationIds = [],
    unrevealLocationIds = [],
    logEntries = [],
    advanceAgenda = false,
    advanceAct = false,
    grantEncounterCardToInvestigator,
    setPreviousScenarioOutcome,
  } = card.onAdvance;

  const effectLogEntries = [...logEntries];

  const showSet = new Set(showLocationIds);
  const revealSet = new Set(revealLocationIds);
  const hideSet = new Set(hideLocationIds);
  const unrevealSet = new Set(unrevealLocationIds);

  const updatedLocations = state.locations.map((location) => {
    if (hideSet.has(location.id)) {
      return {
        ...location,
        isVisible: false,
        investigatorsHere: [],
      };
    }

    if (unrevealSet.has(location.id)) {
      return {
        ...location,
        revealed: false,
      };
    }

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

  const grantedPlayerCards = [...(state.grantedPlayerCards ?? [])];

  if (grantEncounterCardToInvestigator) {
    const grantedCard = convertEncounterStoryCardToPlayerCard(
      scenario,
      grantEncounterCardToInvestigator,
    );

    if (grantedCard) {
      grantedPlayerCards.push(grantedCard);
      effectLogEntries.push(
        `${grantedCard.name} enters play under your control.`,
      );
    }
  }

  return {
    ...state,
    locations: updatedLocations,
    log: [...state.log, ...effectLogEntries],
    grantedPlayerCards,
    advanceAgendaRequested: advanceAgenda,
    advanceActRequested: advanceAct,
    campaignOutcomeToSet:
      setPreviousScenarioOutcome ?? state.campaignOutcomeToSet ?? null,
  };
}

export function applyScenarioActAdvanceEffects(
  scenario: ScenarioDefinition,
  actId: string,
  state: ScenarioEffectState,
): ScenarioEffectResult {
  const act = scenario.acts?.find((entry) => entry.id === actId);
  return applyCardAdvanceEffects(scenario, act, state);
}

export function applyScenarioAgendaAdvanceEffects(
  scenario: ScenarioDefinition,
  agendaId: string,
  state: ScenarioEffectState,
): ScenarioEffectResult {
  const agenda = scenario.agendas?.find((entry) => entry.id === agendaId);
  return applyCardAdvanceEffects(scenario, agenda, state);
}
