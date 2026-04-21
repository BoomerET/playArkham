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
  LocationAttachment,
  EncounterCard,
} from "../types/game";

import { findCurrentLocation } from "./gameStateHelpers";
import { buildEnemyFromEncounterCard, enemyHasAloof, buildLocationAttachmentFromEncounterCard } from "../store/gameStore";
import { takeSetAsideEncounterCardByCode } from "../store/gsFunctions";

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
  locationAttachments: LocationAttachment[];
  setAsideEncounterCards: EncounterCard[];
};

type ScenarioEffectResult = ScenarioEffectState & {
  advanceAgendaRequested?: boolean;
  advanceActRequested?: boolean;
  setAsideEncounterCards: EncounterCard[];
  locationAttachments: LocationAttachment[];
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
    spawnSetAsideEnemy,
    attachSetAsideCardToLocation,
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

  let updatedEnemies = state.enemies;
  let updatedLocationAttachments = state.locationAttachments;
  let updatedSetAsideEncounterCards = state.setAsideEncounterCards;

  if (spawnSetAsideEnemy) {
    const {
      card,
      remainingSetAsideEncounterCards,
    } = takeSetAsideEncounterCardByCode({
      setAsideEncounterCards: updatedSetAsideEncounterCards,
      cardCode: spawnSetAsideEnemy.enemyCode,
    });

    if (!card) {
      effectLogEntries.push(
        `Could not find set-aside encounter card ${spawnSetAsideEnemy.enemyCode}.`,
      );
    } else if (card.type !== "enemy") {
      effectLogEntries.push(
        `${card.name} is not an enemy and could not be spawned.`,
      );
    } else {
      const spawnedEnemy = buildEnemyFromEncounterCard({
        card,
        locationId: spawnSetAsideEnemy.locationId,
      });

      const investigatorLocation = findCurrentLocation(
        updatedLocations,
        state.investigatorId,
      );

      if (
        investigatorLocation &&
        investigatorLocation.id === spawnSetAsideEnemy.locationId &&
        !enemyHasAloof(spawnedEnemy)
      ) {
        spawnedEnemy.engagedInvestigatorId = state.investigatorId;
      }

      updatedEnemies = [...updatedEnemies, spawnedEnemy];
      updatedSetAsideEncounterCards = remainingSetAsideEncounterCards;

      effectLogEntries.push(
        `${spawnedEnemy.name} spawned at ${spawnSetAsideEnemy.locationId} from the set-aside cards.`,
      );
    }
  }

  if (attachSetAsideCardToLocation) {
    const {
      card,
      remainingSetAsideEncounterCards,
    } = takeSetAsideEncounterCardByCode({
      setAsideEncounterCards: updatedSetAsideEncounterCards,
      cardCode: attachSetAsideCardToLocation.cardCode,
    });

    if (!card) {
      effectLogEntries.push(
        `Could not find set-aside encounter card ${attachSetAsideCardToLocation.cardCode}.`,
      );
    } else if (card.type === "enemy") {
      effectLogEntries.push(
        `${card.name} is an enemy and could not be attached to a location.`,
      );
    } else {
      const attachment = buildLocationAttachmentFromEncounterCard({
        card,
        locationId: attachSetAsideCardToLocation.locationId,
      });

      updatedLocationAttachments = [
        ...updatedLocationAttachments,
        attachment,
      ];
      updatedSetAsideEncounterCards = remainingSetAsideEncounterCards;

      effectLogEntries.push(
        `${attachment.name} was attached to ${attachSetAsideCardToLocation.locationId} from the set-aside cards.`,
      );
    }
  }

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
    enemies: updatedEnemies,
    locationAttachments: updatedLocationAttachments,
    setAsideEncounterCards: updatedSetAsideEncounterCards,
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
