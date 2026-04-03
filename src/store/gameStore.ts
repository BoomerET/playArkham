import { create } from "zustand";
import { investigators } from "../data/investigators";
import { playerDeck } from "../data/playerDeck";
import { defaultScenarioId, scenarios } from "../data/scenarios";
import type {
  ScenarioCardDefinition,
  ScenarioDefinition,
} from "../data/scenarios/scenarioTypes";
import { buildScenarioEnemies } from "../lib/buildScenarioEnemies";
import { getChaosTokenModifier } from "../lib/chaosToken";
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
  applyScenarioActAdvanceEffects,
  applyScenarioAgendaAdvanceEffects,
  type ScenarioEffectState,
} from "../lib/scenarioEffects";
import {
  buildScenarioCardState,
  getInitialActState,
  getInitialAgendaState,
} from "../lib/scenarioCards";
import { shuffle } from "../lib/shuffle";
import {
  countMatchingIcons,
  hasCommittedCardByName,
} from "../lib/skillTestHelpers";
import { getSkillModifiersFromPlayArea } from "../lib/skillModifiers";
import type {
  ActiveSkillTest,
  CardCounterType,
  ChaosToken,
  CommittedSkillCard,
  GameLogKind,
  GameState,
  Investigator,
  Phase,
  PlayerCard,
  ScenarioStatus,
  SkillTestResult,
  SkillType,
} from "../types/game";

import {
  canPlayInAvailableSlots,
  getBlockedSlot,
  getReplacementCandidates,
} from "../features/playerCards/slots";

import { loadArkhamDeck } from "../lib/loadArkhamDeck";

type Screen = "home" | "game";

type PendingTestResolution =
  | { kind: "investigate"; locationId: string }
  | { kind: "fight"; enemyId: string }
  | { kind: "evade"; enemyId: string }
  | null;

type PendingAssetPlay = {
  cardId: string;
  replacedSlot: string;
  replacementChoices: PlayerCard[];
} | null;

type GameStore = GameState & {
  screen: Screen;
  availableInvestigators: Investigator[];
  availableScenarios: ScenarioDefinition[];
  selectedInvestigatorId: string;
  selectedScenarioId: string;
  selectedEnemyTargetId: string | null;
  pendingTestResolution: PendingTestResolution;
  pendingAssetPlay: PendingAssetPlay;
  showDeckInspector: boolean;
  confirmAssetReplacement: (replacedCardId: string) => void;
  cancelPendingAssetPlay: () => void;
  setSelectedInvestigator: (investigatorId: string) => void;
  setSelectedScenario: (scenarioId: string) => void;
  setSelectedEnemyTarget: (enemyId: string | null) => void;
  setLocationVisible: (locationId: string, visible?: boolean) => void;
  revealLocation: (locationId: string) => void;
  setAgendaProgress: (progress: number) => void;
  setActProgress: (progress: number) => void;
  advanceAgenda: () => void;
  advanceAct: () => void;
  pushLog: (kind: GameLogKind, text: string) => void;
  setDraggedCardId: (cardId: string | null) => void;
  startGame: () => void;
  returnToHome: () => void;
  setupGame: () => void;
  drawCard: () => void;
  drawStartingHand: (count?: number) => void;
  shuffleDeck: () => void;
  discardCard: (cardId: string) => void;
  playCard: (cardId: string) => void;
  canPlayCardInSlots: (cardId: string) => boolean;
  togglePlayAreaCardExhausted: (cardId: string) => void;
  drawChaosToken: () => ChaosToken | null;
  gainResource: (amount?: number) => void;
  spendResource: (amount?: number) => void;
  gainClue: (amount?: number) => void;
  takeDamage: (amount?: number) => void;
  takeHorror: (amount?: number) => void;
  moveInvestigator: (locationId: string) => void;
  advancePhase: () => void;
  setPhase: (phase: Phase) => void;
  takeResourceAction: () => void;
  takeDrawAction: () => void;
  investigateAction: () => void;
  fightAction: () => void;
  evadeAction: () => void;
  engageEnemiesAtLocation: () => void;
  readyAllEnemies: () => void;
  enemyPhaseAttack: () => void;
  beginSkillTest: (
    skill: SkillType,
    difficulty: number,
    source: string,
  ) => void;
  commitSkillCard: (cardId: string) => void;
  cancelActiveSkillTest: () => void;
  resolveActiveSkillTest: () => SkillTestResult | null;
  incrementPlayAreaCardCounter: (
    cardId: string,
    counterType: CardCounterType,
  ) => void;
  decrementPlayAreaCardCounter: (
    cardId: string,
    counterType: CardCounterType,
  ) => void;
};

const startingChaosBag: ChaosToken[] = [
  +1,
  0,
  0,
  -1,
  -1,
  -2,
  "skull",
  "cultist",
  "autoFail",
  "elderSign",
];

function getSelectedScenario(state: {
  availableScenarios: ScenarioDefinition[];
  selectedScenarioId: string;
}): ScenarioDefinition {
  return (
    state.availableScenarios.find(
      (scenario) => scenario.id === state.selectedScenarioId,
    ) ?? state.availableScenarios[0]
  );
}

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function normalizeCardCounters(
  counters: Partial<Record<CardCounterType, number>> | undefined,
) {
  const normalized: Partial<Record<CardCounterType, number>> = {};

  if (!counters) {
    return normalized;
  }

  for (const [key, value] of Object.entries(counters)) {
    const typedKey = key as CardCounterType;
    const typedValue = typeof value === "number" ? value : 0;

    if (typedValue > 0) {
      normalized[typedKey] = typedValue;
    }
  }

  return normalized;
}

//function isOpeningHandWeakness(card: PlayerCard): boolean {
//  return card.type === "treachery" || card.type === "enemy";
//}

function isOpeningHandWeakness(card: PlayerCard): boolean {
  return card.isWeakness === true;
}

function createLogEntry(kind: GameLogKind, text: string) {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    text,
    createdAt: Date.now(),
  } as const;
}

type AdvanceStoreSlice = Pick<
  GameStore,
  | "agenda"
  | "act"
  | "locations"
  | "enemies"
  | "log"
  | "selectedEnemyTargetId"
  | "scenarioStatus"
  | "scenarioResolutionText"
  | "scenarioResolutionTitle"
  | "scenarioResolutionSubtitle"
>;

type AdvanceState = ScenarioEffectState & {
  scenarioStatus: ScenarioStatus;
  scenarioResolutionText: string | null;
  scenarioResolutionTitle: string | null;
  scenarioResolutionSubtitle: string | null;
};

function applyAdvanceOutcome(
  card: ScenarioCardDefinition,
  result: AdvanceStoreSlice,
): AdvanceStoreSlice {
  const effects = card.onAdvance;

  if (!effects) {
    return result;
  }

  let scenarioStatus = result.scenarioStatus;
  let scenarioResolutionText = result.scenarioResolutionText;
  let scenarioResolutionTitle = result.scenarioResolutionTitle;
  let scenarioResolutionSubtitle = result.scenarioResolutionSubtitle;

  if (effects.resolutionTitle) {
    scenarioResolutionTitle = effects.resolutionTitle;
  }

  if (effects.resolutionSubtitle) {
    scenarioResolutionSubtitle = effects.resolutionSubtitle;
  }

  let log = result.log;

  if (effects.winScenario) {
    scenarioStatus = "won";
  } else if (effects.loseScenario) {
    scenarioStatus = "lost";
  }

  if (effects.resolutionText) {
    scenarioResolutionText = effects.resolutionText;
    log = [...log, createLogEntry("scenario", effects.resolutionText)];
  }

  return {
    ...result,
    scenarioStatus,
    scenarioResolutionText,
    scenarioResolutionTitle,
    scenarioResolutionSubtitle,
    log,
  };
}

function isScenarioResolved(status: ScenarioStatus): boolean {
  return status !== "inProgress";
}

function getScenarioResolvedMessage(status: ScenarioStatus): string {
  return status === "won"
    ? "The scenario is already complete. Return to home to start again."
    : "The scenario is over. Return to home to try again.";
}

function advanceAgendaState(
  scenario: ScenarioDefinition,
  state: AdvanceState,
  allowChain = true,
): AdvanceStoreSlice {
  const currentAgenda = state.agenda;

  if (!currentAgenda) {
    return {
      agenda: null,
      act: state.act,
      locations: state.locations,
      enemies: state.enemies,
      log: state.log,
      selectedEnemyTargetId: state.selectedEnemyTargetId,
      scenarioStatus: state.scenarioStatus,
      scenarioResolutionText: state.scenarioResolutionText,
      scenarioResolutionTitle: state.scenarioResolutionTitle,
      scenarioResolutionSubtitle: state.scenarioResolutionSubtitle,
    };
  }

  const agendas = scenario.agendas ?? [];
  const currentIndex = agendas.findIndex(
    (entry) => entry.id === currentAgenda.id,
  );

  if (currentIndex === -1) {
    return {
      agenda: {
        ...currentAgenda,
        progress: currentAgenda.threshold,
      },
      act: state.act,
      locations: state.locations,
      enemies: state.enemies,
      log: [
        ...state.log,
        createLogEntry(
          "scenario",
          `Agenda ${currentAgenda.sequence} is ready to advance.`,
        ),
      ],
      selectedEnemyTargetId: state.selectedEnemyTargetId,
      scenarioStatus: state.scenarioStatus,
      scenarioResolutionText: state.scenarioResolutionText,
      scenarioResolutionTitle: state.scenarioResolutionTitle,
      scenarioResolutionSubtitle: state.scenarioResolutionSubtitle,
    };
  }

  const nextDefinition = agendas[currentIndex + 1];

  if (!nextDefinition) {
    return {
      agenda: {
        ...currentAgenda,
        progress: currentAgenda.threshold,
      },
      act: state.act,
      locations: state.locations,
      enemies: state.enemies,
      log: [
        ...state.log,
        createLogEntry(
          "scenario",
          `Agenda ${currentAgenda.sequence} has no further side to advance to.`,
        ),
      ],
      selectedEnemyTargetId: state.selectedEnemyTargetId,
      scenarioStatus: state.scenarioStatus,
      scenarioResolutionText: state.scenarioResolutionText,
      scenarioResolutionTitle: state.scenarioResolutionTitle,
      scenarioResolutionSubtitle: state.scenarioResolutionSubtitle,
    };
  }

  const nextAgenda = buildScenarioCardState(nextDefinition);

  const effectResult = applyScenarioAgendaAdvanceEffects(
    scenario,
    nextDefinition.id,
    {
      ...state,
      agenda: nextAgenda,
      log: [
        ...state.log,
        createLogEntry(
          "scenario",
          `Agenda advanced from ${currentAgenda.sequence} to ${nextDefinition.sequence}: ${nextDefinition.title}.`,
        ),
      ],
    },
  );

  let result: AdvanceStoreSlice = {
    agenda: effectResult.agenda,
    act: effectResult.act,
    locations: effectResult.locations,
    enemies: effectResult.enemies,
    log: effectResult.log,
    selectedEnemyTargetId: effectResult.selectedEnemyTargetId,
    scenarioStatus: state.scenarioStatus,
    scenarioResolutionText: state.scenarioResolutionText,
    scenarioResolutionTitle: state.scenarioResolutionTitle,
    scenarioResolutionSubtitle: state.scenarioResolutionSubtitle,
  };

  result = applyAdvanceOutcome(nextDefinition, result);

  if (allowChain && effectResult.advanceActRequested) {
    result = advanceActState(
      scenario,
      {
        ...effectResult,
        agenda: result.agenda,
        act: result.act,
        locations: result.locations,
        enemies: result.enemies,
        log: result.log,
        selectedEnemyTargetId: result.selectedEnemyTargetId,
        scenarioStatus: result.scenarioStatus,
        scenarioResolutionText: result.scenarioResolutionText,
        scenarioResolutionTitle: result.scenarioResolutionTitle,
        scenarioResolutionSubtitle: result.scenarioResolutionSubtitle,
      },
      false,
    );
  }

  return result;
}

function advanceActState(
  scenario: ScenarioDefinition,
  state: AdvanceState,
  allowChain = true,
): AdvanceStoreSlice {
  const currentAct = state.act;

  if (!currentAct) {
    return {
      agenda: state.agenda,
      act: null,
      locations: state.locations,
      enemies: state.enemies,
      log: state.log,
      selectedEnemyTargetId: state.selectedEnemyTargetId,
      scenarioStatus: state.scenarioStatus,
      scenarioResolutionText: state.scenarioResolutionText,
      scenarioResolutionTitle: state.scenarioResolutionTitle,
      scenarioResolutionSubtitle: state.scenarioResolutionSubtitle,
    };
  }

  const acts = scenario.acts ?? [];
  const currentIndex = acts.findIndex((entry) => entry.id === currentAct.id);

  if (currentIndex === -1) {
    return {
      agenda: state.agenda,
      act: {
        ...currentAct,
        progress: currentAct.threshold,
      },
      locations: state.locations,
      enemies: state.enemies,
      log: [
        ...state.log,
        createLogEntry(
          "scenario",
          `Act ${currentAct.sequence} is ready to advance.`,
        ),
      ],
      selectedEnemyTargetId: state.selectedEnemyTargetId,
      scenarioStatus: state.scenarioStatus,
      scenarioResolutionText: state.scenarioResolutionText,
      scenarioResolutionTitle: state.scenarioResolutionTitle,
      scenarioResolutionSubtitle: state.scenarioResolutionSubtitle,
    };
  }

  const nextDefinition = acts[currentIndex + 1];

  if (!nextDefinition) {
    return {
      agenda: state.agenda,
      act: {
        ...currentAct,
        progress: currentAct.threshold,
      },
      locations: state.locations,
      enemies: state.enemies,
      log: [
        ...state.log,
        createLogEntry(
          "scenario",
          `Act ${currentAct.sequence} has no further side to advance to.`,
        ),
      ],
      selectedEnemyTargetId: state.selectedEnemyTargetId,
      scenarioStatus: state.scenarioStatus,
      scenarioResolutionText: state.scenarioResolutionText,
      scenarioResolutionTitle: state.scenarioResolutionTitle,
      scenarioResolutionSubtitle: state.scenarioResolutionSubtitle,
    };
  }

  const nextAct = buildScenarioCardState(nextDefinition);

  const effectResult = applyScenarioActAdvanceEffects(
    scenario,
    nextDefinition.id,
    {
      ...state,
      act: nextAct,
      log: [
        ...state.log,
        createLogEntry(
          "scenario",
          `Act advanced from ${currentAct.sequence} to ${nextDefinition.sequence}: ${nextDefinition.title}.`,
        ),
      ],
    },
  );

  let result: AdvanceStoreSlice = {
    agenda: effectResult.agenda,
    act: effectResult.act,
    locations: effectResult.locations,
    enemies: effectResult.enemies,
    log: effectResult.log,
    selectedEnemyTargetId: effectResult.selectedEnemyTargetId,
    scenarioStatus: state.scenarioStatus,
    scenarioResolutionText: state.scenarioResolutionText,
    scenarioResolutionTitle: state.scenarioResolutionTitle,
    scenarioResolutionSubtitle: state.scenarioResolutionSubtitle,
  };

  result = applyAdvanceOutcome(nextDefinition, result);

  if (allowChain && effectResult.advanceAgendaRequested) {
    result = advanceAgendaState(
      scenario,
      {
        ...effectResult,
        agenda: result.agenda,
        act: result.act,
        locations: result.locations,
        enemies: result.enemies,
        log: result.log,
        selectedEnemyTargetId: result.selectedEnemyTargetId,
        scenarioStatus: result.scenarioStatus,
        scenarioResolutionText: result.scenarioResolutionText,
        scenarioResolutionTitle: result.scenarioResolutionTitle,
        scenarioResolutionSubtitle: result.scenarioResolutionSubtitle,
      },
      false,
    );
  }

  return result;
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: "home",
  availableInvestigators: investigators,
  availableScenarios: scenarios,
  selectedInvestigatorId: investigators[0].id,
  selectedScenarioId: defaultScenarioId,
  selectedEnemyTargetId: null,
  draggedCardId: null,
  pendingTestResolution: null,
  pendingAssetPlay: null,

  investigator: createGameInvestigator(investigators[0]),
  deck: [],
  hand: [],
  discard: [],
  playArea: [],
  chaosBag: [...startingChaosBag],
  locations: cloneScenarioLocations(
    getSelectedScenario({
      availableScenarios: scenarios,
      selectedScenarioId: defaultScenarioId,
    }).locations,
  ),
  enemies: buildScenarioEnemies(
    getSelectedScenario({
      availableScenarios: scenarios,
      selectedScenarioId: defaultScenarioId,
    }).enemySpawns,
  ),
  agenda: getInitialAgendaState(
    getSelectedScenario({
      availableScenarios: scenarios,
      selectedScenarioId: defaultScenarioId,
    }),
  ),
  act: getInitialActState(
    getSelectedScenario({
      availableScenarios: scenarios,
      selectedScenarioId: defaultScenarioId,
    }),
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
    phase: "setup",
    actionsRemaining: 3,
  },

  pushLog: (kind, text) => {
    set((state) => ({
      log: [...state.log, createLogEntry(kind, text)],
    }));
  },

  setSelectedInvestigator: (investigatorId) => {
    set({ selectedInvestigatorId: investigatorId });
  },

  setSelectedScenario: (scenarioId) => {
    set({ selectedScenarioId: scenarioId });
  },

  setSelectedEnemyTarget: (enemyId) => {
    const { investigator, locations, enemies, selectedEnemyTargetId } = get();
    const currentLocation = findCurrentLocation(locations, investigator.id);

    if (!currentLocation) {
      set({ selectedEnemyTargetId: null });
      return;
    }

    if (enemyId === null) {
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
        enemy.id === enemyId &&
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

  setAgendaProgress: (progress) => {
    const { agenda } = get();

    if (!agenda) {
      return;
    }

    const nextProgress = Math.max(0, progress);

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
  },

  setActProgress: (progress) => {
    const { act } = get();

    if (!act) {
      return;
    }

    const nextProgress = Math.max(0, progress);

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
  },

  advanceAgenda: () => {
    const {
      agenda,
      act,
      log,
      locations,
      enemies,
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
      },
      true,
    );

    set(result);
  },

  advanceAct: () => {
    const {
      agenda,
      act,
      log,
      locations,
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
        enemies,
        log,
        investigatorId: investigator.id,
        currentLocationId: currentLocation?.id ?? null,
        selectedEnemyTargetId,
        scenarioStatus: get().scenarioStatus,
        scenarioResolutionText: get().scenarioResolutionText,
        scenarioResolutionTitle: get().scenarioResolutionTitle,
        scenarioResolutionSubtitle: get().scenarioResolutionSubtitle,
      },
      true,
    );

    set(result);
  },

  setDraggedCardId: (cardId) => {
    set({ draggedCardId: cardId });
  },

  toggleDeckInspector: () => {
    set((state) => ({
      showDeckInspector: !state.showDeckInspector,
    }));
  },

  closeDeckInspector: () => {
    set({ showDeckInspector: false });
  },

  //startGame: () => {
  //  get().setupGame();
  //  set({ screen: "game" });
  //},
  startGame: async () => {
    await get().setupGame();
    set({ screen: "game" });
  },

  returnToHome: () => {
    const selectedScenario = getSelectedScenario(get());

    set({
      screen: "home",
      deck: [],
      hand: [],
      discard: [],
      playArea: [],
      chaosBag: selectedScenario.chaosBag
        ? [...selectedScenario.chaosBag]
        : [...startingChaosBag],
      locations: cloneScenarioLocations(selectedScenario.locations),
      enemies: buildScenarioEnemies(selectedScenario.enemySpawns),
      agenda: getInitialAgendaState(selectedScenario),
      act: getInitialActState(selectedScenario),
      scenarioStatus: "inProgress",
      scenarioResolutionText: null,
      scenarioResolutionTitle: null,
      scenarioResolutionSubtitle: null,
      pendingAssetPlay: null,
      showDeckInspector: false,
      log: [],
      lastSkillTest: null,
      activeSkillTest: null,
      pendingTestResolution: null,
      selectedEnemyTargetId: null,
      draggedCardId: null,
      turn: {
        round: 1,
        phase: "setup",
        actionsRemaining: 3,
      },
    });
  },

  //setupGame: () => {
  setupGame: async () => {
    const selected = get().availableInvestigators.find(
      (investigator) => investigator.id === get().selectedInvestigatorId,
    );

    const selectedScenario = getSelectedScenario(get());

    const chosenInvestigator = selected
      ? createGameInvestigator(selected)
      : createGameInvestigator(get().availableInvestigators[0]);

    //const shuffledDeck = shuffle(playerDeck);
    let deckCards: PlayerCard[] = [];

    try {
      deckCards = await loadArkhamDeck(5841936);
    } catch (error) {
      console.error(error);
      get().pushLog(
        "system",
        "Failed to load ArkhamDB deck. Using default deck.",
      );
      deckCards = playerDeck;
    }

    const shuffledDeck = shuffle(deckCards);

    set({
      investigator: chosenInvestigator,
      deck: shuffledDeck,
      hand: [],
      discard: [],
      playArea: [],
      chaosBag: selectedScenario.chaosBag
        ? [...selectedScenario.chaosBag]
        : [...startingChaosBag],
      locations: normalizeScenarioLocations(
        selectedScenario.locations,
        chosenInvestigator.id,
        selectedScenario.startingLocationId,
      ),
      enemies: buildScenarioEnemies(selectedScenario.enemySpawns),
      agenda: getInitialAgendaState(selectedScenario),
      act: getInitialActState(selectedScenario),
      scenarioStatus: "inProgress",
      scenarioResolutionText: null,
      scenarioResolutionTitle: null,
      scenarioResolutionSubtitle: null,
      pendingAssetPlay: null,
      showDeckInspector: false,
      log: [
        createLogEntry(
          "system",
          `Selected investigator: ${chosenInvestigator.name}`,
        ),
        createLogEntry(
          "scenario",
          `Selected scenario: ${selectedScenario.name}`,
        ),
        createLogEntry("system", "Game setup complete."),
        createLogEntry("system", "Round 1 begins."),
        createLogEntry("system", "First round: Mythos phase is skipped."),
        createLogEntry("system", "Phase: Investigation"),
      ],
      lastSkillTest: null,
      activeSkillTest: null,
      pendingTestResolution: null,
      selectedEnemyTargetId: null,
      draggedCardId: null,
      turn: {
        round: 1,
        phase: "investigation",
        actionsRemaining: 3,
      },
    });

    get().drawStartingHand(5);
    get().engageEnemiesAtLocation();
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
        `Shuffled ${skippedWeaknesses.length} weakness${
          skippedWeaknesses.length === 1 ? "" : "es"
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
        `Opening hand drew ${cardsDrawn} card${
          cardsDrawn === 1 ? "" : "s"
        } because the deck ran out of non-weakness cards.`,
      );
    }
  },

  discardCard: (cardId: string) => {
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

    const card = hand.find((c) => c.id === cardId);

    if (!card) {
      return;
    }

    set({
      hand: hand.filter((c) => c.id !== cardId),
      discard: [...discard, card],
    });

    get().pushLog("player", `Discarded card: ${card.name}`);
  },

  playCard: (cardId: string) => {
    const {
      hand,
      discard,
      playArea,
      investigator,
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

    const card = hand.find((currentCard) => currentCard.id === cardId);

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
        const replacementChoices = getReplacementCandidates(card, playArea);
        const blockedSlot = getBlockedSlot(card, playArea, investigator);

        if (replacementChoices.length > 0 && blockedSlot) {
          set({
            draggedCardId: null,
            pendingAssetPlay: {
              cardId: card.id,
              replacedSlot: blockedSlot,
              replacementChoices,
            },
          });

          get().pushLog(
            "system",
            `Choose an in-play ${blockedSlot} asset to discard in order to play ${card.name}.`,
          );
          return;
        }

        set({ draggedCardId: null, pendingAssetPlay: null });
        get().pushLog(
          "system",
          blockedSlot
            ? `Cannot play ${card.name}. ${blockedSlot} slot is full.`
            : `Cannot play ${card.name}. No available equipment slots.`,
        );
        return;
      }
    }

    const updatedHand = hand.filter((currentCard) => currentCard.id !== cardId);
    const updatedInvestigator = {
      ...investigator,
      resources: investigator.resources - cost,
    };
    const updatedTurn = {
      ...turn,
      actionsRemaining: turn.actionsRemaining - 1,
    };

    if (card.type === "asset") {
      set({
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
      });

      get().pushLog(
        "player",
        `Played asset ${card.name} for ${cost} resource(s). 1 action spent.`,
      );
      return;
    }

    if (card.type === "event") {
      let bonusClues = 0;

      if (card.name === "Working a Hunch") {
        bonusClues = 1;
      }

      set({
        investigator: {
          ...updatedInvestigator,
          clues: updatedInvestigator.clues + bonusClues,
        },
        hand: updatedHand,
        discard: [...discard, card],
        turn: updatedTurn,
        draggedCardId: null,
        pendingAssetPlay: null,
      });

      get().pushLog(
        "player",
        bonusClues > 0
          ? `Played event ${card.name} for ${cost} resource(s). Resolved its basic effect and gained ${bonusClues} clue. 1 action spent.`
          : `Played event ${card.name} for ${cost} resource(s). Event resolved and was discarded. 1 action spent.`,
      );
      return;
    }

    if (card.type === "skill") {
      set({ draggedCardId: null, pendingAssetPlay: null });
      get().pushLog(
        "system",
        `Cannot play ${card.name} as a normal action. Commit it during a skill test instead.`,
      );
      return;
    }

    set({ draggedCardId: null, pendingAssetPlay: null });
    get().pushLog(
      "system",
      `Playing ${card.name} is not implemented for card type ${card.type}.`,
    );
  },

  confirmAssetReplacement: (replacedCardId: string) => {
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

    if (!pendingAssetPlay) {
      return;
    }

    const cardToPlay = hand.find(
      (entry) => entry.id === pendingAssetPlay.cardId,
    );
    const cardToReplace = playArea.find((entry) => entry.id === replacedCardId);

    if (!cardToPlay || !cardToReplace) {
      set({ pendingAssetPlay: null, draggedCardId: null });
      get().pushLog("system", "Asset replacement could not be completed.");
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

    const updatedPlayArea = playArea
      .filter((entry) => entry.id !== replacedCardId)
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
      hand: hand.filter((entry) => entry.id !== cardToPlay.id),
      discard: [...discard, cardToReplace],
      playArea: updatedPlayArea,
      turn: {
        ...turn,
        actionsRemaining: turn.actionsRemaining - 1,
      },
      pendingAssetPlay: null,
      draggedCardId: null,
    });

    get().pushLog(
      "player",
      `Discarded ${cardToReplace.name} and played ${cardToPlay.name} for ${cost} resource(s). 1 action spent.`,
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

  canPlayCardInSlots: (cardId: string) => {
    const { hand, playArea, investigator } = get();
    const card = hand.find((entry) => entry.id === cardId);

    if (!card) {
      return false;
    }

    return canPlayInAvailableSlots(card, playArea, investigator);
  },

  togglePlayAreaCardExhausted: (cardId: string) => {
    const { playArea, log } = get();

    const card = playArea.find((entry) => entry.id === cardId);

    if (!card) {
      return;
    }

    const nextExhausted = !card.exhausted;

    set({
      playArea: playArea.map((entry) =>
        entry.id === cardId ? { ...entry, exhausted: nextExhausted } : entry,
      ),
      log: [
        ...log,
        nextExhausted
          ? `${card.name} was exhausted.`
          : `${card.name} was readied.`,
      ],
    });
  },

  incrementPlayAreaCardCounter: (cardId, counterType) => {
    const { playArea, log } = get();

    const card = playArea.find((entry) => entry.id === cardId);
    if (!card) {
      return;
    }

    const currentValue = card.counters?.[counterType] ?? 0;
    const nextValue = currentValue + 1;

    set({
      playArea: playArea.map((entry) =>
        entry.id === cardId
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

  decrementPlayAreaCardCounter: (cardId, counterType) => {
    const { playArea, log } = get();

    const card = playArea.find((entry) => entry.id === cardId);
    if (!card) {
      return;
    }

    const currentValue = card.counters?.[counterType] ?? 0;
    const nextValue = Math.max(0, currentValue - 1);

    set({
      playArea: playArea.map((entry) => {
        if (entry.id !== cardId) {
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
    const { investigator } = get();

    set({
      investigator: {
        ...investigator,
        clues: investigator.clues + amount,
      },
    });

    get().pushLog("player", `Gained ${amount} clue(s).`);
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

    set({
      locations: updatedLocations,
      selectedEnemyTargetId:
        currentLocation?.id === locationId ? selectedEnemyTargetId : null,
      turn: {
        ...turn,
        actionsRemaining: turn.actionsRemaining - 1,
      },
    });

    get().pushLog("player", `Moved to ${destination.name}. 1 action spent.`);
    get().engageEnemiesAtLocation();
  },

  setPhase: (phase) => {
    const { turn } = get();

    set({
      turn: {
        ...turn,
        phase,
        actionsRemaining: phase === "investigation" ? 3 : turn.actionsRemaining,
      },
    });

    get().pushLog(
      "system",
      `Phase: ${phase.charAt(0).toUpperCase()}${phase.slice(1)}`,
    );
  },

  engageEnemiesAtLocation: () => {
    const { investigator, locations, enemies, selectedEnemyTargetId } = get();
    const currentLocation = findCurrentLocation(locations, investigator.id);

    if (!currentLocation) {
      return;
    }

    let didEngage = false;

    const updatedEnemies = enemies.map((enemy) => {
      if (
        enemy.locationId === currentLocation.id &&
        enemy.engagedInvestigatorId === null &&
        !enemy.exhausted
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
      const preferredTargetId = getPreferredEnemyTargetId(
        enemies,
        currentLocation.id,
        investigator.id,
        selectedEnemyTargetId,
      );

      if (preferredTargetId !== selectedEnemyTargetId) {
        set({ selectedEnemyTargetId: preferredTargetId });
      }

      return;
    }

    const preferredTargetId = getPreferredEnemyTargetId(
      updatedEnemies,
      currentLocation.id,
      investigator.id,
      selectedEnemyTargetId,
    );

    set({
      enemies: updatedEnemies,
      selectedEnemyTargetId: preferredTargetId,
    });

    get().pushLog(
      "enemy",
      `Enemies at ${currentLocation.name} engaged ${investigator.name}.`,
    );
  },

  readyAllEnemies: () => {
    const { enemies } = get();

    set({
      enemies: enemies.map((enemy) => ({
        ...enemy,
        exhausted: false,
      })),
    });
  },

  enemyPhaseAttack: () => {
    const { investigator, enemies } = get();

    const engagedEnemies = enemies.filter(
      (enemy) =>
        enemy.engagedInvestigatorId === investigator.id && !enemy.exhausted,
    );

    if (engagedEnemies.length === 0) {
      get().pushLog("enemy", "Enemy phase: no ready engaged enemies attacked.");
      return;
    }

    const totalDamage = engagedEnemies.reduce(
      (sum, enemy) => sum + enemy.damage,
      0,
    );
    const totalHorror = engagedEnemies.reduce(
      (sum, enemy) => sum + enemy.horror,
      0,
    );

    set({
      investigator: {
        ...investigator,
        damage: investigator.damage + totalDamage,
        horror: investigator.horror + totalHorror,
      },
    });

    get().pushLog(
      "enemy",
      `Enemy phase: engaged enemies attacked for ${totalDamage} damage and ${totalHorror} horror.`,
    );
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

    if (turn.phase === "setup") {
      set({
        turn: {
          ...turn,
          phase: "mythos",
        },
      });
      get().pushLog("system", "Phase: Mythos");
      return;
    }

    if (turn.phase === "investigation") {
      set({
        turn: {
          ...turn,
          phase: "enemy",
        },
      });
      get().pushLog("system", "Phase: Enemy");
      get().enemyPhaseAttack();
      return;
    }

    if (turn.phase === "enemy") {
      set({
        turn: {
          ...turn,
          phase: "upkeep",
        },
      });
      get().pushLog("system", "Phase: Upkeep");
      return;
    }

    if (turn.phase === "upkeep") {
      const nextRound = turn.round + 1;
      const drawnCardName = deck.length > 0 ? deck[0].name : null;
      const updatedDeck = deck.length > 0 ? deck.slice(1) : deck;
      const updatedHand = deck.length > 0 ? [...hand, deck[0]] : hand;

      const currentLocation = findCurrentLocation(locations, investigator.id);
      const preferredTargetId = currentLocation
        ? getPreferredEnemyTargetId(
            enemies,
            currentLocation.id,
            investigator.id,
            selectedEnemyTargetId,
          )
        : null;

      const upkeepLog = [
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
        createLogEntry("system", `Round ${nextRound} begins.`),
        createLogEntry("system", "Phase: Mythos"),
      ];

      set({
        investigator: {
          ...investigator,
          resources: investigator.resources + 1,
        },
        deck: updatedDeck,
        hand: updatedHand,
        selectedEnemyTargetId: preferredTargetId,
        turn: {
          round: nextRound,
          phase: "mythos",
          actionsRemaining: 3,
        },
        log: upkeepLog,
      });

      get().readyAllEnemies();
      get().engageEnemiesAtLocation();
      return;
    }

    if (turn.phase === "mythos") {
      set({
        turn: {
          ...turn,
          phase: "investigation",
          actionsRemaining: 3,
        },
      });
      get().pushLog("system", "Phase: Investigation");
      get().pushLog("system", `${investigator.name} has 3 actions this turn.`);
    }
  },

  takeResourceAction: () => {
    const { investigator, turn, activeSkillTest, scenarioStatus } = get();

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

    set({
      investigator: {
        ...investigator,
        resources: investigator.resources + 1,
      },
      turn: {
        ...turn,
        actionsRemaining: turn.actionsRemaining - 1,
      },
    });

    get().pushLog(
      "player",
      "Took a resource action. Gained 1 resource and spent 1 action.",
    );
  },

  takeDrawAction: () => {
    const { deck, hand, turn, activeSkillTest, scenarioStatus } = get();

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

    if (deck.length === 0) {
      set({
        turn: {
          ...turn,
          actionsRemaining: turn.actionsRemaining - 1,
        },
      });
      get().pushLog(
        "system",
        "Took a draw action, but the deck was empty. 1 action spent.",
      );
      return;
    }

    const [topCard, ...remainingDeck] = deck;

    set({
      deck: remainingDeck,
      hand: [...hand, topCard],
      turn: {
        ...turn,
        actionsRemaining: turn.actionsRemaining - 1,
      },
    });

    get().pushLog(
      "player",
      `Took a draw action. Drew ${topCard.name} and spent 1 action.`,
    );
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
      `Started skill test: ${source}. Commit skill cards, then resolve.`,
    );
  },

  commitSkillCard: (cardId) => {
    const { activeSkillTest, hand } = get();

    if (!activeSkillTest) {
      set({
        draggedCardId: null,
      });
      get().pushLog("system", "No active skill test to commit cards to.");
      return;
    }

    const card = hand.find((currentCard) => currentCard.id === cardId);

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

    if (card.type !== "skill") {
      set({
        draggedCardId: null,
      });
      get().pushLog(
        "system",
        `${card.name} is not a skill card and cannot be committed.`,
      );
      return;
    }

    const matchingIcons = countMatchingIcons(card, activeSkillTest.skill);

    const alreadyCommitted = activeSkillTest.committedCards.some(
      (entry) => entry.card.id === card.id,
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

    const updatedHand = hand.filter((currentCard) => currentCard.id !== cardId);
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
      locations,
      enemies,
      turn,
      selectedEnemyTargetId,
      log,
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
    const modifierDetails = getSkillModifiersFromPlayArea(
      playArea,
      activeSkillTest.skill,
    );
    const assetModifier = modifierDetails.reduce(
      (sum, modifier) => sum + modifier.amount,
      0,
    );
    const committedModifier = activeSkillTest.committedCards.reduce(
      (sum, entry) => sum + entry.matchingIcons,
      0,
    );
    const tokenModifier = getChaosTokenModifier(token);

    const finalValue =
      token === "autoFail"
        ? -999
        : baseValue + assetModifier + committedModifier + tokenModifier;

    const success =
      token !== "autoFail" && finalValue >= activeSkillTest.difficulty;

    const result: SkillTestResult = {
      skill: activeSkillTest.skill,
      baseValue,
      assetModifier,
      committedModifier,
      modifierDetails,
      difficulty: activeSkillTest.difficulty,
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

    const comparisonText =
      token === "autoFail"
        ? `${activeSkillTest.source}: AUTO-FAIL token drawn. Base ${baseValue}, asset bonus ${assetModifier}, committed bonus ${committedModifier}.${modifierText}${committedText} Test failed.`
        : `${activeSkillTest.source}: ${activeSkillTest.skill} ${baseValue} + asset bonus ${assetModifier} + committed bonus ${committedModifier} + token ${tokenModifier} vs ${activeSkillTest.difficulty}, final ${finalValue} => ${
            success ? "success" : "failure"
          }.${modifierText}${committedText}`;

    let updatedLocations = locations;
    let updatedEnemies = enemies;
    const resolutionLog: GameState["log"] = [];
    let updatedInvestigator = investigator;

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
    }

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

        updatedInvestigator = {
          ...investigator,
          clues: investigator.clues + totalCluesDiscovered,
        };

        resolutionLog.push(
          createLogEntry(
            "skill-test",
            `Investigation succeeded at ${location.name}. Discovered ${totalCluesDiscovered} clue${totalCluesDiscovered === 1 ? "" : "s"} and spent 1 action.`,
          ),
        );

        if (bonusCluesOnSuccess > 0) {
          resolutionLog.push(
            createLogEntry(
              "skill-test",
              `Deduction added +${bonusCluesOnSuccess} clue on success.`,
            ),
          );
        }
      }
    }

    if (pendingTestResolution?.kind === "fight") {
      const enemy = enemies.find(
        (entry) => entry.id === pendingTestResolution.enemyId,
      );

      if (!success) {
        resolutionLog.push(
          createLogEntry(
            "combat",
            `Fight against ${enemy?.name ?? "that enemy"} failed. 1 action spent.`,
          ),
        );
      } else if (!enemy) {
        resolutionLog.push(
          createLogEntry(
            "combat",
            "Fight succeeded, but the enemy was no longer present. 1 action spent.",
          ),
        );
      } else {
        const totalDamage = 1 + bonusDamageOnSuccess;

        updatedEnemies = enemies
          .map((entry) =>
            entry.id === enemy.id
              ? { ...entry, damageOnEnemy: entry.damageOnEnemy + totalDamage }
              : entry,
          )
          .filter((entry) =>
            entry.id === enemy.id ? entry.damageOnEnemy < entry.health : true,
          );

        const defeated = enemy.damageOnEnemy + totalDamage >= enemy.health;

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
        (entry) => entry.id === pendingTestResolution.enemyId,
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
      investigator: updatedInvestigator,
      locations: updatedLocations,
      enemies: updatedEnemies,
      deck: updatedDeck,
      hand: updatedHand,
      discard: [...discard, ...committedCards],
      lastSkillTest: result,
      activeSkillTest: null,
      pendingTestResolution: null,
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

    return result;
  },

  investigateAction: () => {
    const { investigator, locations, turn, activeSkillTest, scenarioStatus } =
      get();

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

    get().beginSkillTest(
      "intellect",
      currentLocation.shroud,
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
      pendingTestResolution: { kind: "fight", enemyId: enemy.id },
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
      pendingTestResolution: { kind: "evade", enemyId: enemy.id },
    });
  },
}));
