import { create } from "zustand";
import { investigators } from "../data/investigators";
import { sampleDeck } from "../data/sampleDeck";
import { sampleEnemies } from "../data/sampleEnemies";
import { sampleLocations } from "../data/sampleLocations";
import { getChaosTokenModifier } from "../lib/chaosToken";
import { getSkillModifiersFromPlayArea } from "../lib/skillModifiers";
import { shuffle } from "../lib/shuffle";
import type {
  ChaosToken,
  Enemy,
  GameState,
  Investigator,
  Location,
  Phase,
  PlayerCard,
  SkillTestResult,
  SkillType,
} from "../types/game";

type Screen = "home" | "game";

type GameStore = GameState & {
  screen: Screen;
  availableInvestigators: Investigator[];
  selectedInvestigatorId: string;
  draggedCardId: string | null;
  setSelectedInvestigator: (investigatorId: string) => void;
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
  runSkillTest: (
    skill: SkillType,
    difficulty: number,
    source: string,
  ) => SkillTestResult | null;
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

function findCurrentLocation(
  locations: Location[],
  investigatorId: string,
): Location | undefined {
  return locations.find((location) =>
    location.investigatorsHere.includes(investigatorId),
  );
}

function canSpendInvestigationAction(
  phase: Phase,
  actionsRemaining: number,
): boolean {
  return phase === "investigation" && actionsRemaining > 0;
}

function getInvestigatorSkillValue(
  investigator: GameState["investigator"],
  skill: SkillType,
): number {
  return investigator[skill];
}

function getEnemyAtInvestigator(
  enemies: Enemy[],
  locationId: string,
  investigatorId: string,
): Enemy | undefined {
  return enemies.find(
    (enemy) =>
      enemy.locationId === locationId &&
      (enemy.engagedInvestigatorId === investigatorId ||
        enemy.engagedInvestigatorId === null),
  );
}

function getCardCost(card: PlayerCard): number {
  return card.cost ?? 0;
}

function createGameInvestigator(investigator: Investigator): Investigator {
  return { ...investigator, resources: 5, clues: 0, damage: 0, horror: 0 };
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: "home",
  availableInvestigators: investigators,
  selectedInvestigatorId: investigators[0].id,
  draggedCardId: null,

  investigator: createGameInvestigator(investigators[0]),
  deck: [],
  hand: [],
  discard: [],
  playArea: [],
  chaosBag: [...startingChaosBag],
  locations: sampleLocations,
  enemies: sampleEnemies,
  log: [],
  lastSkillTest: null,
  turn: {
    round: 1,
    phase: "setup",
    actionsRemaining: 3,
  },

  setSelectedInvestigator: (investigatorId) => {
    set({ selectedInvestigatorId: investigatorId });
  },

  setDraggedCardId: (cardId) => {
    set({ draggedCardId: cardId });
  },

  startGame: () => {
    get().setupGame(
      draggedCardId: null,
    );
    set({ screen: "game" });
  },

  returnToHome: () => {
    set({
      screen: "home",
      draggedCardId: null,
      log: [],
      hand: [],
      discard: [],
      playArea: [],
      deck: [],
      lastSkillTest: null,
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
      chaosBag: [...startingChaosBag],
      locations: sampleLocations.map((location) => ({
        ...location,
        investigatorsHere:
          location.id === "study" ? [chosenInvestigator.id] : [],
      })),
      enemies: sampleEnemies.map((enemy) => ({ ...enemy })),
      log: [
        `Selected investigator: ${chosenInvestigator.name}`,
        "Game setup complete.",
        "Round 1 begins.",
        "First round: Mythos phase is skipped.",
        "Phase: Investigation",
      ],
      lastSkillTest: null,
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
      set({ log: [...log, "Tried to draw a card, but the deck is empty."] });
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
    const { hand, discard, log } = get();
    const card = hand.find((c) => c.id === cardId);

    if (!card) return;

    set({
      hand: hand.filter((c) => c.id !== cardId),
      discard: [...discard, card],
      log: [...log, `Discarded card: ${card.name}`],
    });
  },

  playCard: (cardId: string) => {
    const { hand, discard, playArea, investigator, turn, log } = get();

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      set({
        log: [
          ...log,
          turn.phase !== "investigation"
            ? "Cannot play a card outside the Investigation phase."
            : "Cannot play a card. No actions remaining.",
        ],
      });
      return;
    }

    const card = hand.find((currentCard) => currentCard.id === cardId);

    if (!card) {
      set({
        log: [...log, "Could not play that card because it was not in hand."],
      });
      return;
    }

    const cost = getCardCost(card);

    if (investigator.resources < cost) {
      set({
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
        log: [
          ...log,
          `Cannot play ${card.name} as a normal action yet. Skill commits are not implemented.`,
        ],
      });
      return;
    }

    set({
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
      investigator: { ...investigator, clues: investigator.clues + amount },
      log: [...log, `Gained ${amount} clue(s).`],
    });
  },

  takeDamage: (amount = 1) => {
    const { investigator, log } = get();

    set({
      investigator: { ...investigator, damage: investigator.damage + amount },
      log: [...log, `Took ${amount} damage.`],
    });
  },

  takeHorror: (amount = 1) => {
    const { investigator, log } = get();

    set({
      investigator: { ...investigator, horror: investigator.horror + amount },
      log: [...log, `Took ${amount} horror.`],
    });
  },

  moveInvestigator: (locationId: string) => {
    const { investigator, locations, log, turn } = get();
    const currentLocation = findCurrentLocation(locations, investigator.id);
    const destination = locations.find(
      (location) => location.id === locationId,
    );

    if (!destination) return;

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      set({
        log: [
          ...log,
          turn.phase !== "investigation"
            ? "Cannot move right now. Movement is only available during the Investigation phase."
            : "Cannot move. No actions remaining.",
        ],
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
        };
      }

      return {
        ...location,
        investigatorsHere: withoutInvestigator,
      };
    });

    set({
      locations: updatedLocations,
      turn: { ...turn, actionsRemaining: turn.actionsRemaining - 1 },
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
    const { investigator, locations, enemies, log } = get();
    const currentLocation = findCurrentLocation(locations, investigator.id);
    if (!currentLocation) return;

    let didEngage = false;

    const updatedEnemies = enemies.map((enemy) => {
      if (
        enemy.locationId === currentLocation.id &&
        enemy.engagedInvestigatorId === null &&
        !enemy.exhausted
      ) {
        didEngage = true;
        return { ...enemy, engagedInvestigatorId: investigator.id };
      }

      return enemy;
    });

    if (!didEngage) return;

    set({
      enemies: updatedEnemies,
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
    const { turn, log, investigator, deck, hand } = get();

    if (turn.phase === "setup") {
      set({
        turn: { ...turn, phase: "mythos" },
        log: [...log, "Phase: Mythos"],
      });
      return;
    }

    if (turn.phase === "mythos") {
      set({
        turn: { ...turn, phase: "investigation", actionsRemaining: 3 },
        log: [
          ...log,
          "Phase: Investigation",
          `${investigator.name} has 3 actions this turn.`,
        ],
      });
      return;
    }

    if (turn.phase === "investigation") {
      set({
        turn: { ...turn, phase: "enemy" },
        log: [...log, "Phase: Enemy"],
      });

      get().enemyPhaseAttack();
      return;
    }

    if (turn.phase === "enemy") {
      set({
        turn: { ...turn, phase: "upkeep" },
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
          "Tried to draw a card during upkeep, but the deck is empty.",
        );
      }

      upkeepLog.push(`Round ${nextRound} begins.`);
      upkeepLog.push("Phase: Mythos");

      set({
        investigator: {
          ...investigator,
          resources: investigator.resources + 1,
        },
        deck: updatedDeck,
        hand: updatedHand,
        turn: { round: nextRound, phase: "mythos", actionsRemaining: 3 },
        log: upkeepLog,
      });

      get().readyAllEnemies();
      get().engageEnemiesAtLocation();
    }
  },

  takeResourceAction: () => {
    const { investigator, turn, log } = get();

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      set({
        log: [
          ...log,
          turn.phase !== "investigation"
            ? "Cannot take a resource action outside the Investigation phase."
            : "Cannot take a resource action. No actions remaining.",
        ],
      });
      return;
    }

    set({
      investigator: { ...investigator, resources: investigator.resources + 1 },
      turn: { ...turn, actionsRemaining: turn.actionsRemaining - 1 },
      log: [
        ...log,
        "Took a resource action. Gained 1 resource and spent 1 action.",
      ],
    });
  },

  takeDrawAction: () => {
    const { deck, hand, turn, log } = get();

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      set({
        log: [
          ...log,
          turn.phase !== "investigation"
            ? "Cannot take a draw action outside the Investigation phase."
            : "Cannot take a draw action. No actions remaining.",
        ],
      });
      return;
    }

    if (deck.length === 0) {
      set({
        turn: { ...turn, actionsRemaining: turn.actionsRemaining - 1 },
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
      turn: { ...turn, actionsRemaining: turn.actionsRemaining - 1 },
      log: [
        ...log,
        `Took a draw action. Drew ${topCard.name} and spent 1 action.`,
      ],
    });
  },

  runSkillTest: (skill, difficulty, source) => {
    const { investigator, playArea, log } = get();
    const token = get().drawChaosToken();
    if (token === null) return null;

    const baseValue = getInvestigatorSkillValue(investigator, skill);
    const modifierDetails = getSkillModifiersFromPlayArea(playArea, skill);
    const assetModifier = modifierDetails.reduce(
      (sum, modifier) => sum + modifier.amount,
      0,
    );
    const tokenModifier = getChaosTokenModifier(token);
    const finalValue =
      token === "autoFail" ? -999 : baseValue + assetModifier + tokenModifier;
    const success = token !== "autoFail" && finalValue >= difficulty;

    const result: SkillTestResult = {
      skill,
      baseValue,
      assetModifier,
      modifierDetails,
      difficulty,
      token,
      tokenModifier,
      finalValue,
      success,
      source,
    };

    const modifierText =
      modifierDetails.length > 0
        ? ` Asset modifiers: ${modifierDetails
            .map((modifier) => `${modifier.source} +${modifier.amount}`)
            .join(", ")}.`
        : "";

    const comparisonText =
      token === "autoFail"
        ? `${source}: AUTO-FAIL token drawn. Base ${baseValue}, asset bonus ${assetModifier}.${modifierText} Test failed.`
        : `${source}: ${skill} ${baseValue} + asset bonus ${assetModifier} + token ${tokenModifier} vs ${difficulty}, final ${finalValue} => ${
            success ? "success" : "failure"
          }.${modifierText}`;

    set({
      lastSkillTest: result,
      log: [...log, comparisonText],
    });

    return result;
  },

  investigateAction: () => {
    const { investigator, locations, turn, log } = get();

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      set({
        log: [
          ...log,
          turn.phase !== "investigation"
            ? "Cannot investigate outside the Investigation phase."
            : "Cannot investigate. No actions remaining.",
        ],
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

    const testResult = get().runSkillTest(
      "intellect",
      currentLocation.shroud,
      `Investigate at ${currentLocation.name}`,
    );

    if (!testResult) return;

    if (!testResult.success) {
      set({
        turn: { ...turn, actionsRemaining: turn.actionsRemaining - 1 },
        log: [
          ...get().log,
          `Investigation failed at ${currentLocation.name}. 1 action spent.`,
        ],
      });
      return;
    }

    if (currentLocation.clues <= 0) {
      set({
        turn: { ...turn, actionsRemaining: turn.actionsRemaining - 1 },
        log: [
          ...get().log,
          `Investigation succeeded at ${currentLocation.name}, but there were no clues to discover. 1 action spent.`,
        ],
      });
      return;
    }

    const updatedLocations = get().locations.map((location) =>
      location.id === currentLocation.id
        ? { ...location, clues: location.clues - 1 }
        : location,
    );

    set({
      investigator: {
        ...get().investigator,
        clues: get().investigator.clues + 1,
      },
      locations: updatedLocations,
      turn: {
        ...get().turn,
        actionsRemaining: get().turn.actionsRemaining - 1,
      },
      log: [
        ...get().log,
        `Investigation succeeded at ${currentLocation.name}. Discovered 1 clue and spent 1 action.`,
      ],
    });
  },

  fightAction: () => {
    const { investigator, locations, enemies, turn, log } = get();

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      set({
        log: [
          ...log,
          turn.phase !== "investigation"
            ? "Cannot fight outside the Investigation phase."
            : "Cannot fight. No actions remaining.",
        ],
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
    );

    if (!enemy) {
      set({
        turn: { ...turn, actionsRemaining: turn.actionsRemaining - 1 },
        log: [
          ...log,
          "Took a fight action, but there was no enemy at your location. 1 action spent.",
        ],
      });
      return;
    }

    const testResult = get().runSkillTest(
      "combat",
      enemy.fight,
      `Fight ${enemy.name}`,
    );
    if (!testResult) return;

    if (!testResult.success) {
      set({
        turn: {
          ...get().turn,
          actionsRemaining: get().turn.actionsRemaining - 1,
        },
        log: [
          ...get().log,
          `Fight against ${enemy.name} failed. 1 action spent.`,
        ],
      });
      return;
    }

    const updatedEnemies = get()
      .enemies.map((currentEnemy) => {
        if (currentEnemy.id !== enemy.id) return currentEnemy;
        return {
          ...currentEnemy,
          damageOnEnemy: currentEnemy.damageOnEnemy + 1,
        };
      })
      .filter((currentEnemy) => {
        if (currentEnemy.id !== enemy.id) return true;
        return currentEnemy.damageOnEnemy < currentEnemy.health;
      });

    const defeated = enemy.damageOnEnemy + 1 >= enemy.health;

    set({
      enemies: updatedEnemies,
      turn: {
        ...get().turn,
        actionsRemaining: get().turn.actionsRemaining - 1,
      },
      log: [
        ...get().log,
        defeated
          ? `Fight succeeded. ${enemy.name} was defeated. 1 action spent.`
          : `Fight succeeded. Dealt 1 damage to ${enemy.name}. 1 action spent.`,
      ],
    });
  },

  evadeAction: () => {
    const { investigator, locations, enemies, turn, log } = get();

    if (!canSpendInvestigationAction(turn.phase, turn.actionsRemaining)) {
      set({
        log: [
          ...log,
          turn.phase !== "investigation"
            ? "Cannot evade outside the Investigation phase."
            : "Cannot evade. No actions remaining.",
        ],
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
    );

    if (!enemy) {
      set({
        turn: { ...turn, actionsRemaining: turn.actionsRemaining - 1 },
        log: [
          ...log,
          "Took an evade action, but there was no enemy at your location. 1 action spent.",
        ],
      });
      return;
    }

    const testResult = get().runSkillTest(
      "agility",
      enemy.evade,
      `Evade ${enemy.name}`,
    );
    if (!testResult) return;

    if (!testResult.success) {
      set({
        turn: {
          ...get().turn,
          actionsRemaining: get().turn.actionsRemaining - 1,
        },
        log: [
          ...get().log,
          `Evade against ${enemy.name} failed. 1 action spent.`,
        ],
      });
      return;
    }

    const updatedEnemies = get().enemies.map((currentEnemy) => {
      if (currentEnemy.id !== enemy.id) return currentEnemy;
      return {
        ...currentEnemy,
        exhausted: true,
        engagedInvestigatorId: null,
      };
    });

    set({
      enemies: updatedEnemies,
      turn: {
        ...get().turn,
        actionsRemaining: get().turn.actionsRemaining - 1,
      },
      log: [
        ...get().log,
        `Evade succeeded. ${enemy.name} is exhausted and disengaged. 1 action spent.`,
      ],
    });
  },
}));
