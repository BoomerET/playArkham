// buildPass: 0031

import {
  create,
} from "zustand";

import {
  investigators,
} from "../data/investigators";

import {
  defaultScenarioId,
  scenarios,
} from "../data/scenarios";

import {
  getChaosTokenModifier,
} from "../lib/chaosToken";

import {
  readyEnemies,
  takeSetAsideEncounterCardByCode,
  hasReadyEngagedEnemy,
  removeOneEncounterCardByCode,
  enemyHasAloof,
  enemyHasHunter,
  resolveEnemyEngagedTriggers,
  resolveAttackOfOpportunity,
  emitLocationEvent,
  emitEngagedEnemyEvent,
  emitScenarioEvent,
  emitCurrentLocationEvent,
  emitThreatAreaEvent,
  enemyHasRetaliate,
  resolveEnemyAttacks,
  resolveEnemyDefeatedTriggers,
  beginInteractiveAction,
  addLocationToVictoryDisplayIfCleared,
  resolveEnemyDefeatEffect,
  getNextLocationTowardTarget,
  advanceAgendaState,
  advanceActState,
  isScenarioResolved,
  getScenarioResolvedMessage,
  savePersistedCampaignSetup,
  spawnEnemyAtLocation,
  attachEncounterCardToLocation,
  resolveInteractiveEffect,
  createLogEntry,
  isOpeningHandWeakness,
  hasLocationAttachment,
  threatAreaHasCard,
  buildInitialEncounterDeck,
  normalizeCardCounters,
  shuffleArray,
  getSelectedScenario,
  getEncounterCardByCode,
} from "./gsFunctions";

import {
  persistedCampaignSetup
} from "./gsConst";

import {
  canSpendInvestigationAction,
  cloneScenarioLocations,
  createGameInvestigator,
  findCurrentLocation,
  getCardCost,
  getEnemyAtInvestigator,
  getInvestigatorSkillValue,
  getPreferredEnemyTargetId,
  normalizeScenarioLocations,
} from "../lib/gameStateHelpers";

import {
  getInitialActState,
  getInitialAgendaState,
} from "../lib/scenarioCards";

import {
  shuffle
} from "../lib/shuffle";

import {
  countMatchingIcons,
  hasCommittedCardByName,
} from "../lib/skillTestHelpers";

import {
  getSkillModifiersFromPlayArea,
} from "../lib/skillModifiers";

import {
  getDifficultyModifiersFromLocationAttachments,
} from "../lib/locationModifiers";

import type {
  ActiveSkillTest,
  CommittedSkillCard,
  EncounterCard,
  Enemy,
  GameState,
  LocationAttachment,
  PlayerCard,
  SkillTestResult,
  GameLogItem,
  LoadedDeck,
} from "../types/game";

import type {
  GameStore,
} from "./gsTypes";

import {
  ENCOUNTER_CARD_CODES,
} from "../types/game";

import {
  applyConditionalLocationVisibility,
} from "./locationVisibility";

import {
  resolveLocationAbilityEffect,
} from "./locationAbilities";

import {
  canPlayInAvailableSlots,
  getCardSlotUsage,
  getReplacementPlan,
} from "../features/playerCards/slots";

import {
  loadArkhamDeck,
  loadArkhamBuildDeckFromJson,
} from "../lib/loadArkhamDeck";

import {
  resolvePlayedEvent,
} from "../lib/playerCardEffects";

import {
  canActivatePlayAreaCardAbility,
  getActivatedCardAbilityEffect,
} from "../lib/playerCardAbilities";

import {
  resolveEncounterCardImmediate,
} from "../lib/encounterEffects";

import {
  type CampaignState,
} from "../lib/campaignSetup";

import {
  buildEncounterDeckFromCodes,
} from "../lib/buildEncounterDeck";

import {
  startingChaosBag
} from "./gsConst.ts";

const defaultCampaignState: CampaignState = {
  previousScenarioOutcome: null,
  randomizedSelectionsByCampaignKey: {},
  scenarioFlags: {},
};

const initialCampaignState: CampaignState =
  persistedCampaignSetup?.campaignState ?? defaultCampaignState;

const initialSelectedScenarioId =
  persistedCampaignSetup?.selectedScenarioId ?? defaultScenarioId;

const initialSelectedDeckId = persistedCampaignSetup?.selectedDeckId ?? "";

async function resolveSelectedDeck(state: GameStore): Promise<LoadedDeck> {
  if (state.importedArkhamBuildResolvedDeck) {
    return state.importedArkhamBuildResolvedDeck;
  }

  const selectedDeckId = state.selectedDeckId.trim();

  if (!selectedDeckId) {
    throw new Error("Deck source is required.");
  }

  return loadArkhamDeck(selectedDeckId);
}

export const useGameStore = create<GameStore>((set, get) => ({
  importedArkhamBuildDeckJson: null,
  setImportedArkhamBuildDeckJson: (deck) => {
    set({
      selectedDeckId: "",
      importedArkhamBuildDeckJson: deck,
      importedArkhamBuildResolvedDeck: deck
        ? loadArkhamBuildDeckFromJson(deck)
        : null,
    });
  },
  importedArkhamBuildResolvedDeck: null,
  setImportedArkhamBuildResolvedDeck: (deck) => {
    set({ importedArkhamBuildResolvedDeck: deck });
  },
  debugMode: false,
  debugPreset: "none",
  setDebugMode: (enabled: boolean) => {
    set({ debugMode: enabled });
  },
  setDebugPreset: (preset) => {
    set({ debugPreset: preset });
  },
  validationWarnings: [],
  spawnSetAsideEnemyAtLocation: (enemyCode: string, locationId: string) => {
    const {
      setAsideEncounterCards,
      enemies,
      investigator,
      locations,
      scenarioStatus,
    } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    const {
      card,
      remainingSetAsideEncounterCards,
    } = takeSetAsideEncounterCardByCode({
      setAsideEncounterCards,
      cardCode: enemyCode,
    });

    if (!card) {
      get().pushLog(
        "system",
        `Could not find set-aside encounter card ${enemyCode}.`,
      );
      return;
    }

    if (card.type !== "enemy") {
      get().pushLog(
        "system",
        `${card.name} is not an enemy and cannot be spawned.`,
      );
      return;
    }

    const updatedEnemies = spawnEnemyAtLocation({
      enemyCode,
      locationId,
      enemies,
      investigator,
      locations,
    });

    const spawnedEnemy = updatedEnemies[updatedEnemies.length - 1];

    set((state) => ({
      ...state,
      enemies: updatedEnemies,
      setAsideEncounterCards: remainingSetAsideEncounterCards,
      log: [
        ...state.log,
        createLogEntry(
          "scenario",
          `${spawnedEnemy.name} spawned at ${locationId} from the set-aside cards.`,
        ),
      ],
    }));
  },
  setAsideEncounterCards: [],
  victoryDisplay: [],
  clearedVictoryLocations: [],
  advanceActByClues: () => {
    const { act, investigator, scenarioStatus } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    if (!act) {
      get().pushLog("system", "There is no current act.");
      return;
    }

    const cluesNeeded = Math.max(0, act.threshold - act.progress);

    if (cluesNeeded <= 0) {
      get().pushLog("system", `Act ${act.sequence} is already ready to advance.`);
      get().advanceAct();
      return;
    }

    if (investigator.clues < cluesNeeded) {
      get().pushLog(
        "system",
        `You need ${cluesNeeded} clue${cluesNeeded === 1 ? "" : "s"} to advance Act ${act.sequence}.`,
      );
      return;
    }

    set({
      investigator: {
        ...investigator,
        clues: investigator.clues - cluesNeeded,
      },
    });

    get().pushLog(
      "scenario",
      `Spent ${cluesNeeded} clue${cluesNeeded === 1 ? "" : "s"} to advance Act ${act.sequence}.`,
    );

    get().setActProgress(act.progress + cluesNeeded);
  },
  moveHunterEnemies: () => {
    const { enemies, locations, investigator, scenarioStatus } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    const investigatorLocation = findCurrentLocation(locations, investigator.id);

    if (!investigatorLocation) {
      return;
    }

    let movedAny = false;

    const updatedEnemies = enemies.map((enemy) => {
      if (!enemyHasHunter(enemy)) {
        return enemy;
      }

      if (enemy.exhausted) {
        return enemy;
      }

      if (enemy.engagedInvestigatorId) {
        return enemy;
      }

      if (enemy.locationId === investigatorLocation.id) {
        if (enemyHasAloof(enemy)) {
          return enemy;
        }
        return {
          ...enemy,
          engagedInvestigatorId: investigator.id,
        };
      }

      const nextLocationId = getNextLocationTowardTarget(
        locations,
        enemy.locationId,
        investigatorLocation.id,
      );

      if (!nextLocationId) {
        return enemy;
      }

      movedAny = true;

      const movedEnemy =
        nextLocationId === investigatorLocation.id
          ? {
            ...enemy,
            locationId: nextLocationId,
            engagedInvestigatorId: enemyHasAloof(enemy) ? null : investigator.id,
          }
          : {
            ...enemy,
            locationId: nextLocationId,
          };

      return movedEnemy;
    });

    const newlyEngagedHunter = updatedEnemies.some((enemy) => {
      const originalEnemy = enemies.find((entry) => entry.id === enemy.id);

      return (
        enemy.engagedInvestigatorId === investigator.id &&
        originalEnemy?.engagedInvestigatorId !== investigator.id
      );
    });

    let updatedInvestigator = investigator;
    let updatedLocations = locations;
    let finalEnemies = updatedEnemies;
    let updatedCampaignState = get().campaignState;
    const extraLog: ReturnType<typeof createLogEntry>[] = [];

    if (newlyEngagedHunter) {
      const newlyEngagedHunterIds = finalEnemies
        .filter((enemy) => {
          const originalEnemy = enemies.find((entry) => entry.id === enemy.id);

          return (
            enemy.engagedInvestigatorId === investigator.id &&
            originalEnemy?.engagedInvestigatorId !== investigator.id
          );
        })
        .map((enemy) => enemy.id);

      for (const engagedEnemyId of newlyEngagedHunterIds) {
        const forcedResolution = resolveEnemyEngagedTriggers({
          enemyCode: engagedEnemyId,
          locationId: investigatorLocation.id,
          investigator: updatedInvestigator,
          locations: updatedLocations,
          enemies: finalEnemies,
          campaignState: updatedCampaignState,
        });

        updatedInvestigator = forcedResolution.investigator;
        updatedLocations = forcedResolution.locations;
        finalEnemies = forcedResolution.enemies;
        updatedCampaignState = forcedResolution.campaignState;
        extraLog.push(...forcedResolution.logEntries);
      }
    }

    set((state) => ({
      investigator: updatedInvestigator,
      locations: updatedLocations,
      enemies: finalEnemies,
      campaignState: updatedCampaignState,
      log: [...state.log, ...extraLog],
    }));

    if (!movedAny && !newlyEngagedHunter) {
      return;
    }

    for (const enemy of finalEnemies) {
      if (!enemyHasHunter(enemy)) {
        continue;
      }

      const originalEnemy = enemies.find((entry) => entry.id === enemy.id);
      if (!originalEnemy || originalEnemy.locationId === enemy.locationId) {
        continue;
      }

      const destination = locations.find((entry) => entry.id === enemy.locationId);

      get().pushLog(
        "enemy",
        destination
          ? `${enemy.name} moved to ${destination.name} because of Hunter.`
          : `${enemy.name} moved because of Hunter.`,
      );

      if (enemy.engagedInvestigatorId === investigator.id) {
        get().pushLog(
          "enemy",
          `${enemy.name} engaged ${investigator.name}.`,
        );
      }
    }
  },
  screen: "home",
  availableInvestigators: investigators,
  availableScenarios: scenarios,
  selectedInvestigatorId: "",
  selectedScenarioId: initialSelectedScenarioId,
  selectedDeckId: initialSelectedDeckId,
  selectedEnemyTargetId: null,
  showDeckInspector: false,
  showEncounterInspector: false,
  draggedCardId: null,
  pendingTestResolution: null,
  pendingAssetPlay: null,
  pendingChoice: null,
  pendingEncounterResolution: null,
  pendingInteractiveResolution: null,
  investigator: createGameInvestigator(investigators[0]),
  deck: [],
  hand: [],
  discard: [],
  playArea: [],
  encounterDeck: [],
  encounterDiscard: [],
  locationAttachments: [],
  threatArea: [],
  lastEncounterCard: null,
  isMulliganActive: false,
  selectedMulliganCardIds: [],
  pendingInvestigateDifficultyModifier: 0,
  pendingFightCombatModifier: 0,
  pendingFightDamageBonus: 0,
  chaosBag: [...startingChaosBag],

  locations: applyConditionalLocationVisibility({
    locations: cloneScenarioLocations(
      getSelectedScenario({
        availableScenarios: scenarios,
        selectedScenarioId: initialSelectedScenarioId,
        campaignState: initialCampaignState,
      }).locations,
    ),
    campaignState: initialCampaignState,
  }),

  locationAbility: (abilityIndex) => {
    const {
      turn,
      scenarioStatus,
      investigator,
      locations,
      enemies,
      campaignState,
      threatArea,
      encounterDiscard,
    } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    if (turn.phase !== "investigation") {
      get().pushLog(
        "system",
        "You can only use location abilities during the Investigation phase.",
      );
      return;
    }

    const currentLocation = findCurrentLocation(locations, investigator.id);

    if (!currentLocation) {
      get().pushLog(
        "system",
        "Cannot use a location ability because your location is unknown.",
      );
      return;
    }

    const ability = currentLocation.abilities?.[abilityIndex];

    if (!ability) {
      get().pushLog("system", "That location ability is not available.");
      return;
    }

    if (ability.trigger !== "action" && ability.trigger !== "doubleAction") {
      get().pushLog("system", "That ability cannot be used this way.");
      return;
    }

    const actionCost =
      ability.costsActions ?? (ability.trigger === "doubleAction" ? 2 : 1);

    if (turn.actionsRemaining < actionCost) {
      get().pushLog("system", "Not enough actions remaining.");
      return;
    }

    const actionEffect = ability.effect;

    if (!actionEffect && !ability.skillTest) {
      get().pushLog("system", "This location ability has no effect configured.");
      return;
    }

    let updatedInvestigator = investigator;
    const extraLog: ReturnType<typeof createLogEntry>[] = [];

    if (hasReadyEngagedEnemy({ investigator: updatedInvestigator, enemies })) {
      const aooResolution = resolveAttackOfOpportunity({
        investigator: updatedInvestigator,
        enemies,
        logPrefix: `using ${ability.label ?? currentLocation.name}`,
      });

      updatedInvestigator = aooResolution.investigator;
      extraLog.push(...aooResolution.logEntries);
    }

    if (ability.skillTest) {
      set((state) => ({
        investigator: updatedInvestigator,
        pendingInteractiveResolution: {
          sourceName: ability.label ?? currentLocation.name,
          sourceKind: "locationAction",
          currentLocationId: currentLocation.id,
          onSuccess: ability.skillTest!.onSuccess,
          onFail: ability.skillTest!.onFail,
        },
        turn: {
          ...turn,
          actionsRemaining: turn.actionsRemaining - actionCost,
        },
        log: [
          ...state.log,
          ...extraLog,
          createLogEntry("scenario", ability.text),
        ],
      }));

      get().beginSkillTest(
        ability.skillTest.skill,
        ability.skillTest.difficulty,
        ability.label ?? currentLocation.name,
      );

      return;
    }

    if (!actionEffect) {
      get().pushLog("system", "This location ability has no effect configured.");
      return;
    }

    const resolution = resolveLocationAbilityEffect({
      effect: actionEffect,
      investigator: updatedInvestigator,
      currentLocationId: currentLocation.id,
      locations,
      enemies,
      campaignState,
      threatArea,
      encounterDiscard,
      locationAttachments: [],
    });

    set((state) => ({
      investigator: resolution.investigator,
      locations: resolution.locations,
      enemies: resolution.enemies,
      campaignState: resolution.campaignState,
      turn: {
        ...turn,
        actionsRemaining: turn.actionsRemaining - actionCost,
      },
      threatArea: resolution.threatArea,
      encounterDiscard: resolution.encounterDiscard,
      log: [
        ...state.log,
        ...extraLog,
        createLogEntry("scenario", ability.text),
        ...resolution.logEntries,
      ],
    }));

    const updatedState = get();
    savePersistedCampaignSetup({
      selectedDeckId: updatedState.selectedDeckId,
      selectedScenarioId: updatedState.selectedScenarioId,
      campaignState: updatedState.campaignState,
    });
  },

  campaignState: initialCampaignState,
  enemies: [],
  agenda: getInitialAgendaState(
    getSelectedScenario({
      availableScenarios: scenarios,
      selectedScenarioId: initialSelectedScenarioId,
      campaignState: initialCampaignState,
    })
  ),
  act: getInitialActState(
    getSelectedScenario({
      availableScenarios: scenarios,
      selectedScenarioId: initialSelectedScenarioId,
      campaignState: initialCampaignState,
    })
  ),
  scenarioStatus: "inProgress",
  scenarioResolutionText: null,
  scenarioResolutionTitle: null,
  scenarioResolutionSubtitle: null,
  log: [],
  lastSkillTest: null,
  activeSkillTest: null,
  turn: {
    round: 1,
    phase: "mythos",
    actionsRemaining: 0,
  },

  pushLog: (kind, text) => {
    set((state) => ({
      log: [...state.log, createLogEntry(kind, text)],
    }));
  },

  setSelectedInvestigator: (investigatorId) => {
    set({ selectedInvestigatorId: investigatorId });
  },

  setSelectedDeckId: (deckId) => {
    set({
      selectedDeckId: deckId,
      importedArkhamBuildDeckJson: null,
      importedArkhamBuildResolvedDeck: null,
    });

    const state = get();
    savePersistedCampaignSetup({
      selectedDeckId: deckId,
      selectedScenarioId: state.selectedScenarioId,
      campaignState: state.campaignState,
    });
  },

  setPreviousScenarioOutcome: (outcome) => {
    set((state) => ({
      campaignState: {
        ...state.campaignState,
        previousScenarioOutcome: outcome,
      },
    }));

    const state = get();
    savePersistedCampaignSetup({
      selectedDeckId: state.selectedDeckId,
      selectedScenarioId: state.selectedScenarioId,
      campaignState: state.campaignState,
    });
  },

  randomizeCampaignSelectionsForScenario: (scenarioId) => {
    const state = get();

    const scenario = state.availableScenarios.find(
      (entry) => entry.id === scenarioId,
    );

    if (!scenario?.randomizedSelections?.length) {
      return;
    }

    const campaignKey = scenario.campaignKey ?? scenario.id;
    const nextSelections = {
      ...(state.campaignState.randomizedSelectionsByCampaignKey[campaignKey] ??
        {}),
    };

    for (const selection of scenario.randomizedSelections) {
      if (selection.optionIds.length === 0) {
        continue;
      }

      const randomIndex = Math.floor(Math.random() * selection.optionIds.length);
      nextSelections[selection.slotId] = selection.optionIds[randomIndex];
    }

    set({
      campaignState: {
        ...state.campaignState,
        randomizedSelectionsByCampaignKey: {
          ...state.campaignState.randomizedSelectionsByCampaignKey,
          [campaignKey]: nextSelections,
        },
      },
    });

    const updatedState = get();

    savePersistedCampaignSetup({
      selectedDeckId: updatedState.selectedDeckId,
      selectedScenarioId: updatedState.selectedScenarioId,
      campaignState: updatedState.campaignState,
    });

    updatedState.pushLog(
      "system",
      `Randomized setup selections for ${scenario.name}.`,
    );
  },

  setCampaignRandomizedSelection: (campaignKey, slotId, optionId) => {
    set((state) => ({
      campaignState: {
        ...state.campaignState,
        randomizedSelectionsByCampaignKey: {
          ...state.campaignState.randomizedSelectionsByCampaignKey,
          [campaignKey]: {
            ...(state.campaignState.randomizedSelectionsByCampaignKey[
              campaignKey
            ] ?? {}),
            [slotId]: optionId,
          },
        },
      },
    }));

    const state = get();
    savePersistedCampaignSetup({
      selectedDeckId: state.selectedDeckId,
      selectedScenarioId: state.selectedScenarioId,
      campaignState: state.campaignState,
    });
  },

  toggleDeckInspector: () => {
    set((state) => ({ showDeckInspector: !state.showDeckInspector }));
  },

  toggleEncounterInspector: () => {
    set((state) => ({
      showEncounterInspector: !state.showEncounterInspector,
    }));
  },

  closeDeckInspector: () => {
    set({ showDeckInspector: false });
  },

  discardCardFromHand: (cardCode) => {
    get().discardCard(cardCode);
  },

  locationAction: (actionIndex) => {
    const {
      turn,
      scenarioStatus,
      investigator,
      locations,
      enemies,
      campaignState,
      threatArea,
      encounterDiscard,
    } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    if (turn.phase !== "investigation") {
      get().pushLog(
        "system",
        "You can only use location actions during the Investigation phase.",
      );
      return;
    }

    if (turn.actionsRemaining < 1) {
      get().pushLog(
        "system",
        "Cannot use a location action. No actions remaining.",
      );
      return;
    }

    const currentLocation = findCurrentLocation(locations, investigator.id);

    if (!currentLocation) {
      get().pushLog(
        "system",
        "Cannot use a location action because your location is unknown.",
      );
      return;
    }

    const ability = currentLocation.actions?.[actionIndex];

    if (!ability) {
      get().pushLog("system", "That location ability is not available.");
      return;
    }

    if (ability.trigger !== "action" && ability.trigger !== "doubleAction") {
      get().pushLog("system", "That ability cannot be used this way.");
      return;
    }

    const actionCost = ability.costsActions ?? 1;

    if (turn.actionsRemaining < actionCost) {
      get().pushLog(
        "system",
        `Cannot use this location action. You need ${actionCost} action${actionCost === 1 ? "" : "s"}.`,
      );
      return;
    }

    const actionEffect = ability.effect;

    if (!actionEffect && !ability.skillTest) {
      get().pushLog("system", "This location action has no effect configured.");
      return;
    }

    let updatedInvestigator = investigator;
    const extraLog: ReturnType<typeof createLogEntry>[] = [];

    if (hasReadyEngagedEnemy({ investigator: updatedInvestigator, enemies })) {
      const aooResolution = resolveAttackOfOpportunity({
        investigator: updatedInvestigator,
        enemies,
        logPrefix: `using ${ability.label ?? currentLocation.name}`,
      });

      updatedInvestigator = aooResolution.investigator;
      extraLog.push(...aooResolution.logEntries);
    }

    if (ability.skillTest) {
      set((state) => ({
        investigator: updatedInvestigator,
        pendingLocationActionResolution: {
          sourceName: currentLocation.name,
          currentLocationId: currentLocation.id,
          onSuccess: ability.skillTest!.onSuccess,
          onFail: ability.skillTest!.onFail,
        },
        turn: {
          ...turn,
          actionsRemaining: turn.actionsRemaining - actionCost,
        },
        log: [
          ...state.log,
          ...extraLog,
          createLogEntry("scenario", ability.text),
        ],
      }));

      get().beginSkillTest(
        ability.skillTest.skill,
        ability.skillTest.difficulty,
        ability.label ?? currentLocation.name,
      );

      return;
    }

    if (!actionEffect) {
      get().pushLog("system", "This location action has no effect configured.");
      return;
    }

    const resolution = resolveLocationAbilityEffect({
      effect: actionEffect,
      investigator: updatedInvestigator,
      currentLocationId: currentLocation.id,
      locations,
      enemies,
      campaignState,
      threatArea,
      encounterDiscard,
      locationAttachments: [],
    });

    set((state) => ({
      investigator: resolution.investigator,
      locations: resolution.locations,
      enemies: resolution.enemies,
      campaignState: resolution.campaignState,
      turn: {
        ...turn,
        actionsRemaining: turn.actionsRemaining - actionCost,
      },
      log: [
        ...state.log,
        ...extraLog,
        createLogEntry("scenario", ability.text),
        ...resolution.logEntries,
      ],
      threatArea: resolution.threatArea,
      encounterDiscard: resolution.encounterDiscard,
    }));

    const updatedState = get();
    savePersistedCampaignSetup({
      selectedDeckId: updatedState.selectedDeckId,
      selectedScenarioId: updatedState.selectedScenarioId,
      campaignState: updatedState.campaignState,
    });
  },

  discardThreatAreaCard: (cardCode) => {
    const {
      threatArea,
      encounterDiscard,
      turn,
      activeSkillTest,
      scenarioStatus,
    } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    if (activeSkillTest) {
      get().pushLog(
        "system",
        "Cannot discard a threat area card while a skill test is active.",
      );
      return;
    }

    const card = threatArea.find((entry) => entry.id === cardCode);

    if (!card) {
      return;
    }

    if (turn.phase !== "investigation") {
      get().pushLog(
        "system",
        `Cannot discard ${card.name} outside the Investigation phase.`,
      );
      return;
    }

    if (turn.actionsRemaining < 2) {
      get().pushLog(
        "system",
        `Cannot discard ${card.name}. You need 2 actions.`,
      );
      return;
    }

    if (card.name !== "Unspeakable Truths") {
      get().pushLog(
        "system",
        `Discarding ${card.name} from the threat area is not implemented.`,
      );
      return;
    }

    set({
      threatArea: threatArea.filter((entry) => entry.id !== cardCode),
      encounterDiscard: [...encounterDiscard, card],
      turn: {
        ...turn,
        actionsRemaining: turn.actionsRemaining - 2,
      },
    });

    get().pushLog(
      "scenario",
      `Spent 2 actions to discard ${card.name} from your threat area.`,
    );
  },

  discardLocationAttachment: (attachmentId) => {
    const {
      locationAttachments,
      encounterDiscard,
      turn,
      activeSkillTest,
      scenarioStatus,
    } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    if (activeSkillTest) {
      get().pushLog(
        "system",
        "Cannot discard a location attachment while a skill test is active.",
      );
      return;
    }

    const attachment = locationAttachments.find(
      (entry) => entry.id === attachmentId,
    );

    if (!attachment) {
      return;
    }

    if (turn.phase !== "investigation") {
      get().pushLog(
        "system",
        `Cannot clear ${attachment.name} outside the Investigation phase.`,
      );
      return;
    }

    if (turn.actionsRemaining < 1) {
      get().pushLog(
        "system",
        `Cannot clear ${attachment.name}. No actions remaining.`,
      );
      return;
    }

    if (attachment.name !== "Fire!") {
      get().pushLog(
        "system",
        `Discarding ${attachment.name} is not implemented.`,
      );
      return;
    }

    set({
      locationAttachments: locationAttachments.filter(
        (entry) => entry.id !== attachmentId,
      ),
      encounterDiscard: [
        ...encounterDiscard,
        {
          id: attachment.cardCode,
          code: attachment.code ?? attachment.cardCode,
          name: attachment.name,
          type: "treachery",
          text: Array.isArray(attachment.text)
            ? attachment.text
            : attachment.text
              ? [attachment.text]
              : undefined,
          traits: attachment.traits,
        },
      ],
      turn: {
        ...turn,
        actionsRemaining: turn.actionsRemaining - 1,
      },
    });

    get().pushLog(
      "scenario",
      `Cleared ${attachment.name} with 1 action.`,
    );
  },

  setSelectedScenario: (scenarioId) => {
    set({ selectedScenarioId: scenarioId });

    const state = get();
    savePersistedCampaignSetup({
      selectedDeckId: state.selectedDeckId,
      selectedScenarioId: scenarioId,
      campaignState: state.campaignState,
    });
  },

  setSelectedEnemyTarget: (enemyCode) => {
    const { investigator, locations, enemies, selectedEnemyTargetId } = get();
    const currentLocation = findCurrentLocation(locations, investigator.id);

    if (!currentLocation) {
      set({ selectedEnemyTargetId: null });
      return;
    }

    if (enemyCode === null) {
      const preferredTargetId = getPreferredEnemyTargetId(
        enemies,
        currentLocation.id,
        investigator.id,
        null,
      );

      set({
        selectedEnemyTargetId: preferredTargetId,
      });
      return;
    }

    const selectedEnemy = enemies.find(
      (enemy) =>
        enemy.id === enemyCode &&
        enemy.locationId === currentLocation.id &&
        enemy.engagedInvestigatorId === investigator.id,
    );

    if (!selectedEnemy) {
      set({
        selectedEnemyTargetId: null,
      });
      return;
    }

    if (selectedEnemyTargetId === selectedEnemy.id) {
      return;
    }

    set({
      selectedEnemyTargetId: selectedEnemy.id,
    });
    get().pushLog("enemy", `Current enemy target: ${selectedEnemy.name}.`);
  },

  setLocationVisible: (locationId, visible = true) => {
    const { locations } = get();
    const location = locations.find((entry) => entry.id === locationId);

    if (!location) {
      return;
    }

    if (location.isVisible === visible) {
      return;
    }

    set({
      locations: locations.map((entry) =>
        entry.id === locationId ? { ...entry, isVisible: visible } : entry,
      ),
    });

    get().pushLog(
      "scenario",
      visible
        ? `${location.name} is now visible on the board.`
        : `${location.name} is no longer visible on the board.`,
    );
  },

  revealLocation: (locationId) => {
    const { locations } = get();
    const location = locations.find((entry) => entry.id === locationId);

    if (!location) {
      return;
    }

    if (location.isVisible && location.revealed) {
      return;
    }

    set({
      locations: locations.map((entry) =>
        entry.id === locationId
          ? { ...entry, isVisible: true, revealed: true }
          : entry,
      ),
    });

    get().pushLog("scenario", `${location.name} was revealed.`);
  },

  engageEnemy: (enemyCode) => {
    const { enemies, investigator, locations, turn, campaignState } = get();

    if (turn.phase !== "investigation" || turn.actionsRemaining < 1) {
      return;
    }

    const currentLocation = findCurrentLocation(locations, investigator.id);
    if (!currentLocation) return;

    const enemy = enemies.find(
      (e) =>
        e.id === enemyCode &&
        e.locationId === currentLocation.id &&
        e.engagedInvestigatorId === null,
    );

    if (!enemy) {
      get().pushLog("system", "Cannot engage that enemy.");
      return;
    }

    const updatedEnemies = enemies.map((e) =>
      e.id === enemyCode
        ? { ...e, engagedInvestigatorId: investigator.id }
        : e,
    );

    let updatedInvestigator = investigator;
    let updatedLocations = locations;
    let finalEnemies = updatedEnemies;
    let updatedCampaignState = campaignState;
    const engagementLog: ReturnType<typeof createLogEntry>[] = [
      createLogEntry("enemy", `Engaged ${enemy.name}.`),
    ];

    const forcedResolution = resolveEnemyEngagedTriggers({
      enemyCode,
      locationId: currentLocation.id,
      investigator: updatedInvestigator,
      locations: updatedLocations,
      enemies: finalEnemies,
      campaignState: updatedCampaignState,
    });

    updatedInvestigator = forcedResolution.investigator;
    updatedLocations = forcedResolution.locations;
    finalEnemies = forcedResolution.enemies;
    updatedCampaignState = forcedResolution.campaignState;
    const extraLog: ReturnType<typeof createLogEntry>[] = [];
    extraLog.push(...forcedResolution.logEntries);

    set((state) => ({
      investigator: updatedInvestigator,
      locations: updatedLocations,
      enemies: finalEnemies,
      campaignState: updatedCampaignState,
      turn: {
        ...turn,
        actionsRemaining: turn.actionsRemaining - 1,
      },
      log: [...state.log, ...engagementLog],
    }));
  },

  parleyAction: (enemyCode) => {
    const {
      turn,
      scenarioStatus,
      investigator,
      locations,
      enemies,
      campaignState,
      threatArea,
      encounterDiscard,
    } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    if (turn.phase !== "investigation") {
      get().pushLog(
        "system",
        "You can only parley during the Investigation phase.",
      );
      return;
    }

    if (turn.actionsRemaining < 1) {
      get().pushLog("system", "Cannot parley. No actions remaining.");
      return;
    }

    const currentLocation = findCurrentLocation(locations, investigator.id);

    if (!currentLocation) {
      get().pushLog(
        "system",
        "Cannot parley because your location is unknown.",
      );
      return;
    }

    const parleyEnemy =
      enemyCode != null
        ? enemies.find(
          (enemy) =>
            enemy.id === enemyCode &&
            enemy.locationId === currentLocation.id &&
            enemy.parley,
        ) ?? null
        : null;

    const parleySource = parleyEnemy?.parley ?? currentLocation.parley;

    if (!parleySource) {
      get().pushLog("system", "There is nothing to parley with here.");
      return;
    }

    const interaction = beginInteractiveAction({
      action: parleySource,
      sourceName: parleyEnemy ? parleyEnemy.name : currentLocation.name,
      sourceKind: "parley",
      currentLocationId: currentLocation.id,
      turn,
      log: get().log,
    });

    if (interaction.kind === "invalid") {
      get().pushLog("system", interaction.message);
      return;
    }

    if (interaction.kind === "skillTest") {
      set({
        pendingInteractiveResolution: interaction.pending,
        turn: interaction.turn,
        log: interaction.log,
      });

      get().beginSkillTest(
        interaction.skill,
        interaction.difficulty,
        interaction.skillTestSource,
      );

      return;
    }

    const resolution = resolveInteractiveEffect({
      sourceKind: "parley",
      effect: interaction.effect,
      investigator,
      currentLocationId: currentLocation.id,
      locations,
      enemies,
      campaignState,
      threatArea,
      encounterDiscard,
    });

    set({
      investigator: resolution.investigator,
      locations: resolution.locations,
      enemies: resolution.enemies,
      campaignState: resolution.campaignState,
      turn: interaction.turn,
      log: [...interaction.log, ...resolution.logEntries],
      threatArea: resolution.threatArea,
      encounterDiscard: resolution.encounterDiscard,
    });

    const updatedState = get();
    savePersistedCampaignSetup({
      selectedDeckId: updatedState.selectedDeckId,
      selectedScenarioId: updatedState.selectedScenarioId,
      campaignState: updatedState.campaignState,
    });
  },


  parleyEnemy: () => {
  },

  addAgendaProgress: (amount = 1) => {
    const { agenda } = get();

    if (!agenda) {
      return;
    }

    get().setAgendaProgress(agenda.progress + amount);
  },

  removeAgendaProgress: (amount = 1) => {
    const { agenda } = get();

    if (!agenda) {
      return;
    }

    get().setAgendaProgress(Math.max(0, agenda.progress - amount));
  },

  setAgendaProgress: (progress) => {
    const { agenda } = get();

    if (!agenda) {
      return;
    }

    const nextProgress = Math.max(0, progress);
    const thresholdReached = nextProgress >= agenda.threshold;

    set({
      agenda: {
        ...agenda,
        progress: nextProgress,
      },
    });

    get().pushLog(
      "scenario",
      `${agenda.thresholdLabel} on agenda set to ${nextProgress}/${agenda.threshold}.`,
    );

    if (thresholdReached) {
      get().pushLog(
        "scenario",
        `${agenda.thresholdLabel} reached ${agenda.threshold}. Agenda ${agenda.sequence} advances.`,
      );
      get().advanceAgenda();
    }
  },

  setActProgress: (progress) => {
    const { act } = get();

    if (!act) {
      return;
    }

    const nextProgress = Math.max(0, progress);
    const thresholdReached = nextProgress >= act.threshold;

    set({
      act: {
        ...act,
        progress: nextProgress,
      },
    });

    get().pushLog(
      "scenario",
      `${act.thresholdLabel} on act set to ${nextProgress}/${act.threshold}.`,
    );

    if (thresholdReached) {
      get().pushLog(
        "scenario",
        `Act ${act.sequence} reached its threshold and advances.`,
      );
      get().advanceAct();
    }
  },

  addActProgress: (amount = 1) => {
    const { act } = get();

    if (!act) {
      return;
    }

    get().setActProgress(act.progress + amount);
  },

  removeActProgress: (amount = 1) => {
    const { act } = get();

    if (!act) {
      return;
    }

    get().setActProgress(Math.max(0, act.progress - amount));
  },

  advanceAgenda: () => {
    const {
      agenda,
      act,
      log,
      locations,
      enemies,
      playArea,
      investigator,
      selectedEnemyTargetId,
    } = get();

    const scenario = getSelectedScenario(get());
    const currentLocation = findCurrentLocation(locations, investigator.id);

    const result = advanceAgendaState(
      scenario,
      {
        agenda,
        act,
        playArea,
        locations,
        enemies,
        log,
        investigatorId: investigator.id,
        currentLocationId: currentLocation?.id ?? null,
        selectedEnemyTargetId,
        scenarioStatus: get().scenarioStatus,
        scenarioResolutionText: get().scenarioResolutionText,
        scenarioResolutionTitle: get().scenarioResolutionTitle,
        scenarioResolutionSubtitle: get().scenarioResolutionSubtitle,
        campaignState: get().campaignState,
        campaignOutcomeToSet: null,
        locationAttachments: get().locationAttachments,
        setAsideEncounterCards: get().setAsideEncounterCards,
      },
      true,
    );

    set(result);
    const updatedState = get();
    savePersistedCampaignSetup({
      selectedDeckId: updatedState.selectedDeckId,
      selectedScenarioId: updatedState.selectedScenarioId,
      campaignState: updatedState.campaignState,
    });
  },

  advanceAct: () => {
    const {
      agenda,
      act,
      log,
      locations,
      playArea,
      enemies,
      investigator,
      selectedEnemyTargetId,
    } = get();

    const scenario = getSelectedScenario(get());
    const currentLocation = findCurrentLocation(locations, investigator.id);

    const result = advanceActState(
      scenario,
      {
        agenda,
        act,
        locations,
        playArea,
        enemies,
        log,
        investigatorId: investigator.id,
        currentLocationId: currentLocation?.id ?? null,
        selectedEnemyTargetId,
        scenarioStatus: get().scenarioStatus,
        scenarioResolutionText: get().scenarioResolutionText,
        scenarioResolutionTitle: get().scenarioResolutionTitle,
        scenarioResolutionSubtitle: get().scenarioResolutionSubtitle,
        campaignState: get().campaignState,
        campaignOutcomeToSet: null,
        locationAttachments: get().locationAttachments,
        setAsideEncounterCards: get().setAsideEncounterCards,
      },
      true,
    );

    set(result);
    const updatedState = get();
    savePersistedCampaignSetup({
      selectedDeckId: updatedState.selectedDeckId,
      selectedScenarioId: updatedState.selectedScenarioId,
      campaignState: updatedState.campaignState,
    });
  },

  setDraggedCardId: (cardCode) => {
    set({ draggedCardId: cardCode });
  },

  clearPendingCardAbilityBonuses: () => {
    set({
      pendingInvestigateDifficultyModifier: 0,
      pendingFightCombatModifier: 0,
      pendingFightDamageBonus: 0,
    });
  },

  triggerPlayAreaCardAbility: (cardCode) => {
    const {
      playArea,
      activeSkillTest,
      scenarioStatus,
      pendingInvestigateDifficultyModifier,
      pendingFightCombatModifier,
      pendingFightDamageBonus,
    } = get();
    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }
    if (activeSkillTest) {
      get().pushLog(
        "system",
        "Cannot activate a play-area ability while a skill test is active.",
      );
      return;
    }
    const card = playArea.find((entry) => entry.instanceId === cardCode);
    if (!card) return;
    if (!canActivatePlayAreaCardAbility(card)) {
      get().pushLog(
        "system",
        `Cannot activate ${card.name}. No usable counters remain.`,
      );
      return;
    }
    const effect = getActivatedCardAbilityEffect(card);
    if (!effect) return;
    const currentCounterValue = card.counters?.[effect.counterType] ?? 0;
    const nextCounterValue = Math.max(
      0,
      currentCounterValue - effect.counterCost,
    );
    set({
      playArea: playArea.map((entry) =>
        entry.instanceId !== cardCode
          ? entry
          : {
            ...entry,
            counters: (() => {
              const nc = {
                ...(entry.counters ?? {}),
                [effect.counterType]: nextCounterValue,
              };
              if (nextCounterValue === 0) delete nc[effect.counterType];
              return nc;
            })(),
          },
      ),
      pendingInvestigateDifficultyModifier:
        pendingInvestigateDifficultyModifier +
        (effect.investigateDifficultyModifier ?? 0),
      pendingFightCombatModifier:
        pendingFightCombatModifier + (effect.fightCombatModifier ?? 0),
      pendingFightDamageBonus:
        pendingFightDamageBonus + (effect.fightDamageBonus ?? 0),
    });
    get().pushLog("player", effect.logText);
  },

  togglePendingAssetReplacementChoice: (cardCode) => {
    const { pendingAssetPlay } = get();
    if (!pendingAssetPlay) return;
    const exists = pendingAssetPlay.selectedReplacementIds.includes(cardCode);
    if (pendingAssetPlay.requiredHandSlotsToFree) {
      set({
        pendingAssetPlay: {
          ...pendingAssetPlay,
          selectedReplacementIds: exists
            ? pendingAssetPlay.selectedReplacementIds.filter(
              (entry) => entry !== cardCode,
            )
            : [...pendingAssetPlay.selectedReplacementIds, cardCode],
        },
      });
      return;
    }
    set({
      pendingAssetPlay: {
        ...pendingAssetPlay,
        selectedReplacementIds: exists ? [] : [cardCode],
      },
    });
  },

  toggleMulliganCardSelection: (cardCode) => {
    const { isMulliganActive, selectedMulliganCardIds } = get();
    if (!isMulliganActive) return;
    const alreadySelected = selectedMulliganCardIds.includes(cardCode);
    set({
      selectedMulliganCardIds: alreadySelected
        ? selectedMulliganCardIds.filter((entry) => entry !== cardCode)
        : [...selectedMulliganCardIds, cardCode],
    });
  },

  confirmMulligan: () => {
    const { isMulliganActive, selectedMulliganCardIds, hand, deck, log } =
      get();
    if (!isMulliganActive) return;
    if (selectedMulliganCardIds.length === 0) {
      get().skipMulligan();
      return;
    }
    const cardsToRedraw = hand.filter((card) =>
      selectedMulliganCardIds.includes(card.instanceId),
    );
    const keptCards = hand.filter(
      (card) => !selectedMulliganCardIds.includes(card.instanceId),
    );
    let reshuffledDeck = shuffleArray([...deck, ...cardsToRedraw]);


    const drawnCards: PlayerCard[] = [];
    const skippedWeaknesses = [];
    while (
      drawnCards.length < cardsToRedraw.length &&
      reshuffledDeck.length > 0
    ) {
      const [topCard, ...remainingDeck] = reshuffledDeck;
      reshuffledDeck = remainingDeck;
      if (isOpeningHandWeakness(topCard)) {
        skippedWeaknesses.push(topCard);
        continue;
      }
      drawnCards.push(topCard);
    }
    if (skippedWeaknesses.length > 0)
      reshuffledDeck = shuffleArray([...reshuffledDeck, ...skippedWeaknesses]);
    set({
      hand: [...keptCards, ...drawnCards],
      deck: reshuffledDeck,
      isMulliganActive: false,
      selectedMulliganCardIds: [],
      log: [
        ...log,
        createLogEntry(
          "player",
          `Mulliganed ${cardsToRedraw.length} card${cardsToRedraw.length === 1 ? "" : "s"}.`,
        ),
        createLogEntry("system", "Round 1 begins."),
        createLogEntry("system", "First round: Mythos phase is skipped."),
        createLogEntry("system", "Phase: Investigation"),
      ],
      turn: { round: 1, phase: "investigation", actionsRemaining: 3 },
    });
    get().engageEnemiesAtLocation();
  },

  resignAction: () => {
    const { turn, scenarioStatus, campaignState } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    if (turn.phase !== "investigation") {
      get().pushLog(
        "system",
        "You can only resign during the Investigation phase.",
      );
      return;
    }

    if (turn.actionsRemaining < 1) {
      get().pushLog("system", "Cannot resign. No actions remaining.");
      return;
    }

    const selectedScenario = getSelectedScenario(get());
    const resignResolution = selectedScenario.resign;
    const effects = resignResolution?.effects;

    const nextScenarioStatus =
      effects?.scenarioStatus ?? "resigned";

    const nextCampaignState =
      effects?.setPreviousScenarioOutcome != null
        ? {
          ...campaignState,
          previousScenarioOutcome: effects.setPreviousScenarioOutcome,
        }
        : campaignState;

    const resolutionTitle =
      resignResolution?.title ??
      effects?.resolutionTitle ??
      "Resigned";

    const resolutionSubtitle =
      resignResolution?.subtitle ??
      effects?.resolutionSubtitle ??
      "You resigned from the scenario.";

    const resolutionText =
      resignResolution?.text ??
      effects?.resolutionText ??
      `${get().investigator.name} resigned from the scenario.`;

    set({
      scenarioStatus: nextScenarioStatus,
      scenarioResolutionTitle: resolutionTitle,
      scenarioResolutionSubtitle: resolutionSubtitle,
      scenarioResolutionText: resolutionText,
      campaignState: nextCampaignState,
      turn: {
        ...turn,
        actionsRemaining: turn.actionsRemaining - 1,
      },
    });

    const updatedState = get();
    savePersistedCampaignSetup({
      selectedDeckId: updatedState.selectedDeckId,
      selectedScenarioId: updatedState.selectedScenarioId,
      campaignState: updatedState.campaignState,
    });

    get().pushLog("scenario", resolutionText);
  },

  skipMulligan: () => {
    const { isMulliganActive, log } = get();
    if (!isMulliganActive) return;
    set({
      isMulliganActive: false,
      selectedMulliganCardIds: [],
      log: [
        ...log,
        createLogEntry("player", "Kept opening hand."),
        createLogEntry("system", "Round 1 begins."),
        createLogEntry("system", "First round: Mythos phase is skipped."),
        createLogEntry("system", "Phase: Investigation"),
      ],
      turn: { round: 1, phase: "investigation", actionsRemaining: 3 },
    });
    get().engageEnemiesAtLocation();
  },

  drawEncounterCard: () => {
    const { encounterDeck, encounterDiscard } = get();

    if (encounterDeck.length === 0) {
      if (encounterDiscard.length === 0) {
        get().pushLog(
          "system",
          "Tried to draw an encounter card, but the encounter deck was empty.",
        );
        return null;
      }

      const reshuffledDeck = shuffleArray(encounterDiscard);
      const [topCard, ...remainingDeck] = reshuffledDeck;

      set({
        encounterDeck: remainingDeck,
        encounterDiscard: [],
        lastEncounterCard: topCard,
      });

      get().pushLog(
        "scenario",
        `Encounter discard reshuffled into a new encounter deck. Drew ${topCard.name}.`,
      );

      return topCard;
    }

    const [topCard, ...remainingDeck] = encounterDeck;

    set({
      encounterDeck: remainingDeck,
      lastEncounterCard: topCard,
    });

    get().pushLog("scenario", `Drew encounter card: ${topCard.name}.`);
    return topCard;
  },

  resolveMythosPhase: () => {
    const {
      investigator,
      locations,
      enemies,
      encounterDiscard,
      pendingChoice,
    } = get();

    if (pendingChoice) {
      get().pushLog(
        "system",
        "Cannot resolve a new mythos card while a choice is still pending.",
      );
      return;
    }

    get().addAgendaProgress(1);

    const currentLocation = findCurrentLocation(locations, investigator.id);

    if (!currentLocation) {
      get().pushLog(
        "system",
        "Mythos draw could not resolve because the investigator has no location.",
      );
      return;
    }

    const card = get().drawEncounterCard();

    if (!card) {
      return;
    }

    if (card.type === "enemy") {
      const currentLocation = findCurrentLocation(locations, investigator.id);

      if (!currentLocation) {
        get().pushLog("system", "Cannot resolve enemy draw because your location is unknown.");
        return;
      }

      const enemyCard = card;
      const spawnLocation = currentLocation;
      const spawnedAloof = enemyCard.ability?.includes("Aloof") ?? false;

      const spawnedEnemy: Enemy = {
        id: `${enemyCard.code}-${Date.now()}`,
        code: enemyCard.code,
        name: enemyCard.name,
        fight: enemyCard.fight ?? 0,
        evade: enemyCard.evade ?? 0,
        health: enemyCard.health ?? 0,
        damage: enemyCard.damage ?? 0,
        horror: enemyCard.horror ?? 0,
        locationId: spawnLocation.id,
        engagedInvestigatorId: spawnedAloof ? null : investigator.id,
        exhausted: false,
        damageOnEnemy: 0,
        ability: enemyCard.ability,
        abilities: enemyCard.abilities,
        onDefeat:
          enemyCard.code === "12132"
            ? { kind: "horrorToInvestigatorsAtLocation", amount: 1 }
            : undefined,
        parley: enemyCard.parley,
        text: enemyCard.text,
        traits: enemyCard.traits,
        set: enemyCard.set,
        victoryPoints: enemyCard.victoryPoints,
      };

      let updatedInvestigator = investigator;
      let updatedLocations = locations;
      let updatedEnemies = [...enemies, spawnedEnemy];
      let updatedCampaignState = get().campaignState;
      const extraLog: ReturnType<typeof createLogEntry>[] = [];

      if (spawnedEnemy.engagedInvestigatorId === investigator.id) {
        const forcedResolution = resolveEnemyEngagedTriggers({
          enemyCode: spawnedEnemy.id,
          locationId: spawnLocation.id,
          investigator: updatedInvestigator,
          locations: updatedLocations,
          enemies: updatedEnemies,
          campaignState: updatedCampaignState,
        });

        updatedInvestigator = forcedResolution.investigator;
        updatedLocations = forcedResolution.locations;
        updatedEnemies = forcedResolution.enemies;
        updatedCampaignState = forcedResolution.campaignState;
        extraLog.push(...forcedResolution.logEntries);
      }

      set((state) => ({
        ...state,
        investigator: updatedInvestigator,
        locations: updatedLocations,
        enemies: updatedEnemies,
        campaignState: updatedCampaignState,
        log: [
          ...state.log,
          createLogEntry(
            "enemy",
            spawnedAloof
              ? `${enemyCard.name} was drawn from the encounter deck and spawned at ${spawnLocation.name} aloof.`
              : `${enemyCard.name} was drawn from the encounter deck, spawned at ${spawnLocation.name}, and engaged ${investigator.name}.`,
          ),
          ...extraLog,
        ],
      }));

      return;
    }

    const immediate = resolveEncounterCardImmediate({
      card,
      investigator,
      currentLocationId: currentLocation.id,
    });

    if (immediate.kind === "choice") {
      set({
        pendingChoice: {
          sourceCard: card,
          options: immediate.pending.options,
        },
      });

      get().pushLog(
        "scenario",
        `${card.name}: choose one.`,
      );
      return;
    }

    if (immediate.kind === "doomOnAgenda") {
      set({
        encounterDiscard: [...encounterDiscard, card],
      });

      get().pushLog("scenario", immediate.logText);
      get().addAgendaProgress(immediate.amount);
      return;
    }

    if (immediate.kind === "spawnEnemy") {
      set({
        enemies: [...enemies, immediate.enemy],
        encounterDiscard: [...encounterDiscard, card],
      });

      get().pushLog("enemy", immediate.logText);

      if (immediate.doomOnAgenda > 0) {
        get().addAgendaProgress(immediate.doomOnAgenda);
      }

      return;
    }

    if (immediate.kind === "skillTest") {
      set({
        encounterDiscard: [...encounterDiscard, card],
        pendingEncounterResolution: immediate.pending,
      });

      get().pushLog("scenario", immediate.logText);
      get().beginSkillTest(immediate.skill, immediate.difficulty, card.name);
      return;
    }

    if (immediate.kind === "attachToThreatArea") {
      const { threatArea } = get();

      const alreadyInThreatArea =
        immediate.uniqueByName &&
        threatAreaHasCard(threatArea, card.name);

      if (alreadyInThreatArea) {
        set({
          encounterDiscard: [...encounterDiscard, card],
        });

        get().pushLog(
          "scenario",
          immediate.duplicateLogText ??
          `${card.name} was discarded because a copy is already in the threat area.`,
        );
        return;
      }

      set({
        threatArea: [...threatArea, card],
      });

      get().pushLog("scenario", immediate.logText);
      return;
    }

    if (immediate.kind === "attachToLocation") {
      const { locationAttachments } = get();

      const alreadyAttached =
        immediate.uniqueByNameAtLocation &&
        hasLocationAttachment(locationAttachments, currentLocation.id, card.name);

      if (alreadyAttached) {
        set({
          encounterDiscard: [...encounterDiscard, card],
        });

        get().pushLog(
          "scenario",
          immediate.duplicateLogText ??
          `${card.name} was discarded because it is already attached to this location.`,
        );
        return;
      }

      set({
        locationAttachments: [
          ...locationAttachments,
          {
            id: `${card.id}-attachment-${Date.now()}`,
            cardCode: card.id,
            code: card.code,
            name: card.name,
            text: card.text,
            traits: card.traits,
            attachedLocationId: currentLocation.id,
            difficultyModifiers:
              card.code === ENCOUNTER_CARD_CODES.FIRE
                ? [
                  {
                    amount: 1,
                    skill: "intellect",
                    appliesTo: "investigate",
                  },
                ]
                : undefined,
          },
        ],
      });

      get().pushLog(
        "scenario",
        card.name === "Fire!"
          ? `Fire! attached to ${currentLocation.name}.`
          : immediate.logText,
      );
      return;
    }

    if (immediate.kind === "genericTreachery") {
      set({
        encounterDiscard: [...encounterDiscard, card],
        investigator: {
          ...investigator,
          horror: investigator.horror + immediate.horror,
        },
      });

      get().pushLog("scenario", immediate.logText);
      return;
    }

    set({
      encounterDiscard: [...encounterDiscard, card],
    });

    get().pushLog("scenario", immediate.logText);
  },

  resolvePendingChoice: (optionId) => {
    const { pendingChoice, agenda, encounterDiscard } = get();

    if (!pendingChoice) {
      get().pushLog("system", "No encounter choice is currently pending.");
      return;
    }

    const selectedOption = pendingChoice.options.find(
      (option) => option.id === optionId,
    );

    if (!selectedOption) {
      get().pushLog(
        "system",
        `Unknown encounter choice option: ${optionId}.`,
      );
      return;
    }

    const sourceCard = pendingChoice.sourceCard;

    if (selectedOption.effect.kind === "doomOnAgenda") {
      set({
        agenda: agenda
          ? {
            ...agenda,
            progress: agenda.progress + selectedOption.effect.amount,
          }
          : null,
        encounterDiscard: [...encounterDiscard, sourceCard],
        pendingChoice: null,
      });

      get().pushLog(
        "scenario",
        `${sourceCard.name}: placed ${selectedOption.effect.amount} doom on the current agenda.`,
      );
      return;
    }

    if (selectedOption.effect.kind === "surge") {
      set({
        encounterDiscard: [...encounterDiscard, sourceCard],
        pendingChoice: null,
      });

      get().pushLog(
        "scenario",
        `${sourceCard.name} gained surge.`,
      );

      get().resolveMythosPhase();
      return;
    }

    get().pushLog(
      "system",
      `${sourceCard.name} choice could not be resolved.`,
    );
  },

  startGame: async () => {
    try {
      await get().setupGame();
      set({ screen: "game" });
    } catch (error) {
      console.error(error);
    }
  },

  returnToHome: () => {
    const selectedScenario = getSelectedScenario(get());

    set({
      screen: "home",
      deck: [],
      hand: [],
      discard: [],
      playArea: [],
      encounterDeck: buildInitialEncounterDeck(selectedScenario.encounterCardCodes),
      encounterDiscard: [],
      chaosBag: selectedScenario.chaosBag
        ? [...selectedScenario.chaosBag]
        : [...startingChaosBag],
      locations: applyConditionalLocationVisibility({
        locations: cloneScenarioLocations(selectedScenario.locations),
        campaignState: get().campaignState,
      }),
      agenda: getInitialAgendaState(selectedScenario),
      act: getInitialActState(selectedScenario),
      scenarioStatus: "inProgress",
      scenarioResolutionText: null,
      scenarioResolutionTitle: null,
      scenarioResolutionSubtitle: null,
      pendingAssetPlay: null,
      showDeckInspector: false,
      showEncounterInspector: false,
      pendingChoice: null,
      threatArea: [],
      log: [],
      lastSkillTest: null,
      activeSkillTest: null,
      pendingTestResolution: null,
      selectedEnemyTargetId: null,
      draggedCardId: null,
      turn: { round: 1, phase: "mythos", actionsRemaining: 0 },
      isMulliganActive: false,
      selectedMulliganCardIds: [],
      pendingInvestigateDifficultyModifier: 0,
      pendingFightCombatModifier: 0,
      pendingFightDamageBonus: 0,
      lastEncounterCard: null,
      pendingEncounterResolution: null,
      locationAttachments: [],
    });
  },

  setupGame: async () => {
    const state = get();

    const debugMode = state.debugMode;
    const debugPreset = state.debugPreset;

    const importedArkhamBuildDeckJson = state.importedArkhamBuildDeckJson;
    const selectedDeckId = state.selectedDeckId.trim();

    let loadedDeck: LoadedDeck;

    try {
      loadedDeck = await resolveSelectedDeck(state);
    } catch (error) {
      console.error(error);
      get().pushLog(
        "system",
        importedArkhamBuildDeckJson
          ? "Failed to load imported Arkham.build deck JSON."
          : selectedDeckId
            ? `Failed to load ArkhamDB deck ${selectedDeckId}.`
            : "Cannot start game without an ArkhamDB deck ID or imported Arkham.build JSON.",
      );
      throw error;
    }

    const selected = loadedDeck.investigatorCode
      ? state.availableInvestigators.find(
        (investigator) => investigator.code === loadedDeck.investigatorCode,
      )
      : state.availableInvestigators.find(
        (investigator) => investigator.id === state.selectedInvestigatorId,
      );

    if (!selected) {
      get().pushLog(
        "system",
        "Cannot start game because the selected deck's investigator is not supported.",
      );
      throw new Error("Deck investigator is not supported locally.");
    }

    const selectedScenario = getSelectedScenario(get());
    const chosenInvestigator = createGameInvestigator(selected);

    const validationWarnings = loadedDeck.validationWarnings;
    const unsupportedCodes = loadedDeck.unsupportedCodes;
    const randomWeaknesses = loadedDeck.randomWeaknesses;
    if (validationWarnings.length > 0) {
      for (const warning of validationWarnings) {
        get().pushLog("system", `Deck Warning: ${warning}`);
      }
    }

    if (unsupportedCodes.length > 0) {
      get().pushLog(
        "system",
        `Unsupported card code(s) skipped: ${unsupportedCodes.join(", ")}.`,
      );
    }

    const deckCards = loadedDeck.cards;

    if (deckCards.length === 0) {
      get().pushLog(
        "system",
        `ArkhamDB deck ${selectedDeckId} did not produce any playable local cards.`,
      );
      throw new Error("ArkhamDB deck contained no supported local cards.");
    }

    const shuffledDeck = shuffle(deckCards);

    let initialEncounterDeck = buildInitialEncounterDeck(
      selectedScenario.encounterCardCodes,
    );

    const initialSetAsideEncounterCards = buildEncounterDeckFromCodes(
      selectedScenario.setAsideEncounterCardCodes ?? [],
    );

    let setupEnemies: Enemy[] = [];
    let setupLocationAttachments: LocationAttachment[] = [];
    const setupLogEntries: ReturnType<typeof createLogEntry>[] = [];

    const normalizedLocations = applyConditionalLocationVisibility({
      locations: normalizeScenarioLocations(
        selectedScenario.locations,
        chosenInvestigator.id,
        selectedScenario.startingLocationId,
      ),
      campaignState: get().campaignState,
    });

    for (const spawn of selectedScenario.enemySpawns ?? []) {
      const beforeCount = setupEnemies.length;

      setupEnemies = spawnEnemyAtLocation({
        enemyCode: spawn.enemyCode,
        locationId: spawn.locationId,
        enemies: setupEnemies,
        investigator: chosenInvestigator,
        locations: normalizedLocations,
      });

      if (setupEnemies.length > beforeCount) {
        const spawnedEnemy = setupEnemies[setupEnemies.length - 1];

        initialEncounterDeck = removeOneEncounterCardByCode(
          initialEncounterDeck,
          spawn.enemyCode,
        );

        setupLogEntries.push(
          createLogEntry(
            "scenario",
            `${spawnedEnemy.name} spawned at ${spawn.locationId} during setup.`,
          ),
        );
      } else {
        setupLogEntries.push(
          createLogEntry(
            "system",
            `Could not spawn encounter enemy ${spawn.enemyCode} at ${spawn.locationId} during setup.`,
          ),
        );
      }
    }

    for (const attachment of selectedScenario.locationAttachments ?? []) {
      const beforeCount = setupLocationAttachments.length;

      setupLocationAttachments = attachEncounterCardToLocation({
        cardCode: attachment.cardCode,
        locationId: attachment.locationId,
        locationAttachments: setupLocationAttachments,
      });

      if (setupLocationAttachments.length > beforeCount) {
        const addedAttachment =
          setupLocationAttachments[setupLocationAttachments.length - 1];

        initialEncounterDeck = removeOneEncounterCardByCode(
          initialEncounterDeck,
          attachment.cardCode,
        );

        setupLogEntries.push(
          createLogEntry(
            "scenario",
            `${addedAttachment.name} was attached to ${attachment.locationId} during setup.`,
          ),
        );
      } else {
        setupLogEntries.push(
          createLogEntry(
            "system",
            `Could not attach encounter card ${attachment.cardCode} to ${attachment.locationId} during setup.`,
          ),
        );
      }
    }

    let debugInvestigator = chosenInvestigator;

    let debugLocations = applyConditionalLocationVisibility({
      locations: normalizeScenarioLocations(
        selectedScenario.locations,
        chosenInvestigator.id,
        selectedScenario.startingLocationId,
      ),
      campaignState: get().campaignState,
    });

    let debugThreatArea: EncounterCard[] = [];
    let debugSetAsideEncounterCards = initialSetAsideEncounterCards;
    const debugAct = getInitialActState(selectedScenario);
    const debugAgenda = getInitialAgendaState(selectedScenario)

    if (debugMode && debugPreset === "threatAreaDiscard") {
      debugLocations = debugLocations.map((location) => {
        if (location.id === "fake-dormitories") {
          return {
            ...location,
            isVisible: true,
            revealed: true,
            investigatorsHere: [chosenInvestigator.id],
          };
        }

        return {
          ...location,
          investigatorsHere: location.investigatorsHere.filter(
            (id) => id !== chosenInvestigator.id,
          ),
        };
      });

      const debugTreachery = getEncounterCardByCode(
        ENCOUNTER_CARD_CODES.DAVES_TEST_TREACHERY,
      );

      if (debugTreachery) {
        debugThreatArea = [debugTreachery];
      }

      setupLogEntries.push(
        createLogEntry("system", "Debug preset applied: threatAreaDiscard."),
      );
    }

    if (debugMode && debugPreset === "enemyFollowAndFight") {
      debugLocations = debugLocations.map((location) => {
        if (location.id === "fake-dormitories") {
          return {
            ...location,
            isVisible: true,
            revealed: true,
            investigatorsHere: [chosenInvestigator.id],
          };
        }

        if (location.id === "fake-miskatonic-quad") {
          return {
            ...location,
            isVisible: true,
            revealed: true,
            investigatorsHere: location.investigatorsHere.filter(
              (id) => id !== chosenInvestigator.id,
            ),
          };
        }

        return {
          ...location,
          investigatorsHere: location.investigatorsHere.filter(
            (id) => id !== chosenInvestigator.id,
          ),
        };
      });

      setupEnemies = spawnEnemyAtLocation({
        enemyCode: ENCOUNTER_CARD_CODES.DAVES_TEST_ENEMY_1,
        locationId: "fake-dormitories",
        enemies: [],
        investigator: chosenInvestigator,
        locations: debugLocations,
      });

      setupLogEntries.push(
        createLogEntry("system", "Debug preset applied: enemyFollowAndFight."),
      );
    }

    if (debugMode && debugPreset === "setAsideSpawn") {
      debugLocations = debugLocations.map((location) => {
        if (location.id === "fake-dormitories") {
          return {
            ...location,
            isVisible: true,
            revealed: true,
            investigatorsHere: [chosenInvestigator.id],
          };
        }

        if (location.id === "fake-miskatonic-quad") {
          return {
            ...location,
            isVisible: true,
            revealed: true,
            investigatorsHere: location.investigatorsHere.filter(
              (id) => id !== chosenInvestigator.id,
            ),
          };
        }

        return {
          ...location,
          investigatorsHere: location.investigatorsHere.filter(
            (id) => id !== chosenInvestigator.id,
          ),
        };
      });

      const setAsideEnemy = getEncounterCardByCode("14004");

      if (
        setAsideEnemy &&
        !debugSetAsideEncounterCards.some((card) => card.code === "14004")
      ) {
        debugSetAsideEncounterCards = [
          ...debugSetAsideEncounterCards,
          setAsideEnemy,
        ];
      }

      if (debugAct) {
        debugInvestigator = {
          ...debugInvestigator,
          clues: debugAct.threshold,
        };
      }

      setupLogEntries.push(
        createLogEntry("system", "Debug preset applied: setAsideSpawn."),
      );
    }

    if (debugMode && debugPreset === "locationAttachmentDiscard") {
      debugLocations = debugLocations.map((location) => {
        if (location.id === "fake-dormitories") {
          return {
            ...location,
            isVisible: true,
            revealed: true,
            investigatorsHere: [chosenInvestigator.id],
          };
        }

        return {
          ...location,
          investigatorsHere: location.investigatorsHere.filter(
            (id) => id !== chosenInvestigator.id,
          ),
        };
      });

      setupLocationAttachments = attachEncounterCardToLocation({
        cardCode: ENCOUNTER_CARD_CODES.FIRE,
        locationId: "fake-dormitories",
        locationAttachments: [],
      });

      setupLogEntries.push(
        createLogEntry(
          "system",
          "Debug preset applied: locationAttachmentDiscard.",
        ),
      );
    }

    if (debugMode && debugPreset === "enemyDiscard") {
      debugLocations = debugLocations.map((location) => {
        if (location.id === "fake-dormitories") {
          return {
            ...location,
            isVisible: true,
            revealed: true,
            investigatorsHere: [chosenInvestigator.id],
          };
        }

        return {
          ...location,
          investigatorsHere: location.investigatorsHere.filter(
            (id) => id !== chosenInvestigator.id,
          ),
        };
      });

      setupEnemies = spawnEnemyAtLocation({
        enemyCode: ENCOUNTER_CARD_CODES.DAVES_TEST_ENEMY_1,
        locationId: "fake-dormitories",
        enemies: [],
        investigator: chosenInvestigator,
        locations: debugLocations,
      });

      setupLogEntries.push(
        createLogEntry("system", "Debug preset applied: enemyDiscard."),
      );
    }

    set({
      investigator: debugInvestigator,
      threatArea: debugThreatArea,
      locations: debugLocations,
      setAsideEncounterCards: debugSetAsideEncounterCards,
      act: debugAct,
      agenda: debugAgenda,
      deck: shuffledDeck,
      hand: [],
      discard: [],
      playArea: [],
      encounterDeck: initialEncounterDeck,

      encounterDiscard: [],
      enemies: setupEnemies,
      chaosBag: selectedScenario.chaosBag
        ? [...selectedScenario.chaosBag]
        : [...startingChaosBag],
      scenarioStatus: "inProgress",
      scenarioResolutionText: null,
      scenarioResolutionTitle: null,
      scenarioResolutionSubtitle: null,
      pendingAssetPlay: null,
      showDeckInspector: false,
      pendingChoice: null,
      isMulliganActive: true,
      locationAttachments: setupLocationAttachments,
      selectedMulliganCardIds: [],
      pendingInvestigateDifficultyModifier: 0,
      pendingFightCombatModifier: 0,
      pendingFightDamageBonus: 0,
      pendingEncounterResolution: null,
      log: [
        createLogEntry(
          "system",
          `Selected investigator: ${chosenInvestigator.name}`,
        ),
        createLogEntry(
          "scenario",
          `Selected scenario: ${selectedScenario.name}`,
        ),
        createLogEntry(
          "system",
          importedArkhamBuildDeckJson
            ? `Deck source: Arkham.build import${loadedDeck.deckName ? ` (${loadedDeck.deckName})` : ""}.`
            : `Deck source: ArkhamDB deck ${selectedDeckId}.`,
        ),
        ...setupLogEntries,
        ...(loadedDeck.unsupportedCodes.length > 0
          ? [
            createLogEntry(
              "system",
              `Unsupported card code(s) skipped: ${loadedDeck.unsupportedCodes.join(", ")}.`,
            ),
          ]
          : []),
        ...(unsupportedCodes.length > 0
          ? [
            createLogEntry(
              "system",
              `Unsupported card code(s) skipped: ${unsupportedCodes.join(", ")}.`,
            ),
          ]
          : []),

        ...(randomWeaknesses.length > 0
          ? [
            createLogEntry(
              "system",
              `Random weakness assigned: ${randomWeaknesses.join(", ")}.`,
            ),
          ]
          : []),

        ...(validationWarnings.length > 0
          ? validationWarnings.map((warning) =>
            createLogEntry("system", `Deck warning: ${warning}`),
          )
          : []),
        createLogEntry("system", "Game setup complete."),
      ],
      lastSkillTest: null,
      activeSkillTest: null,
      pendingTestResolution: null,
      selectedEnemyTargetId: null,
      draggedCardId: null,
      lastEncounterCard: null,
      turn: { round: 1, phase: "mythos", actionsRemaining: 0 },
    });

    get().drawStartingHand(5);
    get().pushLog(
      "system",
      "Opening hand drawn. Choose any number of cards to mulligan.",
    );
  },

  drawCard: () => {
    const { deck, hand } = get();

    if (deck.length === 0) {
      get().pushLog("system", "Tried to draw a card, but the deck is empty.");
      return;
    }

    const [topCard, ...remainingDeck] = deck;

    set({
      deck: remainingDeck,
      hand: [...hand, topCard],
    });

    get().pushLog("player", `Drew card: ${topCard.name}`);
  },

  shuffleDeck: () => {
    const { deck } = get();

    if (deck.length <= 1) {
      return;
    }

    set({
      deck: shuffleArray(deck),
    });

    get().pushLog("player", "Shuffled the player deck.");
  },

  shuffleEncounterDeck: () => {
    const { encounterDeck } = get();

    if (encounterDeck.length <= 1) {
      return;
    }

    set({
      encounterDeck: shuffleArray(encounterDeck),
    });

    get().pushLog("scenario", "Shuffled the encounter deck.");
  },

  drawStartingHand: (count = 5) => {
    let { deck, hand } = get();
    let cardsDrawn = 0;
    const skippedWeaknesses: PlayerCard[] = [];

    while (cardsDrawn < count && deck.length > 0) {
      const [topCard, ...remainingDeck] = deck;
      deck = remainingDeck;

      if (isOpeningHandWeakness(topCard)) {
        skippedWeaknesses.push(topCard);
        get().pushLog(
          "player",
          `Set aside opening-hand weakness: ${topCard.name}`,
        );
        continue;
      }

      hand = [...hand, topCard];
      cardsDrawn += 1;
      get().pushLog("player", `Drew opening hand card: ${topCard.name}`);
    }

    if (skippedWeaknesses.length > 0) {
      deck = shuffleArray([...deck, ...skippedWeaknesses]);
      get().pushLog(
        "player",
        `Shuffled ${skippedWeaknesses.length} weakness${skippedWeaknesses.length === 1 ? "" : "es"
        } back into the player deck.`,
      );
    }

    set({
      deck,
      hand,
    });

    if (cardsDrawn < count) {
      get().pushLog(
        "system",
        `Opening hand drew ${cardsDrawn} card${cardsDrawn === 1 ? "" : "s"
        } because the deck ran out of non-weakness cards.`,
      );
    }
  },

  discardCard: (cardCode: string) => {
    const { hand, discard, activeSkillTest, scenarioStatus } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    if (activeSkillTest) {
      get().pushLog(
        "system",
        "Cannot manually discard from hand while a skill test is active.",
      );
      return;
    }

    const card = hand.find((c) => c.instanceId === cardCode);

    if (!card) {
      return;
    }

    set({
      hand: hand.filter((c) => c.instanceId !== cardCode),
      discard: [...discard, card],
    });

    get().pushLog("player", `Discarded card: ${card.name}`);
  },

  playCard: (cardCode: string) => {
    const {
      hand,
      discard,
      playArea,
      investigator,
      enemies,
      turn,
      activeSkillTest,
      scenarioStatus,
    } = get();

    if (isScenarioResolved(scenarioStatus)) {
      set({ draggedCardId: null, pendingAssetPlay: null });
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    if (activeSkillTest) {
      set({ draggedCardId: null, pendingAssetPlay: null });
      get().pushLog(
        "system",
        "Cannot play cards normally while a skill test is active.",
      );
      return;
    }

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      const message =
        turn.phase !== "investigation"
          ? "Cannot play a card outside the Investigation phase."
          : "Cannot play a card. No actions remaining.";

      set({ draggedCardId: null, pendingAssetPlay: null });
      get().pushLog("system", message);
      return;
    }

    const card = hand.find((currentCard) => currentCard.instanceId === cardCode);

    if (!card) {
      set({ draggedCardId: null, pendingAssetPlay: null });
      get().pushLog(
        "system",
        "Could not play that card because it was not in hand.",
      );
      return;
    }

    const cost = getCardCost(card);

    if (investigator.resources < cost) {
      set({ draggedCardId: null, pendingAssetPlay: null });
      get().pushLog(
        "system",
        `Cannot play ${card.name}. Not enough resources.`,
      );
      return;
    }

    if (card.type === "asset") {
      const canPlayInSlots = canPlayInAvailableSlots(
        card,
        playArea,
        investigator,
      );

      if (!canPlayInSlots) {
        const replacementPlan = getReplacementPlan(
          card,
          playArea,
          investigator,
        );

        if (replacementPlan) {
          set({
            draggedCardId: null,
            pendingAssetPlay: {
              cardCode: card.instanceId,
              replacedSlot: replacementPlan.blockedSlot,
              replacementChoices: replacementPlan.replacementChoices,
              selectedReplacementIds: [],
              requiredHandSlotsToFree: replacementPlan.requiredHandSlotsToFree,
            },
          });

          get().pushLog(
            "system",
            replacementPlan.requiredHandSlotsToFree
              ? `Choose hand asset replacements for ${card.name}. Free ${replacementPlan.requiredHandSlotsToFree} hand slot${replacementPlan.requiredHandSlotsToFree === 1 ? "" : "s"}.`
              : `Choose an in-play ${replacementPlan.blockedSlot} asset to discard in order to play ${card.name}.`,
          );
          return;
        }

        set({ draggedCardId: null, pendingAssetPlay: null });
        get().pushLog(
          "system",
          `Cannot play ${card.name}. No available equipment slots.`,
        );
        return;
      }
    }

    if (card.type === "skill") {
      set({ draggedCardId: null, pendingAssetPlay: null });
      get().pushLog(
        "system",
        `Cannot play ${card.name} as a normal action. Commit it during a skill test instead.`,
      );
      return;
    }

    if (card.type !== "asset" && card.type !== "event") {
      set({ draggedCardId: null, pendingAssetPlay: null });
      get().pushLog(
        "system",
        `Playing ${card.name} is not implemented for card type ${card.type}.`,
      );
      return;
    }

    let updatedInvestigator = investigator;
    const logEntries: ReturnType<typeof createLogEntry>[] = [];

    if (hasReadyEngagedEnemy({ investigator: updatedInvestigator, enemies })) {
      const aooResolution = resolveAttackOfOpportunity({
        investigator: updatedInvestigator,
        enemies,
        logPrefix: `playing ${card.name}`,
      });

      updatedInvestigator = aooResolution.investigator;
      logEntries.push(...aooResolution.logEntries);
    }

    const updatedHand = hand.filter(
      (currentCard) => currentCard.instanceId !== cardCode,
    );

    updatedInvestigator = {
      ...updatedInvestigator,
      resources: updatedInvestigator.resources - cost,
    };

    const updatedTurn = {
      ...turn,
      actionsRemaining: turn.actionsRemaining - 1,
    };

    if (card.type === "asset") {
      logEntries.push(
        createLogEntry(
          "player",
          `Played asset ${card.name} for ${cost} resource(s). 1 action spent.`,
        ),
      );

      set((state) => ({
        investigator: updatedInvestigator,
        hand: updatedHand,
        playArea: [
          ...playArea,
          {
            ...card,
            exhausted: false,
            counters: normalizeCardCounters(card.counters),
          },
        ],
        turn: updatedTurn,
        draggedCardId: null,
        pendingAssetPlay: null,
        log: [...state.log, ...logEntries],
      }));
      return;
    }

    const resolvedEvent = resolvePlayedEvent(card, updatedInvestigator);

    logEntries.push(
      createLogEntry(
        "player",
        `${resolvedEvent.logText} Paid ${cost} resource(s). 1 action spent.`,
      ),
    );

    set((state) => ({
      investigator: resolvedEvent.investigator,
      hand: updatedHand,
      discard: [...discard, card],
      turn: updatedTurn,
      draggedCardId: null,
      pendingAssetPlay: null,
      log: [...state.log, ...logEntries],
    }));
  },

  confirmAssetReplacement: () => {
    const {
      hand,
      discard,
      playArea,
      investigator,
      turn,
      pendingAssetPlay,
      activeSkillTest,
      scenarioStatus,
    } = get();
    if (isScenarioResolved(scenarioStatus)) {
      set({ pendingAssetPlay: null, draggedCardId: null });
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }
    if (activeSkillTest) {
      set({ pendingAssetPlay: null, draggedCardId: null });
      get().pushLog(
        "system",
        "Cannot resolve asset replacement while a skill test is active.",
      );
      return;
    }
    if (!pendingAssetPlay) return;
    const cardToPlay = hand.find(
      (entry) => entry.instanceId === pendingAssetPlay.cardCode,
    );
    const selectedReplacementCards = playArea.filter((entry) =>
      pendingAssetPlay.selectedReplacementIds.includes(entry.instanceId),
    );
    if (!cardToPlay) {
      set({ pendingAssetPlay: null, draggedCardId: null });
      get().pushLog("system", "Asset replacement could not be completed.");
      return;
    }
    if (selectedReplacementCards.length === 0) {
      get().pushLog(
        "system",
        "Choose at least one asset to replace before confirming.",
      );
      return;
    }
    if (pendingAssetPlay.requiredHandSlotsToFree) {
      const freedHandSlots = selectedReplacementCards.reduce(
        (sum, card) => sum + getCardSlotUsage(card).Hand,
        0,
      );
      if (freedHandSlots < pendingAssetPlay.requiredHandSlotsToFree) {
        get().pushLog(
          "system",
          `Choose replacements that free at least ${pendingAssetPlay.requiredHandSlotsToFree} hand slot${pendingAssetPlay.requiredHandSlotsToFree === 1 ? "" : "s"}.`,
        );
        return;
      }
    } else if (selectedReplacementCards.length !== 1) {
      get().pushLog(
        "system",
        "Choose exactly one asset to replace before confirming.",
      );
      return;
    }
    const cost = getCardCost(cardToPlay);
    if (investigator.resources < cost) {
      set({ pendingAssetPlay: null, draggedCardId: null });
      get().pushLog(
        "system",
        `Cannot play ${cardToPlay.name}. Not enough resources.`,
      );
      return;
    }
    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      set({ pendingAssetPlay: null, draggedCardId: null });
      get().pushLog("system", "Cannot complete asset replacement right now.");
      return;
    }
    const selectedReplacementIds = new Set(
      pendingAssetPlay.selectedReplacementIds,
    );
    const updatedPlayArea = playArea
      .filter((entry) => !selectedReplacementIds.has(entry.instanceId))
      .concat({
        ...cardToPlay,
        exhausted: false,
        counters: normalizeCardCounters(cardToPlay.counters),
      });
    set({
      investigator: {
        ...investigator,
        resources: investigator.resources - cost,
      },
      hand: hand.filter((entry) => entry.instanceId !== cardToPlay.instanceId),
      discard: [...discard, ...selectedReplacementCards],
      playArea: updatedPlayArea,
      turn: { ...turn, actionsRemaining: turn.actionsRemaining - 1 },
      pendingAssetPlay: null,
      draggedCardId: null,
    });
    get().pushLog(
      "player",
      `Discarded ${selectedReplacementCards.map((card) => card.name).join(", ")} and played ${cardToPlay.name} for ${cost} resource(s). 1 action spent.`,
    );
  },

  cancelPendingAssetPlay: () => {
    const { pendingAssetPlay } = get();

    if (!pendingAssetPlay) {
      return;
    }

    set({
      pendingAssetPlay: null,
      draggedCardId: null,
    });

    get().pushLog("system", "Cancelled asset replacement.");
  },

  canPlayCardInSlots: (cardCode: string) => {
    const { hand, playArea, investigator } = get();
    const card = hand.find((entry) => entry.instanceId === cardCode);

    if (!card) {
      return false;
    }

    return canPlayInAvailableSlots(card, playArea, investigator);
  },

  togglePlayAreaCardExhausted: (cardCode: string) => {
    const { playArea, log } = get();

    const card = playArea.find((entry) => entry.instanceId === cardCode);

    if (!card) {
      return;
    }

    const nextExhausted = !card.exhausted;

    set({
      playArea: playArea.map((entry) =>
        entry.instanceId === cardCode ? { ...entry, exhausted: nextExhausted } : entry,
      ),
      log: [
        ...log,
        nextExhausted
          ? `${card.name} was exhausted.`
          : `${card.name} was readied.`,
      ],
    });
  },

  incrementPlayAreaCardCounter: (cardCode, counterType) => {
    const { playArea, log } = get();

    const card = playArea.find((entry) => entry.instanceId === cardCode);
    if (!card) {
      return;
    }

    const currentValue = card.counters?.[counterType] ?? 0;
    const nextValue = currentValue + 1;

    set({
      playArea: playArea.map((entry) =>
        entry.instanceId === cardCode
          ? {
            ...entry,
            counters: {
              ...entry.counters,
              [counterType]: nextValue,
            },
          }
          : entry,
      ),
      log: [...log, `${card.name}: ${counterType} increased to ${nextValue}.`],
    });
  },

  decrementPlayAreaCardCounter: (cardCode, counterType) => {
    const { playArea, log } = get();

    const card = playArea.find((entry) => entry.instanceId === cardCode);
    if (!card) {
      return;
    }

    const currentValue = card.counters?.[counterType] ?? 0;
    const nextValue = Math.max(0, currentValue - 1);

    set({
      playArea: playArea.map((entry) => {
        if (entry.instanceId !== cardCode) {
          return entry;
        }

        const nextCounters = {
          ...entry.counters,
          [counterType]: nextValue,
        };

        if (nextValue === 0) {
          delete nextCounters[counterType];
        }

        return {
          ...entry,
          counters: nextCounters,
        };
      }),
      log: [...log, `${card.name}: ${counterType} decreased to ${nextValue}.`],
    });
  },

  drawChaosToken: () => {
    const { chaosBag } = get();

    if (chaosBag.length === 0) {
      get().pushLog(
        "system",
        "Tried to draw a chaos token, but the bag is empty.",
      );
      return null;
    }

    const token = chaosBag[Math.floor(Math.random() * chaosBag.length)];
    get().pushLog("skill-test", `Drew chaos token: ${String(token)}`);
    return token;
  },

  gainResource: (amount = 1) => {
    const { investigator } = get();

    set({
      investigator: {
        ...investigator,
        resources: investigator.resources + amount,
      },
    });

    get().pushLog("player", `Gained ${amount} resource(s).`);
  },

  spendResource: (amount = 1) => {
    const { investigator } = get();

    set({
      investigator: {
        ...investigator,
        resources: Math.max(0, investigator.resources - amount),
      },
    });

    get().pushLog("player", `Spent ${amount} resource(s).`);
  },

  gainClue: (amount = 1) => {
    const { investigator, threatArea } = get();

    const horrorFromThreatArea =
      amount > 0 && threatAreaHasCard(threatArea, "Unspeakable Truths") ? 1 : 0;

    set({
      investigator: {
        ...investigator,
        clues: investigator.clues + amount,
        horror: investigator.horror + horrorFromThreatArea,
      },
    });

    get().pushLog("player", `Gained ${amount} clue(s).`);

    if (horrorFromThreatArea > 0) {
      get().pushLog(
        "scenario",
        "Unspeakable Truths triggered after discovering clues. Took 1 horror.",
      );
    }
  },

  takeDamage: (amount = 1) => {
    const { investigator } = get();

    set({
      investigator: {
        ...investigator,
        damage: investigator.damage + amount,
      },
    });

    get().pushLog("combat", `Took ${amount} damage.`);
  },

  takeHorror: (amount = 1) => {
    const { investigator } = get();

    set({
      investigator: {
        ...investigator,
        horror: investigator.horror + amount,
      },
    });

    get().pushLog("combat", `Took ${amount} horror.`);
  },

  moveInvestigator: (locationId: string) => {
    const {
      investigator,
      enemies,
      locations,
      turn,
      activeSkillTest,
      selectedEnemyTargetId,
      scenarioStatus,
    } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    if (activeSkillTest) {
      get().pushLog("system", "Cannot move while a skill test is active.");
      return;
    }

    const currentLocation = findCurrentLocation(locations, investigator.id);
    const destination = locations.find(
      (location) => location.id === locationId,
    );

    if (!destination) {
      return;
    }

    if (!destination.isVisible) {
      get().pushLog(
        "system",
        `Cannot move to ${destination.name}. It is not visible yet.`,
      );
      return;
    }

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      const message =
        turn.phase !== "investigation"
          ? "Cannot move right now. Movement is only available during the Investigation phase."
          : "Cannot move. No actions remaining.";

      get().pushLog("system", message);
      return;
    }

    if (
      currentLocation &&
      !currentLocation.connections.includes(locationId) &&
      currentLocation.id !== locationId
    ) {
      get().pushLog(
        "system",
        `Cannot move from ${currentLocation.name} to ${destination.name}. Not connected.`,
      );
      return;
    }

    const movementLog: ReturnType<typeof createLogEntry>[] = [];
    let updatedInvestigator = investigator;
    let finalEnemies = enemies;
    let finalCampaignState = get().campaignState;

    if (
      hasReadyEngagedEnemy({
        investigator: updatedInvestigator,
        enemies: finalEnemies,
      })
    ) {
      const aooResolution = resolveAttackOfOpportunity({
        investigator: updatedInvestigator,
        enemies: finalEnemies,
        logPrefix: `moving to ${destination.name}`,
      });

      updatedInvestigator = aooResolution.investigator;
      finalEnemies = aooResolution.enemies;
      movementLog.push(...aooResolution.logEntries);
    }

    finalEnemies = finalEnemies.map((enemy) =>
      enemy.engagedInvestigatorId === investigator.id
        ? {
          ...enemy,
          locationId,
        }
        : enemy,
    );

    const updatedLocations = locations.map((location) => {
      const withoutInvestigator = location.investigatorsHere.filter(
        (id) => id !== investigator.id,
      );

      if (location.id === locationId) {
        return {
          ...location,
          investigatorsHere: [...withoutInvestigator, investigator.id],
          isVisible: true,
          revealed: true,
        };
      }

      return {
        ...location,
        investigatorsHere: withoutInvestigator,
      };
    });

    const destinationLocation = updatedLocations.find(
      (location) => location.id === locationId,
    );

    let finalLocations = updatedLocations;

    if (destinationLocation) {
      const forcedResolution = emitLocationEvent({
        locationId: destinationLocation.id,
        event: "enterLocation",
        investigator: updatedInvestigator,
        locations: finalLocations,
        enemies: finalEnemies,
        campaignState: finalCampaignState,
      });

      updatedInvestigator = forcedResolution.investigator;
      finalLocations = forcedResolution.locations;
      finalEnemies = forcedResolution.enemies;
      finalCampaignState = forcedResolution.campaignState;

      movementLog.push(...forcedResolution.logEntries);
    }

    movementLog.push(
      createLogEntry("player", `Moved to ${destination.name}. 1 action spent.`),
    );

    const nextSelectedEnemyTargetId =
      selectedEnemyTargetId &&
        finalEnemies.some(
          (enemy) =>
            enemy.id === selectedEnemyTargetId &&
            enemy.engagedInvestigatorId === investigator.id &&
            enemy.locationId === locationId,
        )
        ? selectedEnemyTargetId
        : null;

    set((state) => ({
      investigator: updatedInvestigator,
      locations: finalLocations,
      enemies: finalEnemies,
      campaignState: finalCampaignState,
      selectedEnemyTargetId: nextSelectedEnemyTargetId,
      turn: {
        ...turn,
        actionsRemaining: turn.actionsRemaining - 1,
      },
      log: [...state.log, ...movementLog],
    }));

    get().engageEnemiesAtLocation();
  },

  setPhase: (phase) => {
    const {
      turn,
      investigator,
      locations,
      enemies,
      threatArea,
      campaignState,
      agenda,
      act,
    } = get();

    let updatedInvestigator = investigator;
    let updatedLocations = locations;
    let updatedEnemies = enemies;
    let updatedCampaignState = campaignState;
    const phaseLog: ReturnType<typeof createLogEntry>[] = [];

    if (turn.phase === "investigation" && phase !== "investigation") {
      const locationResolution = emitCurrentLocationEvent({
        event: "turnEnds",
        investigator: updatedInvestigator,
        locations: updatedLocations,
        enemies: updatedEnemies,
        campaignState: updatedCampaignState,
      });

      updatedInvestigator = locationResolution.investigator;
      updatedLocations = locationResolution.locations;
      updatedEnemies = locationResolution.enemies;
      updatedCampaignState = locationResolution.campaignState;
      phaseLog.push(...locationResolution.logEntries);

      const threatResolution = emitThreatAreaEvent({
        event: "turnEnds",
        investigator: updatedInvestigator,
        locations: updatedLocations,
        enemies: updatedEnemies,
        threatArea,
        campaignState: updatedCampaignState,
      });

      updatedInvestigator = threatResolution.investigator;
      updatedLocations = threatResolution.locations;
      updatedEnemies = threatResolution.enemies;
      updatedCampaignState = threatResolution.campaignState;
      phaseLog.push(...threatResolution.logEntries);

      const enemyResolution = emitEngagedEnemyEvent({
        event: "turnEnds",
        investigator: updatedInvestigator,
        locations: updatedLocations,
        enemies: updatedEnemies,
        campaignState: updatedCampaignState,
      });

      updatedInvestigator = enemyResolution.investigator;
      updatedLocations = enemyResolution.locations;
      updatedEnemies = enemyResolution.enemies;
      updatedCampaignState = enemyResolution.campaignState;
      phaseLog.push(...enemyResolution.logEntries);

      const scenarioResolution = emitScenarioEvent({
        event: "turnEnds",
        investigator: updatedInvestigator,
        locations: updatedLocations,
        enemies: updatedEnemies,
        campaignState: updatedCampaignState,
        agenda,
        act,
      });

      updatedInvestigator = scenarioResolution.investigator;
      updatedLocations = scenarioResolution.locations;
      updatedEnemies = scenarioResolution.enemies;
      updatedCampaignState = scenarioResolution.campaignState;
      phaseLog.push(...scenarioResolution.logEntries);
    }

    const nextTurn = {
      ...turn,
      phase,
      actionsRemaining: phase === "investigation" ? 3 : turn.actionsRemaining,
    };

    if (turn.phase !== "investigation" && phase === "investigation") {
      const locationResolution = emitCurrentLocationEvent({
        event: "turnBegins",
        investigator: updatedInvestigator,
        locations: updatedLocations,
        enemies: updatedEnemies,
        campaignState: updatedCampaignState,
      });

      updatedInvestigator = locationResolution.investigator;
      updatedLocations = locationResolution.locations;
      updatedEnemies = locationResolution.enemies;
      updatedCampaignState = locationResolution.campaignState;
      phaseLog.push(...locationResolution.logEntries);

      const threatResolution = emitThreatAreaEvent({
        event: "turnBegins",
        investigator: updatedInvestigator,
        locations: updatedLocations,
        enemies: updatedEnemies,
        threatArea,
        campaignState: updatedCampaignState,
      });

      updatedInvestigator = threatResolution.investigator;
      updatedLocations = threatResolution.locations;
      updatedEnemies = threatResolution.enemies;
      updatedCampaignState = threatResolution.campaignState;
      phaseLog.push(...threatResolution.logEntries);

      const enemyResolution = emitEngagedEnemyEvent({
        event: "turnBegins",
        investigator: updatedInvestigator,
        locations: updatedLocations,
        enemies: updatedEnemies,
        campaignState: updatedCampaignState,
      });

      updatedInvestigator = enemyResolution.investigator;
      updatedLocations = enemyResolution.locations;
      updatedEnemies = enemyResolution.enemies;
      updatedCampaignState = enemyResolution.campaignState;
      phaseLog.push(...enemyResolution.logEntries);

      const scenarioResolution = emitScenarioEvent({
        event: "turnBegins",
        investigator: updatedInvestigator,
        locations: updatedLocations,
        enemies: updatedEnemies,
        campaignState: updatedCampaignState,
        agenda,
        act,
      });

      updatedInvestigator = scenarioResolution.investigator;
      updatedLocations = scenarioResolution.locations;
      updatedEnemies = scenarioResolution.enemies;
      updatedCampaignState = scenarioResolution.campaignState;
      phaseLog.push(...scenarioResolution.logEntries);
    }

    set((state) => ({
      ...state,
      turn: nextTurn,
      investigator: updatedInvestigator,
      locations: updatedLocations,
      enemies: updatedEnemies,
      campaignState: updatedCampaignState,
      log: [...state.log, ...phaseLog],
    }));

    const updatedState = get();
    savePersistedCampaignSetup({
      selectedDeckId: updatedState.selectedDeckId,
      selectedScenarioId: updatedState.selectedScenarioId,
      campaignState: updatedState.campaignState,
    });
  },

  engageEnemiesAtLocation: () => {
    const { investigator, locations, enemies, campaignState, selectedEnemyTargetId } = get();
    const currentLocation = findCurrentLocation(locations, investigator.id);

    if (!currentLocation) {
      return;
    }

    let didEngage = false;

    const updatedEnemies = enemies.map((enemy) => {
      if (
        enemy.locationId === currentLocation.id &&
        enemy.engagedInvestigatorId === null &&
        !enemy.exhausted &&
        !enemyHasAloof(enemy)
      ) {
        didEngage = true;
        return {
          ...enemy,
          engagedInvestigatorId: investigator.id,
        };
      }

      return enemy;
    });

    if (!didEngage) {
      return;
    }

    let updatedInvestigator = investigator;
    let updatedLocations = locations;
    let finalEnemies = updatedEnemies;
    let updatedCampaignState = campaignState;
    const engagementLog: ReturnType<typeof createLogEntry>[] = [
      createLogEntry(
        "enemy",
        `Enemies at ${currentLocation.name} engaged ${investigator.name}.`,
      ),
    ];

    const forcedResolution = resolveEnemyEngagedTriggers({
      enemyCode: updatedEnemies[0].id,
      locationId: currentLocation.id,
      investigator: updatedInvestigator,
      locations: updatedLocations,
      enemies: finalEnemies,
      campaignState: updatedCampaignState,
    });

    updatedInvestigator = forcedResolution.investigator;
    updatedLocations = forcedResolution.locations;
    finalEnemies = forcedResolution.enemies;
    updatedCampaignState = forcedResolution.campaignState;
    const extraLog: ReturnType<typeof createLogEntry>[] = [];
    extraLog.push(...forcedResolution.logEntries);

    set((state) => ({
      investigator: updatedInvestigator,
      locations: updatedLocations,
      enemies: finalEnemies,
      campaignState: updatedCampaignState,
      selectedEnemyTargetId: getPreferredEnemyTargetId(
        finalEnemies,
        currentLocation.id,
        investigator.id,
        selectedEnemyTargetId,
      ),
      log: [...state.log, ...engagementLog],
    }));
  },

  enemyPhaseAttack: () => {
    const { investigator, enemies, log } = get();

    const engagedEnemies = enemies.filter(
      (enemy) =>
        enemy.engagedInvestigatorId === investigator.id && !enemy.exhausted,
    );

    if (engagedEnemies.length === 0) {
      get().pushLog("enemy", "Enemy phase: no ready engaged enemies attacked.");
      return;
    }

    const attackResolution = resolveEnemyAttacks({
      investigator,
      enemies,
    });

    set({
      investigator: attackResolution.investigator,
      enemies: attackResolution.enemies,
      log: [...log, ...attackResolution.logEntries]
    });
  },

  advancePhase: () => {
    const {
      turn,
      investigator,
      deck,
      hand,
      activeSkillTest,
      enemies,
      selectedEnemyTargetId,
      locations,
      log,
    } = get();

    if (activeSkillTest) {
      get().pushLog(
        "system",
        "Resolve or cancel the active skill test before advancing the phase.",
      );
      return;
    }

    if (turn.phase === "investigation") {
      const { locationAttachments, investigator, locations } = get();
      const currentLocation = findCurrentLocation(locations, investigator.id);

      let updatedInvestigator = investigator;
      const fireAttachments = locationAttachments.filter(
        (attachment) => attachment.name === "Fire!",
      );

      for (const attachment of fireAttachments) {
        if (currentLocation && attachment.attachedLocationId === currentLocation.id) {
          updatedInvestigator = {
            ...updatedInvestigator,
            damage: updatedInvestigator.damage + 1,
          };

          get().pushLog(
            "scenario",
            `Fire! at ${currentLocation.name} dealt 1 direct damage at the end of the Investigation phase.`,
          );
        }
      }

      set({
        investigator: updatedInvestigator,
      });

      get().enemyPhaseAttack();
      get().setPhase("enemy");
      return;
    }

    if (turn.phase === "enemy") {
      get().pushLog("system", "Enemy phase: Hunter enemies move.");
      get().moveHunterEnemies();

      get().pushLog("system", "Enemy phase: Enemies attack.");
      get().enemyPhaseAttack();
      get().setPhase("upkeep");
      return;
    }

    if (turn.phase === "upkeep") {
      const nextRound = turn.round + 1;
      const drawnCardName = deck.length > 0 ? deck[0].name : null;
      const updatedDeck = deck.length > 0 ? deck.slice(1) : deck;
      const updatedHand = deck.length > 0 ? [...hand, deck[0]] : hand;
      const updatedEnemies = readyEnemies(enemies);
      const readyCount = enemies.filter((enemy) => enemy.exhausted).length;

      const currentLocation = findCurrentLocation(locations, investigator.id);
      const preferredTargetId = currentLocation
        ? getPreferredEnemyTargetId(
          updatedEnemies,
          currentLocation.id,
          investigator.id,
          selectedEnemyTargetId,
        )
        : null;

      const upkeepLog: GameLogItem[] = [
        ...log,
        createLogEntry(
          "player",
          `${investigator.name} gains 1 resource during upkeep.`,
        ),
        drawnCardName
          ? createLogEntry(
            "player",
            `Drew card during upkeep: ${drawnCardName}`,
          )
          : createLogEntry(
            "system",
            "Tried to draw a card during upkeep, but the deck was empty.",
          ),
        ...(readyCount > 0
          ? [
            createLogEntry(
              "system",
              readyCount === 1
                ? "1 exhausted enemy readied during upkeep."
                : `${readyCount} exhausted enemies readied during upkeep.`,
            ),
          ]
          : []),
        createLogEntry("system", `Round ${nextRound} begins.`),
      ];

      set({
        investigator: {
          ...investigator,
          resources: investigator.resources + 1,
        },
        deck: updatedDeck,
        hand: updatedHand,
        enemies: updatedEnemies,
        selectedEnemyTargetId: preferredTargetId,
        turn: {
          ...turn,
          round: nextRound,
          actionsRemaining: 3,
        },
        log: upkeepLog,
      });

      get().engageEnemiesAtLocation();
      get().setPhase("mythos");
      return;
    }

    if (turn.phase === "mythos") {
      get().pushLog("system", "Mythos phase begins.");
      get().resolveMythosPhase();
      get().setPhase("investigation");
      get().pushLog("system", `${investigator.name} has 3 actions this turn.`);
      return;
    }
  },

  takeResourceAction: () => {
    const {
      investigator,
      enemies,
      turn,
      activeSkillTest,
      scenarioStatus,
    } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    if (activeSkillTest) {
      get().pushLog(
        "system",
        "Resolve or cancel the active skill test before taking another action.",
      );
      return;
    }

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      const message =
        turn.phase !== "investigation"
          ? "Cannot take a resource action outside the Investigation phase."
          : "Cannot take a resource action. No actions remaining.";

      get().pushLog("system", message);
      return;
    }

    let updatedInvestigator = investigator;
    const logEntries: ReturnType<typeof createLogEntry>[] = [];

    if (hasReadyEngagedEnemy({ investigator: updatedInvestigator, enemies })) {
      const aooResolution = resolveAttackOfOpportunity({
        investigator: updatedInvestigator,
        enemies,
        logPrefix: "taking a resource",
      });

      updatedInvestigator = aooResolution.investigator;
      logEntries.push(...aooResolution.logEntries);
    }

    updatedInvestigator = {
      ...updatedInvestigator,
      resources: updatedInvestigator.resources + 1,
    };

    logEntries.push(
      createLogEntry(
        "player",
        "Took a resource action. Gained 1 resource and spent 1 action.",
      ),
    );

    set((state) => ({
      investigator: updatedInvestigator,
      turn: {
        ...state.turn,
        actionsRemaining: state.turn.actionsRemaining - 1,
      },
      log: [...state.log, ...logEntries],
    }));
  },

  takeDrawAction: () => {
    const {
      investigator,
      enemies,
      deck,
      hand,
      turn,
      activeSkillTest,
      scenarioStatus,
    } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    if (activeSkillTest) {
      get().pushLog(
        "system",
        "Resolve or cancel the active skill test before taking another action.",
      );
      return;
    }

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      const message =
        turn.phase !== "investigation"
          ? "Cannot take a draw action outside the Investigation phase."
          : "Cannot take a draw action. No actions remaining.";

      get().pushLog("system", message);
      return;
    }

    let updatedInvestigator = investigator;
    const logEntries: ReturnType<typeof createLogEntry>[] = [];

    if (hasReadyEngagedEnemy({ investigator: updatedInvestigator, enemies })) {
      const aooResolution = resolveAttackOfOpportunity({
        investigator: updatedInvestigator,
        enemies,
        logPrefix: "drawing a card",
      });

      updatedInvestigator = aooResolution.investigator;
      logEntries.push(...aooResolution.logEntries);
    }

    if (deck.length === 0) {
      logEntries.push(
        createLogEntry(
          "system",
          "Took a draw action, but the deck was empty. 1 action spent.",
        ),
      );

      set((state) => ({
        investigator: updatedInvestigator,
        turn: {
          ...state.turn,
          actionsRemaining: state.turn.actionsRemaining - 1,
        },
        log: [...state.log, ...logEntries],
      }));
      return;
    }

    const [topCard, ...remainingDeck] = deck;

    logEntries.push(
      createLogEntry(
        "player",
        `Took a draw action. Drew ${topCard.name} and spent 1 action.`,
      ),
    );

    set((state) => ({
      investigator: updatedInvestigator,
      deck: remainingDeck,
      hand: [...hand, topCard],
      turn: {
        ...state.turn,
        actionsRemaining: state.turn.actionsRemaining - 1,
      },
      log: [...state.log, ...logEntries],
    }));
  },

  beginSkillTest: (skill, difficulty, source) => {
    const { activeSkillTest, scenarioStatus } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    if (activeSkillTest) {
      get().pushLog("system", "A skill test is already active.");
      return;
    }

    const nextTest: ActiveSkillTest = {
      skill,
      difficulty,
      source,
      committedCards: [],
    };

    set({
      activeSkillTest: nextTest,
      draggedCardId: null,
    });

    get().pushLog(
      "skill-test",
      `Started skill test: ${source}. Commit cards, then resolve.`,
    );
  },

  commitSkillCard: (cardCode) => {
    const { activeSkillTest, hand } = get();

    if (!activeSkillTest) {
      set({
        draggedCardId: null,
      });
      get().pushLog("system", "No active skill test to commit cards to.");
      return;
    }

    const card = hand.find((currentCard) => currentCard.instanceId === cardCode);

    if (!card) {
      set({
        draggedCardId: null,
      });
      get().pushLog(
        "system",
        "Could not commit that card because it was not in hand.",
      );
      return;
    }

    const matchingIcons = countMatchingIcons(card, activeSkillTest.skill);

    if (matchingIcons <= 0) {
      set({
        draggedCardId: null,
      });
      get().pushLog(
        "system",
        `${card.name} does not have a matching ${activeSkillTest.skill} icon and cannot be committed.`,
      );
      return;
    }

    const alreadyCommitted = activeSkillTest.committedCards.some(
      (entry) => entry.card.instanceId === card.instanceId,
    );

    if (alreadyCommitted) {
      set({
        draggedCardId: null,
      });
      get().pushLog(
        "system",
        `${card.name} is already committed to this test.`,
      );
      return;
    }

    const updatedHand = hand.filter((currentCard) => currentCard.instanceId !== cardCode);
    const committedCard: CommittedSkillCard = {
      card,
      matchingIcons,
    };

    set({
      hand: updatedHand,
      draggedCardId: null,
      activeSkillTest: {
        ...activeSkillTest,
        committedCards: [...activeSkillTest.committedCards, committedCard],
      },
    });

    get().pushLog(
      "skill-test",
      `Committed ${card.name} to ${activeSkillTest.source} for +${matchingIcons}.`,
    );
  },

  cancelActiveSkillTest: () => {
    const { activeSkillTest, hand } = get();

    if (!activeSkillTest) {
      return;
    }

    const returnedCards = activeSkillTest.committedCards.map(
      (entry) => entry.card,
    );

    set({
      hand: [...hand, ...returnedCards],
      activeSkillTest: null,
      pendingTestResolution: null,
      pendingEncounterResolution: null,
      pendingInvestigateDifficultyModifier: 0,
      pendingFightCombatModifier: 0,
      pendingFightDamageBonus: 0,
      draggedCardId: null,
    });

    get().pushLog(
      "skill-test",
      `Cancelled skill test: ${activeSkillTest.source}. Committed cards returned to hand.`,
    );
  },

  resolveActiveSkillTest: () => {
    const {
      activeSkillTest,
      investigator,
      playArea,
      discard,
      pendingTestResolution,
      pendingEncounterResolution,
      pendingFightCombatModifier,
      pendingFightDamageBonus,
      pendingInteractiveResolution,
      locations,
      locationAttachments,
      enemies,
      turn,
      selectedEnemyTargetId,
      log,
      campaignState,
      encounterDiscard,
      victoryDisplay,
      threatArea,
    } = get();

    if (!activeSkillTest) {
      get().pushLog("system", "No active skill test to resolve.");
      return null;
    }

    const token = get().drawChaosToken();

    if (token === null) {
      return null;
    }

    const baseValue = getInvestigatorSkillValue(
      investigator,
      activeSkillTest.skill,
    );
    const skillTestLocation = findCurrentLocation(locations, investigator.id);

    const locationDifficultyModifierDetails =
      getDifficultyModifiersFromLocationAttachments(locationAttachments, {
        skill: activeSkillTest.skill,
        testKind: pendingTestResolution?.kind ?? "none",
        locationId: skillTestLocation?.id ?? null,
      });

    const locationDifficultyModifier = locationDifficultyModifierDetails.reduce(
      (sum, modifier) => sum + modifier.amount,
      0,
    );
    const modifierDetails = getSkillModifiersFromPlayArea(playArea, {
      skill: activeSkillTest.skill,
      testKind: pendingTestResolution?.kind ?? "none",
    });
    const assetModifier = modifierDetails.reduce(
      (sum, modifier) => sum + modifier.amount,
      0,
    );
    const activatedAbilityModifier =
      pendingTestResolution?.kind === "fight" ? pendingFightCombatModifier : 0;
    const committedModifier = activeSkillTest.committedCards.reduce(
      (sum, entry) => sum + entry.matchingIcons,
      0,
    );
    const tokenModifier = getChaosTokenModifier(token);

    const finalValue =
      token === "autoFail"
        ? -999
        : baseValue +
        assetModifier +
        activatedAbilityModifier +
        committedModifier +
        tokenModifier;

    const modifiedDifficulty =
      activeSkillTest.difficulty + locationDifficultyModifier;

    const success =
      token !== "autoFail" && finalValue >= modifiedDifficulty;

    const failureAmount =
      success
        ? 0
        : token === "autoFail"
          ? modifiedDifficulty
          : Math.max(0, modifiedDifficulty - finalValue);

    const result: SkillTestResult = {
      skill: activeSkillTest.skill,
      baseValue,
      assetModifier: assetModifier + activatedAbilityModifier,
      committedModifier,
      modifierDetails,
      difficulty: modifiedDifficulty,
      token,
      tokenModifier,
      finalValue,
      success,
      source: activeSkillTest.source,
    };

    const committedCards = activeSkillTest.committedCards.map(
      (entry) => entry.card,
    );
    const committedText =
      activeSkillTest.committedCards.length > 0
        ? ` Committed cards: ${activeSkillTest.committedCards
          .map((entry) => `${entry.card.name} (+${entry.matchingIcons})`)
          .join(", ")}.`
        : "";

    const modifierText =
      modifierDetails.length > 0
        ? ` Asset modifiers: ${modifierDetails
          .map((modifier) => `${modifier.source} +${modifier.amount}`)
          .join(", ")}.`
        : "";

    const difficultyModifierText =
      locationDifficultyModifierDetails.length > 0
        ? ` Difficulty modifiers: ${locationDifficultyModifierDetails
          .map((modifier) => `${modifier.source} +${modifier.amount}`)
          .join(", ")}.`
        : "";

    const comparisonText =
      token === "autoFail"
        ? `${activeSkillTest.source}: AUTO-FAIL token drawn. Base ${baseValue}, asset bonus ${assetModifier}, committed bonus ${committedModifier}.${modifierText}${committedText} Test failed.${difficultyModifierText}`
        : `${activeSkillTest.source}: ${activeSkillTest.skill} ${baseValue} + asset bonus ${assetModifier} + committed bonus ${committedModifier} + token ${tokenModifier} vs ${modifiedDifficulty}, final ${finalValue} => ${success ? "success" : "failure"}.${difficultyModifierText}`

    let updatedLocations = locations;
    let updatedEnemies = enemies;
    const resolutionLog: GameState["log"] = [];
    let updatedInvestigator = investigator;
    let updatedCampaignState = campaignState;
    let updatedEncounterDiscard = encounterDiscard;
    let updatedVictoryDisplay = victoryDisplay;
    const updatedThreatArea = threatArea;

    let cardsToDrawOnSuccess = 0;
    let bonusCluesOnSuccess = 0;
    let bonusDamageOnSuccess = 0;

    if (success) {
      if (
        hasCommittedCardByName(activeSkillTest.committedCards, "Perception")
      ) {
        cardsToDrawOnSuccess += 1;
      }

      if (hasCommittedCardByName(activeSkillTest.committedCards, "Guts")) {
        cardsToDrawOnSuccess += 1;
      }

      if (
        hasCommittedCardByName(
          activeSkillTest.committedCards,
          "Manual Dexterity",
        )
      ) {
        cardsToDrawOnSuccess += 1;
      }

      if (
        pendingTestResolution?.kind === "investigate" &&
        hasCommittedCardByName(activeSkillTest.committedCards, "Deduction")
      ) {
        bonusCluesOnSuccess += 1;
      }

      if (
        pendingTestResolution?.kind === "fight" &&
        hasCommittedCardByName(activeSkillTest.committedCards, "Vicious Blow")
      ) {
        bonusDamageOnSuccess += 1;
      }

      if (pendingTestResolution?.kind === "fight") {
        bonusDamageOnSuccess += pendingFightDamageBonus;
      }
    }

    const { clearedVictoryLocations } = get();
    let updatedClearedVictoryLocations = clearedVictoryLocations;

    if (pendingTestResolution?.kind === "investigate") {
      const location = locations.find(
        (entry) => entry.id === pendingTestResolution.locationId,
      );

      if (!success) {
        resolutionLog.push(
          createLogEntry(
            "skill-test",
            `Investigation failed at ${location?.name ?? "that location"}. 1 action spent.`,
          ),
        );
      } else if (!location || location.clues <= 0) {
        resolutionLog.push(
          createLogEntry(
            "skill-test",
            `Investigation succeeded at ${location?.name ?? "that location"}, but there were no clues to discover. 1 action spent.`,
          ),
        );
      } else {
        const cluesAvailable = location.clues;
        const totalCluesDiscovered = Math.min(
          1 + bonusCluesOnSuccess,
          cluesAvailable,
        );

        updatedLocations = locations.map((entry) =>
          entry.id === pendingTestResolution.locationId
            ? { ...entry, clues: entry.clues - totalCluesDiscovered }
            : entry,
        );

        const horrorFromThreatArea =
          totalCluesDiscovered > 0 &&
            threatAreaHasCard(get().threatArea, "Unspeakable Truths")
            ? 1
            : 0;

        updatedInvestigator = {
          ...investigator,
          clues: investigator.clues + totalCluesDiscovered,
          horror: investigator.horror + horrorFromThreatArea,
        };

        resolutionLog.push(
          createLogEntry(
            "skill-test",
            `Investigation succeeded at ${location.name}. Discovered ${totalCluesDiscovered} clue${totalCluesDiscovered === 1 ? "" : "s"} and spent 1 action.`,
          ),
        );

        if (horrorFromThreatArea > 0) {
          resolutionLog.push(
            createLogEntry(
              "scenario",
              "Unspeakable Truths triggered after discovering clues. Took 1 horror.",
            ),
          );
        }

        if (totalCluesDiscovered > 0) {
          const updatedLocation = updatedLocations.find(
            (entry) => entry.id === pendingTestResolution.locationId,
          );

          if (updatedLocation) {
            const forcedResolution = emitLocationEvent({
              locationId: updatedLocation.id,
              event: "discoverClues",
              investigator: updatedInvestigator,
              locations: updatedLocations,
              enemies: updatedEnemies,
              campaignState: updatedCampaignState,
            });

            updatedInvestigator = forcedResolution.investigator;
            updatedLocations = forcedResolution.locations;
            updatedEnemies = forcedResolution.enemies;
            updatedCampaignState = forcedResolution.campaignState;

            resolutionLog.push(...forcedResolution.logEntries);
          }

          const victoryResolution = addLocationToVictoryDisplayIfCleared({
            locationId: pendingTestResolution.locationId,
            locations: updatedLocations,
            clearedVictoryLocations: updatedClearedVictoryLocations,
          });

          updatedClearedVictoryLocations = victoryResolution.clearedVictoryLocations;
          resolutionLog.push(...victoryResolution.logEntries);
        }
      }
    }

    if (pendingTestResolution?.kind === "fight") {
      const enemy = enemies.find(
        (entry) => entry.id === pendingTestResolution.enemyCode,
      );

      if (!success) {
        resolutionLog.push(
          createLogEntry(
            "combat",
            `Fight against ${enemy?.name ?? "that enemy"} failed. 1 action spent.`,
          ),
        );

        if (enemy && enemyHasRetaliate(enemy)) {
          updatedInvestigator = {
            ...updatedInvestigator,
            damage: updatedInvestigator.damage + enemy.damage,
            horror: updatedInvestigator.horror + enemy.horror,
          };

          resolutionLog.push(
            createLogEntry(
              "enemy",
              `${enemy.name} retaliated. Took ${enemy.damage} damage and ${enemy.horror} horror.`,
            ),
          );
        }
      } else if (!enemy) {
        resolutionLog.push(
          createLogEntry(
            "combat",
            "Fight succeeded, but the enemy was no longer present. 1 action spent.",
          ),
        );
      } else {
        const totalDamage = 1 + bonusDamageOnSuccess;

        const damagedEnemies = enemies.map((entry) =>
          entry.id === enemy.id
            ? { ...entry, damageOnEnemy: entry.damageOnEnemy + totalDamage }
            : entry,
        );

        const defeated = enemy.damageOnEnemy + totalDamage >= enemy.health;

        updatedEnemies = damagedEnemies;

        if (defeated) {
          const defeatResolution = resolveEnemyDefeatEffect({
            enemy,
            investigator: updatedInvestigator,
          });

          updatedInvestigator = defeatResolution.investigator;
          resolutionLog.push(...defeatResolution.logEntries);

          const enemyLocation = updatedLocations.find(
            (entry) => entry.id === enemy.locationId,
          );

          if (enemyLocation) {
            const forcedResolution = resolveEnemyDefeatedTriggers({
              enemyCode: enemy.id,
              locationId: enemyLocation.id,
              investigator: updatedInvestigator,
              locations: updatedLocations,
              enemies: updatedEnemies,
              campaignState: updatedCampaignState,
            });

            updatedInvestigator = forcedResolution.investigator;
            updatedLocations = forcedResolution.locations;
            updatedEnemies = forcedResolution.enemies;
            updatedCampaignState = forcedResolution.campaignState;
            resolutionLog.push(...forcedResolution.logEntries);
          }

          const enemyCard: EncounterCard = {
            id: enemy.id,
            code: enemy.code,
            name: enemy.name,
            type: "enemy",
            ability: enemy.ability,
            abilities: enemy.abilities,
            text: enemy.text,
            damage: enemy.damage,
            horror: enemy.horror,
            fight: enemy.fight,
            evade: enemy.evade,
            health: enemy.health,
            set: enemy.set,
            traits: enemy.traits,
            victoryPoints: enemy.victoryPoints,
            parley: enemy.parley,
          };

          if ((enemy.victoryPoints ?? 0) > 0) {
            updatedVictoryDisplay = [...updatedVictoryDisplay, enemyCard];
            resolutionLog.push(
              createLogEntry(
                "scenario",
                `${enemy.name} was added to the victory display worth ${enemy.victoryPoints} victory point${enemy.victoryPoints === 1 ? "" : "s"}.`,
              ),
            );
          } else {
            updatedEncounterDiscard = [...updatedEncounterDiscard, enemyCard];
          }

          updatedEnemies = updatedEnemies.filter((entry) => entry.id !== enemy.id);
        }

        resolutionLog.push(
          createLogEntry(
            "combat",
            defeated
              ? `Fight succeeded. ${enemy.name} was defeated. 1 action spent.`
              : `Fight succeeded. Dealt ${totalDamage} damage to ${enemy.name}. 1 action spent.`,
          ),
        );

        if (bonusDamageOnSuccess > 0) {
          resolutionLog.push(
            createLogEntry(
              "combat",
              `Vicious Blow added +${bonusDamageOnSuccess} damage on success.`,
            ),
          );
        }
      }

    }

    if (pendingTestResolution?.kind === "evade") {
      const enemy = enemies.find(
        (entry) => entry.id === pendingTestResolution.enemyCode,
      );

      if (!success) {
        resolutionLog.push(
          createLogEntry(
            "combat",
            `Evade against ${enemy?.name ?? "that enemy"} failed. 1 action spent.`,
          ),
        );
      } else if (!enemy) {
        resolutionLog.push(
          createLogEntry(
            "combat",
            "Evade succeeded, but the enemy was no longer present. 1 action spent.",
          ),
        );
      } else {
        updatedEnemies = enemies.map((entry) =>
          entry.id === enemy.id
            ? { ...entry, exhausted: true, engagedInvestigatorId: null }
            : entry,
        );

        resolutionLog.push(
          createLogEntry(
            "combat",
            `Evade succeeded. ${enemy.name} is exhausted and disengaged. 1 action spent.`,
          ),
        );
      }
    }

    if (pendingEncounterResolution) {
      const outcome = success
        ? pendingEncounterResolution.onPass
        : pendingEncounterResolution.onFail;

      const failureText =
        token === "autoFail"
          ? "auto-failed"
          : `failed by ${failureAmount}`;

      if (outcome?.kind === "damage") {
        updatedInvestigator = {
          ...updatedInvestigator,
          damage: updatedInvestigator.damage + outcome.amount,
        };

        resolutionLog.push(
          createLogEntry(
            "scenario",
            `${pendingEncounterResolution.cardName}: failed the test and took ${outcome.amount} damage.`,
          ),
        );
      } else if (outcome?.kind === "horror") {
        updatedInvestigator = {
          ...updatedInvestigator,
          horror: updatedInvestigator.horror + outcome.amount,
        };

        resolutionLog.push(
          createLogEntry(
            "scenario",
            `${pendingEncounterResolution.cardName}: failed the test and took ${outcome.amount} horror.`,
          ),
        );
      } else if (outcome?.kind === "damageByFailure") {
        updatedInvestigator = {
          ...updatedInvestigator,
          damage: updatedInvestigator.damage + failureAmount,
        };

        resolutionLog.push(
          createLogEntry(
            "scenario",
            `${pendingEncounterResolution.cardName}: ${failureText} and took ${failureAmount} damage.`,
          ),
        );
      } else if (outcome?.kind === "horrorByFailure") {
        updatedInvestigator = {
          ...updatedInvestigator,
          horror: updatedInvestigator.horror + failureAmount,
        };

        resolutionLog.push(
          createLogEntry(
            "scenario",
            `${pendingEncounterResolution.cardName}: ${failureText} and took ${failureAmount} horror.`,
          ),
        );
      } else {
        resolutionLog.push(
          createLogEntry(
            "scenario",
            success
              ? `${pendingEncounterResolution.cardName}: passed the test.`
              : `${pendingEncounterResolution.cardName}: failed the test.`,
          ),
        );
      }
    }

    if (pendingInteractiveResolution) {
      const interactiveEffect = success
        ? pendingInteractiveResolution.onSuccess
        : pendingInteractiveResolution.onFail;

      resolutionLog.push(
        createLogEntry(
          "scenario",
          success
            ? `${pendingInteractiveResolution.sourceName}: action succeeded.`
            : `${pendingInteractiveResolution.sourceName}: action failed.`,
        ),
      );

      if (interactiveEffect) {
        const interactiveResolution = resolveInteractiveEffect({
          sourceKind: pendingInteractiveResolution.sourceKind,
          effect: interactiveEffect,
          investigator: updatedInvestigator,
          currentLocationId: pendingInteractiveResolution.currentLocationId,
          locations: updatedLocations,
          enemies: updatedEnemies,
          campaignState: updatedCampaignState,
          threatArea: updatedThreatArea,
          encounterDiscard: updatedEncounterDiscard,
        });

        updatedInvestigator = interactiveResolution.investigator;
        updatedLocations = interactiveResolution.locations;
        updatedEnemies = interactiveResolution.enemies;
        updatedCampaignState = interactiveResolution.campaignState;

        resolutionLog.push(...interactiveResolution.logEntries);
      }
    }

    if (pendingInteractiveResolution) {
      const locationAbilityEffect = success
        ? pendingInteractiveResolution.onSuccess
        : pendingInteractiveResolution.onFail;

      resolutionLog.push(
        createLogEntry(
          "scenario",
          success
            ? `${pendingInteractiveResolution.sourceName}: action succeeded.`
            : `${pendingInteractiveResolution.sourceName}: action failed.`,
        ),
      );

      if (locationAbilityEffect) {
        const locationActionResolution = resolveLocationAbilityEffect({
          effect: locationAbilityEffect,
          investigator: updatedInvestigator,
          currentLocationId: pendingInteractiveResolution.currentLocationId,
          locations: updatedLocations,
          enemies: updatedEnemies,
          campaignState: updatedCampaignState,
          threatArea: updatedThreatArea,
          encounterDiscard: updatedEncounterDiscard,
          locationAttachments: [],
        });

        updatedInvestigator = locationActionResolution.investigator;
        updatedLocations = locationActionResolution.locations;
        updatedEnemies = locationActionResolution.enemies;
        updatedCampaignState = locationActionResolution.campaignState;

        resolutionLog.push(...locationActionResolution.logEntries);
      }
    }

    let updatedDeck = get().deck;
    let updatedHand = get().hand;

    for (let i = 0; i < cardsToDrawOnSuccess; i += 1) {
      if (updatedDeck.length === 0) {
        resolutionLog.push(
          createLogEntry(
            "system",
            "Tried to draw a card from a successful skill effect, but the deck was empty.",
          ),
        );
        break;
      }

      const [drawnCard, ...remainingDeck] = updatedDeck;
      updatedDeck = remainingDeck;
      updatedHand = [...updatedHand, drawnCard];
      resolutionLog.push(
        createLogEntry(
          "player",
          `Drew card from successful skill effect: ${drawnCard.name}`,
        ),
      );
    }

    const currentLocation = findCurrentLocation(
      updatedLocations,
      investigator.id,
    );
    const preferredTargetId = currentLocation
      ? getPreferredEnemyTargetId(
        updatedEnemies,
        currentLocation.id,
        investigator.id,
        selectedEnemyTargetId,
      )
      : null;

    set({
      clearedVictoryLocations: updatedClearedVictoryLocations,
      investigator: updatedInvestigator,
      locations: updatedLocations,
      enemies: updatedEnemies,
      campaignState: updatedCampaignState,
      deck: updatedDeck,
      encounterDiscard: updatedEncounterDiscard,
      victoryDisplay: updatedVictoryDisplay,
      hand: updatedHand,
      discard: [...discard, ...committedCards],
      lastSkillTest: result,
      activeSkillTest: null,
      pendingTestResolution: null,
      pendingEncounterResolution: null,
      pendingInteractiveResolution: null,
      pendingInvestigateDifficultyModifier: 0,
      pendingFightCombatModifier: 0,
      pendingFightDamageBonus: 0,
      selectedEnemyTargetId: preferredTargetId,
      draggedCardId: null,
      turn: {
        ...turn,
        actionsRemaining: turn.actionsRemaining - 1,
      },
      log: [
        ...log,
        createLogEntry(
          token === "autoFail"
            ? "skill-test"
            : success
              ? "skill-test"
              : "combat",
          comparisonText,
        ),
        ...resolutionLog,
      ],
    });

    const updatedState = get();
    savePersistedCampaignSetup({
      selectedDeckId: updatedState.selectedDeckId,
      selectedScenarioId: updatedState.selectedScenarioId,
      campaignState: updatedState.campaignState,
    });

    return result;
  },

  investigateAction: () => {
    const {
      investigator,
      enemies,
      locations,
      turn,
      activeSkillTest,
      scenarioStatus,
    } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    if (activeSkillTest) {
      get().pushLog(
        "system",
        "Resolve or cancel the active skill test before starting another one.",
      );
      return;
    }

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      const message =
        turn.phase !== "investigation"
          ? "Cannot investigate outside the Investigation phase."
          : "Cannot investigate. No actions remaining.";

      get().pushLog("system", message);
      return;
    }

    const currentLocation = findCurrentLocation(locations, investigator.id);

    if (!currentLocation) {
      get().pushLog(
        "system",
        "Cannot investigate because the investigator is not at a location.",
      );
      return;
    }

    let updatedInvestigator = investigator;
    const logEntries: ReturnType<typeof createLogEntry>[] = [];

    if (hasReadyEngagedEnemy({ investigator: updatedInvestigator, enemies })) {
      const aooResolution = resolveAttackOfOpportunity({
        investigator: updatedInvestigator,
        enemies,
        logPrefix: "investigating",
      });

      updatedInvestigator = aooResolution.investigator;
      logEntries.push(...aooResolution.logEntries);
    }

    const modifiedDifficulty = Math.max(
      0,
      currentLocation.shroud - get().pendingInvestigateDifficultyModifier,
    );

    if (logEntries.length > 0) {
      set((state) => ({
        investigator: updatedInvestigator,
        log: [...state.log, ...logEntries],
      }));
    } else {
      set({
        investigator: updatedInvestigator,
      });
    }

    get().beginSkillTest(
      "intellect",
      modifiedDifficulty,
      `Investigate at ${currentLocation.name}`,
    );

    set({
      pendingTestResolution: {
        kind: "investigate",
        locationId: currentLocation.id,
      },
    });
  },

  fightAction: () => {
    const {
      investigator,
      locations,
      enemies,
      turn,
      activeSkillTest,
      selectedEnemyTargetId,
      scenarioStatus,
    } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    if (activeSkillTest) {
      get().pushLog(
        "system",
        "Resolve or cancel the active skill test before starting another one.",
      );
      return;
    }

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      const message =
        turn.phase !== "investigation"
          ? "Cannot fight outside the Investigation phase."
          : "Cannot fight. No actions remaining.";

      get().pushLog("system", message);
      return;
    }

    const currentLocation = findCurrentLocation(locations, investigator.id);

    if (!currentLocation) {
      get().pushLog(
        "system",
        "Cannot fight because the investigator is not at a location.",
      );
      return;
    }

    const enemy = getEnemyAtInvestigator(
      enemies,
      currentLocation.id,
      investigator.id,
      selectedEnemyTargetId,
    );

    if (!enemy) {
      set({
        turn: {
          ...turn,
          actionsRemaining: turn.actionsRemaining - 1,
        },
      });
      get().pushLog(
        "system",
        "Took a fight action, but there was no enemy at your location. 1 action spent.",
      );
      return;
    }

    get().pushLog("combat", `Fight action targeting ${enemy.name}.`);
    get().beginSkillTest("combat", enemy.fight, `Fight ${enemy.name}`);
    set({
      pendingTestResolution: { kind: "fight", enemyCode: enemy.id },
    });
  },

  evadeAction: () => {
    const {
      investigator,
      locations,
      enemies,
      turn,
      activeSkillTest,
      selectedEnemyTargetId,
      scenarioStatus,
    } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    if (activeSkillTest) {
      get().pushLog(
        "system",
        "Resolve or cancel the active skill test before starting another one.",
      );
      return;
    }

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      const message =
        turn.phase !== "investigation"
          ? "Cannot evade outside the Investigation phase."
          : "Cannot evade. No actions remaining.";

      get().pushLog("system", message);
      return;
    }

    const currentLocation = findCurrentLocation(locations, investigator.id);

    if (!currentLocation) {
      get().pushLog(
        "system",
        "Cannot evade because the investigator is not at a location.",
      );
      return;
    }

    const enemy = getEnemyAtInvestigator(
      enemies,
      currentLocation.id,
      investigator.id,
      selectedEnemyTargetId,
    );

    if (!enemy) {
      set({
        turn: {
          ...turn,
          actionsRemaining: turn.actionsRemaining - 1,
        },
      });
      get().pushLog(
        "system",
        "Took an evade action, but there was no enemy at your location. 1 action spent.",
      );
      return;
    }

    get().pushLog("combat", `Evade action targeting ${enemy.name}.`);
    get().beginSkillTest("agility", enemy.evade, `Evade ${enemy.name}`);
    set({
      pendingTestResolution: { kind: "evade", enemyCode: enemy.id },
    });
  },
  attachSetAsideCardToLocation: (cardCode: string, locationId: string) => {
    const {
      setAsideEncounterCards,
      locationAttachments,
      scenarioStatus,
    } = get();

    if (isScenarioResolved(scenarioStatus)) {
      get().pushLog("system", getScenarioResolvedMessage(scenarioStatus));
      return;
    }

    const {
      card,
      remainingSetAsideEncounterCards,
    } = takeSetAsideEncounterCardByCode({
      setAsideEncounterCards,
      cardCode,
    });

    if (!card) {
      get().pushLog(
        "system",
        `Could not find set-aside encounter card ${cardCode}.`,
      );
      return;
    }

    if (card.type === "enemy") {
      get().pushLog(
        "system",
        `${card.name} is an enemy and cannot be attached as a location attachment.`,
      );
      return;
    }

    const updatedLocationAttachments = attachEncounterCardToLocation({
      cardCode,
      locationId,
      locationAttachments,
    });

    if (updatedLocationAttachments.length === locationAttachments.length) {
      get().pushLog(
        "system",
        `Could not attach ${card.name} to ${locationId}.`,
      );
      return;
    }

    const addedAttachment =
      updatedLocationAttachments[updatedLocationAttachments.length - 1];

    set((state) => ({
      ...state,
      locationAttachments: updatedLocationAttachments,
      setAsideEncounterCards: remainingSetAsideEncounterCards,
      log: [
        ...state.log,
        createLogEntry(
          "scenario",
          `${addedAttachment.name} was attached to ${locationId} from the set-aside cards.`,
        ),
      ],
    }));
  },
}));
