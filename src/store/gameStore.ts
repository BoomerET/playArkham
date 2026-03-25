import { create } from "zustand";
import { investigators } from "../data/investigators";
import { sampleDeck } from "../data/sampleDeck";
import { defaultScenarioId, scenarios } from "../data/scenarios";
import type { ScenarioDefinition } from "../data/scenarios/scenarioTypes";
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
  ChaosToken,
  CommittedSkillCard,
  GameState,
  Investigator,
  Phase,
  PlayerCard,
  ScenarioCardState,
  SkillTestResult,
  SkillType,
} from "../types/game";

type Screen = "home" | "game";

type PendingTestResolution =
  | { kind: "investigate"; locationId: string }
  | { kind: "fight"; enemyId: string }
  | { kind: "evade"; enemyId: string }
  | null;

type GameStore = GameState & {
  screen: Screen;
  availableInvestigators: Investigator[];
  availableScenarios: ScenarioDefinition[];
  selectedInvestigatorId: string;
  selectedScenarioId: string;
  selectedEnemyTargetId: string | null;
  pendingTestResolution: PendingTestResolution;
  setSelectedInvestigator: (investigatorId: string) => void;
  setSelectedScenario: (scenarioId: string) => void;
  setSelectedEnemyTarget: (enemyId: string | null) => void;
  setLocationVisible: (locationId: string, visible?: boolean) => void;
  revealLocation: (locationId: string) => void;
  setAgendaProgress: (progress: number) => void;
  setActProgress: (progress: number) => void;
  advanceAgenda: () => void;
  advanceAct: () => void;
  setDraggedCardId: (cardId: string | null) => void;
  startGame: () => void;
  returnToHome: () => void;
  setupGame: () => void;
  drawCard: () => void;
  drawStartingHand: (count?: number) => void;
  discardCard: (cardId: string) => void;
  playCard: (cardId: string) => void;
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

export const useGameStore = create<GameStore>((set, get) => ({
  screen: "home",
  availableInvestigators: investigators,
  availableScenarios: scenarios,
  selectedInvestigatorId: investigators[0].id,
  selectedScenarioId: defaultScenarioId,
  selectedEnemyTargetId: null,
  draggedCardId: null,
  pendingTestResolution: null,

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
  log: [],
  lastSkillTest: null,
  activeSkillTest: null,
  turn: {
    round: 1,
    phase: "setup",
    actionsRemaining: 3,
  },

  setSelectedInvestigator: (investigatorId) => {
    set({ selectedInvestigatorId: investigatorId });
  },

  setSelectedScenario: (scenarioId) => {
    set({ selectedScenarioId: scenarioId });
  },

  setSelectedEnemyTarget: (enemyId) => {
    const { investigator, locations, enemies, log, selectedEnemyTargetId } =
      get();
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
      log: [...log, `Current enemy target: ${selectedEnemy.name}.`],
    });
  },

  setLocationVisible: (locationId, visible = true) => {
    const { locations, log } = get();
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
      log: [
        ...log,
        visible
          ? `${location.name} is now visible on the board.`
          : `${location.name} is no longer visible on the board.`,
      ],
    });
  },

  revealLocation: (locationId) => {
    const { locations, log } = get();
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
      log: [...log, `${location.name} was revealed.`],
    });
  },

  setAgendaProgress: (progress) => {
    const { agenda, log } = get();

    if (!agenda) {
      return;
    }

    const nextProgress = Math.max(0, progress);

    set({
      agenda: {
        ...agenda,
        progress: nextProgress,
      },
      log: [
        ...log,
        `${agenda.thresholdLabel} on agenda set to ${nextProgress}/${agenda.threshold}.`,
      ],
    });
  },

  setActProgress: (progress) => {
    const { act, log } = get();

    if (!act) {
      return;
    }

    const nextProgress = Math.max(0, progress);

    set({
      act: {
        ...act,
        progress: nextProgress,
      },
      log: [
        ...log,
        `${act.thresholdLabel} on act set to ${nextProgress}/${act.threshold}.`,
      ],
    });
  },

  advanceAgenda: () => {
    const { agenda, log, locations } = get();

    if (!agenda) {
      return;
    }

    const scenario = getSelectedScenario(get());
    const agendas = scenario.agendas ?? [];

    const currentIndex = agendas.findIndex((entry) => entry.id === agenda.id);

    if (currentIndex === -1) {
      set({
        agenda: {
          ...agenda,
          progress: agenda.threshold,
        },
        log: [...log, `Agenda ${agenda.sequence} is ready to advance.`],
      });
      return;
    }

    const nextDefinition = agendas[currentIndex + 1];

    if (!nextDefinition) {
      set({
        agenda: {
          ...agenda,
          progress: agenda.threshold,
        },
        log: [
          ...log,
          `Agenda ${agenda.sequence} has no further side to advance to.`,
        ],
      });
      return;
    }

    const advancedLog = [
      ...log,
      `Agenda advanced from ${agenda.sequence} to ${nextDefinition.sequence}: ${nextDefinition.title}.`,
    ];

    const scenarioEffectResult = applyScenarioAgendaAdvanceEffects(
      scenario.id,
      nextDefinition.id,
      {
        locations,
        log: advancedLog,
      },
    );

    set({
      agenda: buildScenarioCardState(nextDefinition),
      locations: scenarioEffectResult.locations,
      log: scenarioEffectResult.log,
    });
  },

  advanceAct: () => {
    const { act, log, locations } = get();

    if (!act) {
      return;
    }

    const scenario = getSelectedScenario(get());
    const acts = scenario.acts ?? [];

    const currentIndex = acts.findIndex((entry) => entry.id === act.id);

    if (currentIndex === -1) {
      set({
        act: {
          ...act,
          progress: act.threshold,
        },
        log: [...log, `Act ${act.sequence} is ready to advance.`],
      });
      return;
    }

    const nextDefinition = acts[currentIndex + 1];

    if (!nextDefinition) {
      set({
        act: {
          ...act,
          progress: act.threshold,
        },
        log: [...log, `Act ${act.sequence} has no further side to advance to.`],
      });
      return;
    }

    const advancedLog = [
      ...log,
      `Act advanced from ${act.sequence} to ${nextDefinition.sequence}: ${nextDefinition.title}.`,
    ];

    const scenarioEffectResult = applyScenarioActAdvanceEffects(
      scenario.id,
      nextDefinition.id,
      {
        locations,
        log: advancedLog,
      },
    );

    set({
      act: buildScenarioCardState(nextDefinition),
      locations: scenarioEffectResult.locations,
      log: scenarioEffectResult.log,
    });
  },

  setDraggedCardId: (cardId) => {
    set({ draggedCardId: cardId });
  },

  startGame: () => {
    get().setupGame();
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

  setupGame: () => {
    const selected = get().availableInvestigators.find(
      (investigator) => investigator.id === get().selectedInvestigatorId,
    );

    const selectedScenario = getSelectedScenario(get());

    const chosenInvestigator = selected
      ? createGameInvestigator(selected)
      : createGameInvestigator(get().availableInvestigators[0]);

    const shuffledDeck = shuffle(sampleDeck);

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
      log: [
        `Selected investigator: ${chosenInvestigator.name}`,
        `Selected scenario: ${selectedScenario.name}`,
        "Game setup complete.",
        "Round 1 begins.",
        "First round: Mythos phase is skipped.",
        "Phase: Investigation",
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
    const { deck, hand, log } = get();

    if (deck.length === 0) {
      set({
        log: [...log, "Tried to draw a card, but the deck is empty."],
      });
      return;
    }

    const [topCard, ...remainingDeck] = deck;

    set({
      deck: remainingDeck,
      hand: [...hand, topCard],
      log: [...log, `Drew card: ${topCard.name}`],
    });
  },

  drawStartingHand: (count = 5) => {
    for (let i = 0; i < count; i += 1) {
      get().drawCard();
    }
  },

  discardCard: (cardId: string) => {
    const { hand, discard, log, activeSkillTest } = get();

    if (activeSkillTest) {
      set({
        log: [
          ...log,
          "Cannot manually discard from hand while a skill test is active.",
        ],
      });
      return;
    }

    const card = hand.find((c) => c.id === cardId);

    if (!card) {
      return;
    }

    set({
      hand: hand.filter((c) => c.id !== cardId),
      discard: [...discard, card],
      log: [...log, `Discarded card: ${card.name}`],
    });
  },

  playCard: (cardId: string) => {
    const {
      hand,
      discard,
      playArea,
      investigator,
      turn,
      log,
      activeSkillTest,
    } = get();

    if (activeSkillTest) {
      set({
        draggedCardId: null,
        log: [
          ...log,
          "Cannot play cards normally while a skill test is active.",
        ],
      });
      return;
    }

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      const message =
        turn.phase !== "investigation"
          ? "Cannot play a card outside the Investigation phase."
          : "Cannot play a card. No actions remaining.";

      set({
        draggedCardId: null,
        log: [...log, message],
      });
      return;
    }

    const card = hand.find((currentCard) => currentCard.id === cardId);

    if (!card) {
      set({
        draggedCardId: null,
        log: [...log, "Could not play that card because it was not in hand."],
      });
      return;
    }

    const cost = getCardCost(card);

    if (investigator.resources < cost) {
      set({
        draggedCardId: null,
        log: [...log, `Cannot play ${card.name}. Not enough resources.`],
      });
      return;
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
        playArea: [...playArea, card],
        turn: updatedTurn,
        draggedCardId: null,
        log: [
          ...log,
          `Played asset ${card.name} for ${cost} resource(s). 1 action spent.`,
        ],
      });
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
        log: [
          ...log,
          bonusClues > 0
            ? `Played event ${card.name} for ${cost} resource(s). Resolved its basic effect and gained ${bonusClues} clue. 1 action spent.`
            : `Played event ${card.name} for ${cost} resource(s). Event resolved and was discarded. 1 action spent.`,
        ],
      });
      return;
    }

    if (card.type === "skill") {
      set({
        draggedCardId: null,
        log: [
          ...log,
          `Cannot play ${card.name} as a normal action. Commit it during a skill test instead.`,
        ],
      });
      return;
    }

    set({
      draggedCardId: null,
      log: [
        ...log,
        `Playing ${card.name} is not implemented for card type ${card.type}.`,
      ],
    });
  },

  drawChaosToken: () => {
    const { chaosBag, log } = get();

    if (chaosBag.length === 0) {
      set({
        log: [...log, "Tried to draw a chaos token, but the bag is empty."],
      });
      return null;
    }

    const token = chaosBag[Math.floor(Math.random() * chaosBag.length)];

    set({
      log: [...log, `Drew chaos token: ${String(token)}`],
    });

    return token;
  },

  gainResource: (amount = 1) => {
    const { investigator, log } = get();

    set({
      investigator: {
        ...investigator,
        resources: investigator.resources + amount,
      },
      log: [...log, `Gained ${amount} resource(s).`],
    });
  },

  spendResource: (amount = 1) => {
    const { investigator, log } = get();

    set({
      investigator: {
        ...investigator,
        resources: Math.max(0, investigator.resources - amount),
      },
      log: [...log, `Spent ${amount} resource(s).`],
    });
  },

  gainClue: (amount = 1) => {
    const { investigator, log } = get();

    set({
      investigator: {
        ...investigator,
        clues: investigator.clues + amount,
      },
      log: [...log, `Gained ${amount} clue(s).`],
    });
  },

  takeDamage: (amount = 1) => {
    const { investigator, log } = get();

    set({
      investigator: {
        ...investigator,
        damage: investigator.damage + amount,
      },
      log: [...log, `Took ${amount} damage.`],
    });
  },

  takeHorror: (amount = 1) => {
    const { investigator, log } = get();

    set({
      investigator: {
        ...investigator,
        horror: investigator.horror + amount,
      },
      log: [...log, `Took ${amount} horror.`],
    });
  },

  moveInvestigator: (locationId: string) => {
    const {
      investigator,
      locations,
      log,
      turn,
      activeSkillTest,
      selectedEnemyTargetId,
    } = get();

    if (activeSkillTest) {
      set({
        log: [...log, "Cannot move while a skill test is active."],
      });
      return;
    }

    const currentLocation = findCurrentLocation(locations, investigator.id);
    const destination = locations.find((location) => location.id === locationId);

    if (!destination) {
      return;
    }

    if (!destination.isVisible) {
      set({
        log: [
          ...log,
          `Cannot move to ${destination.name}. It is not visible yet.`,
        ],
      });
      return;
    }

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      const message =
        turn.phase !== "investigation"
          ? "Cannot move right now. Movement is only available during the Investigation phase."
          : "Cannot move. No actions remaining.";

      set({
        log: [...log, message],
      });
      return;
    }

    if (
      currentLocation &&
      !currentLocation.connections.includes(locationId) &&
      currentLocation.id !== locationId
    ) {
      set({
        log: [
          ...log,
          `Cannot move from ${currentLocation.name} to ${destination.name}. Not connected.`,
        ],
      });
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
      log: [...log, `Moved to ${destination.name}. 1 action spent.`],
    });

    get().engageEnemiesAtLocation();
  },

  setPhase: (phase) => {
    const { turn, log } = get();

    set({
      turn: {
        ...turn,
        phase,
        actionsRemaining: phase === "investigation" ? 3 : turn.actionsRemaining,
      },
      log: [...log, `Phase: ${phase.charAt(0).toUpperCase()}${phase.slice(1)}`],
    });
  },

  engageEnemiesAtLocation: () => {
    const {
      investigator,
      locations,
      enemies,
      log,
      selectedEnemyTargetId,
    } = get();
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
      log: [
        ...log,
        `Enemies at ${currentLocation.name} engaged ${investigator.name}.`,
      ],
    });
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
    const { investigator, enemies, log } = get();

    const engagedEnemies = enemies.filter(
      (enemy) =>
        enemy.engagedInvestigatorId === investigator.id && !enemy.exhausted,
    );

    if (engagedEnemies.length === 0) {
      set({
        log: [...log, "Enemy phase: no ready engaged enemies attacked."],
      });
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
      log: [
        ...log,
        `Enemy phase: engaged enemies attacked for ${totalDamage} damage and ${totalHorror} horror.`,
      ],
    });
  },

  advancePhase: () => {
    const {
      turn,
      log,
      investigator,
      deck,
      hand,
      activeSkillTest,
      enemies,
      selectedEnemyTargetId,
      locations,
    } = get();

    if (activeSkillTest) {
      set({
        log: [
          ...log,
          "Resolve or cancel the active skill test before advancing the phase.",
        ],
      });
      return;
    }

    if (turn.phase === "setup") {
      set({
        turn: {
          ...turn,
          phase: "mythos",
        },
        log: [...log, "Phase: Mythos"],
      });
      return;
    }

    if (turn.phase === "investigation") {
      set({
        turn: {
          ...turn,
          phase: "enemy",
        },
        log: [...log, "Phase: Enemy"],
      });

      get().enemyPhaseAttack();
      return;
    }

    if (turn.phase === "enemy") {
      set({
        turn: {
          ...turn,
          phase: "upkeep",
        },
        log: [...get().log, "Phase: Upkeep"],
      });
      return;
    }

    if (turn.phase === "upkeep") {
      const nextRound = turn.round + 1;
      const drawnCardName = deck.length > 0 ? deck[0].name : null;
      const updatedDeck = deck.length > 0 ? deck.slice(1) : deck;
      const updatedHand = deck.length > 0 ? [...hand, deck[0]] : hand;

      const upkeepLog = [
        ...get().log,
        `${investigator.name} gains 1 resource during upkeep.`,
      ];

      if (drawnCardName) {
        upkeepLog.push(`Drew card during upkeep: ${drawnCardName}`);
      } else {
        upkeepLog.push(
          "Tried to draw a card during upkeep, but the deck was empty.",
        );
      }

      upkeepLog.push(`Round ${nextRound} begins.`);
      upkeepLog.push("Phase: Mythos");

      const currentLocation = findCurrentLocation(locations, investigator.id);
      const preferredTargetId = currentLocation
        ? getPreferredEnemyTargetId(
            enemies,
            currentLocation.id,
            investigator.id,
            selectedEnemyTargetId,
          )
        : null;

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
        log: [
          ...log,
          "Phase: Investigation",
          `${investigator.name} has 3 actions this turn.`,
        ],
      });
    }
  },

  takeResourceAction: () => {
    const { investigator, turn, log, activeSkillTest } = get();

    if (activeSkillTest) {
      set({
        log: [
          ...log,
          "Resolve or cancel the active skill test before taking another action.",
        ],
      });
      return;
    }

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      const message =
        turn.phase !== "investigation"
          ? "Cannot take a resource action outside the Investigation phase."
          : "Cannot take a resource action. No actions remaining.";

      set({
        log: [...log, message],
      });
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
      log: [
        ...log,
        "Took a resource action. Gained 1 resource and spent 1 action.",
      ],
    });
  },

  takeDrawAction: () => {
    const { deck, hand, turn, log, activeSkillTest } = get();

    if (activeSkillTest) {
      set({
        log: [
          ...log,
          "Resolve or cancel the active skill test before taking another action.",
        ],
      });
      return;
    }

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      const message =
        turn.phase !== "investigation"
          ? "Cannot take a draw action outside the Investigation phase."
          : "Cannot take a draw action. No actions remaining.";

      set({
        log: [...log, message],
      });
      return;
    }

    if (deck.length === 0) {
      set({
        turn: {
          ...turn,
          actionsRemaining: turn.actionsRemaining - 1,
        },
        log: [
          ...log,
          "Took a draw action, but the deck was empty. 1 action spent.",
        ],
      });
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
      log: [
        ...log,
        `Took a draw action. Drew ${topCard.name} and spent 1 action.`,
      ],
    });
  },

  beginSkillTest: (skill, difficulty, source) => {
    const { log, activeSkillTest } = get();

    if (activeSkillTest) {
      set({
        log: [...log, "A skill test is already active."],
      });
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
      log: [
        ...log,
        `Started skill test: ${source}. Commit skill cards, then resolve.`,
      ],
    });
  },

  commitSkillCard: (cardId) => {
    const { activeSkillTest, hand, log } = get();

    if (!activeSkillTest) {
      set({
        draggedCardId: null,
        log: [...log, "No active skill test to commit cards to."],
      });
      return;
    }

    const card = hand.find((currentCard) => currentCard.id === cardId);

    if (!card) {
      set({
        draggedCardId: null,
        log: [...log, "Could not commit that card because it was not in hand."],
      });
      return;
    }

    if (card.type !== "skill") {
      set({
        draggedCardId: null,
        log: [
          ...log,
          `${card.name} is not a skill card and cannot be committed.`,
        ],
      });
      return;
    }

    const matchingIcons = countMatchingIcons(card, activeSkillTest.skill);

    const alreadyCommitted = activeSkillTest.committedCards.some(
      (entry) => entry.card.id === card.id,
    );

    if (alreadyCommitted) {
      set({
        draggedCardId: null,
        log: [...log, `${card.name} is already committed to this test.`],
      });
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
      log: [
        ...log,
        `Committed ${card.name} to ${activeSkillTest.source} for +${matchingIcons}.`,
      ],
    });
  },

  cancelActiveSkillTest: () => {
    const { activeSkillTest, hand, log } = get();

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
      log: [
        ...log,
        `Cancelled skill test: ${activeSkillTest.source}. Committed cards returned to hand.`,
      ],
    });
  },

  resolveActiveSkillTest: () => {
    const {
      activeSkillTest,
      investigator,
      playArea,
      discard,
      log,
      pendingTestResolution,
      locations,
      enemies,
      turn,
      selectedEnemyTargetId,
    } = get();

    if (!activeSkillTest) {
      set({
        log: [...log, "No active skill test to resolve."],
      });
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
    const resolutionLog: string[] = [];
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
          `Investigation failed at ${location?.name ?? "that location"}. 1 action spent.`,
        );
      } else if (!location || location.clues <= 0) {
        resolutionLog.push(
          `Investigation succeeded at ${location?.name ?? "that location"}, but there were no clues to discover. 1 action spent.`,
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
          `Investigation succeeded at ${location.name}. Discovered ${totalCluesDiscovered} clue${totalCluesDiscovered === 1 ? "" : "s"} and spent 1 action.`,
        );

        if (bonusCluesOnSuccess > 0) {
          resolutionLog.push(
            `Deduction added +${bonusCluesOnSuccess} clue on success.`,
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
          `Fight against ${enemy?.name ?? "that enemy"} failed. 1 action spent.`,
        );
      } else if (!enemy) {
        resolutionLog.push(
          "Fight succeeded, but the enemy was no longer present. 1 action spent.",
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
          defeated
            ? `Fight succeeded. ${enemy.name} was defeated. 1 action spent.`
            : `Fight succeeded. Dealt ${totalDamage} damage to ${enemy.name}. 1 action spent.`,
        );

        if (bonusDamageOnSuccess > 0) {
          resolutionLog.push(
            `Vicious Blow added +${bonusDamageOnSuccess} damage on success.`,
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
          `Evade against ${enemy?.name ?? "that enemy"} failed. 1 action spent.`,
        );
      } else if (!enemy) {
        resolutionLog.push(
          "Evade succeeded, but the enemy was no longer present. 1 action spent.",
        );
      } else {
        updatedEnemies = enemies.map((entry) =>
          entry.id === enemy.id
            ? { ...entry, exhausted: true, engagedInvestigatorId: null }
            : entry,
        );

        resolutionLog.push(
          `Evade succeeded. ${enemy.name} is exhausted and disengaged. 1 action spent.`,
        );
      }
    }

    let updatedDeck = get().deck;
    let updatedHand = get().hand;

    for (let i = 0; i < cardsToDrawOnSuccess; i += 1) {
      if (updatedDeck.length === 0) {
        resolutionLog.push(
          "Tried to draw a card from a successful skill effect, but the deck was empty.",
        );
        break;
      }

      const [drawnCard, ...remainingDeck] = updatedDeck;
      updatedDeck = remainingDeck;
      updatedHand = [...updatedHand, drawnCard];
      resolutionLog.push(
        `Drew card from successful skill effect: ${drawnCard.name}`,
      );
    }

    const currentLocation = findCurrentLocation(updatedLocations, investigator.id);
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
      log: [...get().log, comparisonText, ...resolutionLog],
    });

    return result;
  },

  investigateAction: () => {
    const { investigator, locations, turn, log, activeSkillTest } = get();

    if (activeSkillTest) {
      set({
        log: [
          ...log,
          "Resolve or cancel the active skill test before starting another one.",
        ],
      });
      return;
    }

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      const message =
        turn.phase !== "investigation"
          ? "Cannot investigate outside the Investigation phase."
          : "Cannot investigate. No actions remaining.";

      set({
        log: [...log, message],
      });
      return;
    }

    const currentLocation = findCurrentLocation(locations, investigator.id);

    if (!currentLocation) {
      set({
        log: [
          ...log,
          "Cannot investigate because the investigator is not at a location.",
        ],
      });
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
      log,
      activeSkillTest,
      selectedEnemyTargetId,
    } = get();

    if (activeSkillTest) {
      set({
        log: [
          ...log,
          "Resolve or cancel the active skill test before starting another one.",
        ],
      });
      return;
    }

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      const message =
        turn.phase !== "investigation"
          ? "Cannot fight outside the Investigation phase."
          : "Cannot fight. No actions remaining.";

      set({
        log: [...log, message],
      });
      return;
    }

    const currentLocation = findCurrentLocation(locations, investigator.id);

    if (!currentLocation) {
      set({
        log: [
          ...log,
          "Cannot fight because the investigator is not at a location.",
        ],
      });
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
        log: [
          ...log,
          "Took a fight action, but there was no enemy at your location. 1 action spent.",
        ],
      });
      return;
    }

    set({
      log: [...log, `Fight action targeting ${enemy.name}.`],
    });

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
      log,
      activeSkillTest,
      selectedEnemyTargetId,
    } = get();

    if (activeSkillTest) {
      set({
        log: [
          ...log,
          "Resolve or cancel the active skill test before starting another one.",
        ],
      });
      return;
    }

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      const message =
        turn.phase !== "investigation"
          ? "Cannot evade outside the Investigation phase."
          : "Cannot evade. No actions remaining.";

      set({
        log: [...log, message],
      });
      return;
    }

    const currentLocation = findCurrentLocation(locations, investigator.id);

    if (!currentLocation) {
      set({
        log: [
          ...log,
          "Cannot evade because the investigator is not at a location.",
        ],
      });
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
        log: [
          ...log,
          "Took an evade action, but there was no enemy at your location. 1 action spent.",
        ],
      });
      return;
    }

    set({
      log: [...log, `Evade action targeting ${enemy.name}.`],
    });

    get().beginSkillTest("agility", enemy.evade, `Evade ${enemy.name}`);
    set({
      pendingTestResolution: { kind: "evade", enemyId: enemy.id },
    });
  },
}));
