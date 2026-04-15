// ============================================================
// Core primitives
// ============================================================

export type ChaosToken =
  | "skull"
  | "cultist"
  | "tablet"
  | "elderThing"
  | "autoFail"
  | "elderSign"
  | number;

export type Faction =
  | "guardian"
  | "seeker"
  | "mystic"
  | "rogue"
  | "survivor"
  | "neutral";

export type Phase =
  | "setup"
  | "mythos"
  | "investigation"
  | "enemy"
  | "upkeep";

export type SkillType =
  | "willpower"
  | "intellect"
  | "combat"
  | "agility";

export type SkillTestKind =
  | "investigate"
  | "fight"
  | "evade"
  | "none";

export type ScenarioStatus =
  | "inProgress"
  | "won"
  | "lost"
  | "resigned";

export type ScenarioCardKind = "agenda" | "act";

export type ScenarioFlagValue = boolean | string | number;
export type ScenarioFlags = Record<string, ScenarioFlagValue>;
export type ScenarioFlagCondition = {
  key: string;
  equals: ScenarioFlagValue;
};


// ============================================================
// Investigator / player card / counters / slots
// ============================================================

export type InvestigatorSlotType =
  | "Hand"
  | "Arcane"
  | "Ally"
  | "Accessory"
  | "Head"
  | "Body";

export type InvestigatorSlotCounts = Record<InvestigatorSlotType, number>;

export type PlayerCardSlot = InvestigatorSlotType | "Hand x2";

export type CardCounterType =
  | "ammo"
  | "charge"
  | "secret"
  | "supply"
  | "resource"
  | "clue"
  | "doom"
  | "damage"
  | "horror";

export type CardCounters = Partial<Record<CardCounterType, number>>;

export type PassiveSkillModifier = {
  skill: SkillType;
  amount: number;
  appliesTo?: "any" | "investigate" | "fight" | "evade" | "none";
  whileCommitted?: boolean;
};

export type PassiveSkillModifiers = PassiveSkillModifier[];

export interface Investigator {
  id: string;
  name: string;
  faction: Faction;
  portrait: string;
  portraitBack?: string;
  portraitHead?: string;
  health: number;
  sanity: number;
  resources: number;
  clues: number;
  damage: number;
  horror: number;
  willpower: number;
  intellect: number;
  combat: number;
  agility: number;
  slotCapacity?: InvestigatorSlotCounts;
  code?: string;
}

export interface PlayerCard {
  instanceId: string;
  name: string;
  type:
  | "asset"
  | "event"
  | "skill"
  | "treachery"
  | "enemy"
  | "location"
  | "investigator";
  faction: Faction;
  cost?: number;
  icons?: string[];
  text?: string;
  slot?: PlayerCardSlot;
  traits?: string[];
  image?: string;
  exhausted?: boolean;
  counters?: CardCounters;
  isWeakness?: boolean;
  code?: string;
  passiveSkillModifiers?: PassiveSkillModifiers;
}


// ============================================================
// Skill tests
// ============================================================

export interface CommittedSkillCard {
  card: PlayerCard;
  matchingIcons: number;
}

export interface ActiveSkillTest {
  skill: SkillType;
  difficulty: number;
  source: string;
  committedCards: CommittedSkillCard[];
}

export interface SkillModifierDetail {
  source: string;
  skill: SkillType;
  amount: number;
}

export interface SkillTestResult {
  skill: SkillType;
  baseValue: number;
  assetModifier: number;
  committedModifier: number;
  modifierDetails: SkillModifierDetail[];
  difficulty: number;
  token: ChaosToken;
  tokenModifier: number;
  finalValue: number;
  success: boolean;
  source: string;
}


// ============================================================
// Interaction / parley / location actions
// ============================================================

export type LocationActionEffect =
  | { kind: "none" }
  | { kind: "engageEnemyFromConnectedLocation" }
  | { kind: "gainResources"; amount: number }
  | { kind: "gainClues"; amount: number }
  | { kind: "discoverLocationClue"; amount: number }
  | { kind: "setPreviousScenarioOutcome"; outcome: string }
  | { kind: "setScenarioFlag"; key: string; value: boolean | string | number }
  | { kind: "trigger"; key: string; value: boolean | string | number };

export type ParleyEffect =
  | { kind: "gainClues"; amount: number }
  | { kind: "gainResources"; amount: number }
  | { kind: "discoverLocationClue"; amount: number }
  | { kind: "setPreviousScenarioOutcome"; outcome: string }
  | { kind: "setScenarioFlag"; key: string; value: boolean | string | number }
  | { kind: "none" };

export type InteractionSkillTestDefinition<TActionEffect> = {
  skill: SkillType;
  difficulty: number;
  onSuccess: TActionEffect;
  onFail?: TActionEffect;
};

export type InteractiveActionDefinition<TActionEffect> = {
  label?: string;
  text: string;
  effect?: TActionEffect;
  skillTest?: InteractionSkillTestDefinition<TActionEffect>;
  requiresFlag?: ScenarioFlagCondition
};

export type LocationActionDefinition =
  InteractiveActionDefinition<LocationActionEffect>;

export type ParleyActionDefinition =
  InteractiveActionDefinition<ParleyEffect>;

export type LocationActionSkillTestDefinition = {
  skill: SkillType;
  difficulty: number;
  onSuccess: LocationActionEffect;
  onFail?: LocationActionEffect;
};

export type ParleySkillTestDefinition = {
  skill: SkillType;
  difficulty: number;
  onSuccess: ParleyEffect;
  onFail?: ParleyEffect;
};

export type CardAbilityTrigger =
  | "action"
  | "doubleAction"
  | "forced"
  | "reaction"
  | "constant"
  | "free"
  | "revelation"
  | "trigger";

export type CardAbilityEffect =
  | { kind: "none" }
  | { kind: "engageEnemyFromConnectedLocation" }
  | { kind: "gainResources"; amount: number }
  | { kind: "gainClues"; amount: number }
  | { kind: "discoverLocationClue"; amount: number }
  | { kind: "setScenarioFlag"; key: string; value: boolean | string | number };

export type CardAbilitySkillTest = {
  skill: SkillType;
  difficulty: number;
  onSuccess: CardAbilityEffect;
  onFail?: CardAbilityEffect;
};

export type CardAbilityDefinition = {
  label: string;
  trigger: CardAbilityTrigger;
  text: string;
  effect?: CardAbilityEffect;
  skillTest?: CardAbilitySkillTest;
  costsActions?: number;
  requiresFlag?: ScenarioFlagCondition;
};


// ============================================================
// Locations / attachments
// ============================================================

export type LocationDifficultyModifier = {
  amount: number;
  skill?: SkillType;
  appliesTo?: SkillTestKind | "any";
};

export interface LocationAttachment {
  id: string;
  cardId: string;
  code?: string;
  name: string;
  text?: string | string[];
  traits?: string[];
  attachedLocationId: string;
  difficultyModifiers?: LocationDifficultyModifier[];
}

export interface GameLocation {
  id: string;
  name: string;
  shroud: number;
  clues: number;
  revealed: boolean;
  isVisible: boolean;
  connections: string[];
  investigatorsHere: string[];
  mapPosition?: {
    x: number;
    y: number;
  };
  text?: string[];
  traits?: string[];
  victoryPoints?: number;
  subname?: string;
  code: string;
  parley?: ParleyActionDefinition;
  actions?: LocationActionDefinition[];
  revealCondition?: ScenarioFlagCondition;
  abilities?: CardAbilityDefinition[];
}


// ============================================================
// Enemies / encounter cards
// ============================================================

export type EnemyDefeatEffect =
  | { kind: "none" }
  | { kind: "horrorToInvestigatorsAtLocation"; amount: number };

export interface Enemy {
  id: string;
  name: string;
  fight: number;
  evade: number;
  health: number;
  damage: number;
  horror: number;
  locationId: string;
  engagedInvestigatorId: string | null;
  exhausted: boolean;
  damageOnEnemy: number;
  ability?: string[];
  onDefeat?: EnemyDefeatEffect;
  parley?: ParleyActionDefinition;
}

export interface EnemySpawn {
  enemyId: string;
  instanceId?: string;
  locationId: string;
  engagedInvestigatorId?: string | null;
  exhausted?: boolean;
  damageOnEnemy?: number;
}

export interface EncounterCard {
  id: string;
  code: string;
  name: string;
  subname?: string;
  type: "enemy" | "treachery" | "ally" | "weakness";
  ability?: string[];
  text?: string[];
  damage?: number;
  horror?: number;
  fight?: number;
  evade?: number;
  health?: number;
  set?: string;
  traits?: string[];
  victoryPoints?: number;
  parley?: ParleyActionDefinition;
}


// ============================================================
// Scenario / log / turn state
// ============================================================

export interface TurnState {
  round: number;
  phase: Phase;
  actionsRemaining: number;
}

export interface ScenarioCardState {
  id: string;
  kind: ScenarioCardKind;
  sequence: string;
  title: string;
  text: string;
  progress: number;
  threshold: number;
  thresholdLabel: string;
  code?: string;
}

export type GameLogKind =
  | "system"
  | "scenario"
  | "player"
  | "enemy"
  | "combat"
  | "skill-test";

export interface GameLogEntry {
  id: string;
  kind: GameLogKind;
  text: string;
  createdAt?: number;
}

export type GameLogItem = string | GameLogEntry;


// ============================================================
// Root game state
// ============================================================

export interface GameState {
  investigator: Investigator;
  deck: PlayerCard[];
  hand: PlayerCard[];
  discard: PlayerCard[];
  playArea: PlayerCard[];
  chaosBag: ChaosToken[];
  locations: GameLocation[];
  enemies: Enemy[];
  agenda: ScenarioCardState | null;
  act: ScenarioCardState | null;
  scenarioStatus: ScenarioStatus;
  scenarioResolutionTitle: string | null;
  scenarioResolutionSubtitle: string | null;
  scenarioResolutionText: string | null;
  log: GameLogItem[];
  turn: TurnState;
  lastSkillTest: SkillTestResult | null;
  activeSkillTest: ActiveSkillTest | null;
  draggedCardId: string | null;
  encounterDeck: EncounterCard[];
  encounterDiscard: EncounterCard[];
  threatArea: EncounterCard[];
  lastEncounterCard: EncounterCard | null;
  locationAttachments: LocationAttachment[];
}


// ============================================================
// Encounter card codes
// ============================================================

export const ENCOUNTER_CARD_CODES = {
  DAVES_TEST: "14001",
  SERVANT_OF_FLAME: "12114",
  CANTOR_OF_FLAME: "12121",
  HELLHOUND: "12122",
  BYSTANDER: "12123",
  COSMIC_EVILS: "12124",
  UNSPEAKABLE_TRUTHS: "12125",
  FORBIDDEN_SECRETS: "12126",
  EXTRAPLANAR_VISIONS: "12127",
  WILD_COMPULSION: "12128",
  FIRE: "12129",
  NOXIOUS_SMOKE: "12130",
  MUTATED: "12131",
  MUTATED_EXPERIMENT: "12132",
  DR_HENRY_ARMITAGE: "12133",
  MARK_OF_ELOKOSS: "12137",
  SERVANT_OF_FLAME_2: "12138",
  DAVID_RENFIELD: "12139",
  CORNELIA_AKELY: "12140",
  NAOMI_O_BANNION: "12141",
  SGT_EARL_MONROE: "12142",
  ABIBAIL_FOREMAN: "12143",
  MARGARET_LUI: "12144",
  ARCANE_LOCK: "12157",
  DOWNPOUR: "12158",
  FLASH_FLOOD: "12159",
  RAISING_SUSPICIONS: "12160",
  RED_HERRING: "12161",
  BAT_HORROR: "12162",
  AERIAL_PURSUIT: "12163",
  ROGUE_GANGSTER: "12164",
  CROSSFIRE: "12165",
  WHIPPOORWILL: "12166",
  EAGER_FOR_DEATH: "12167",
  SERVANT_OF_FLAME_3: "12180",
  ELOKOSS_A: "12179a",
  ELOKOSS_B: "12179b",
  HERALD_OF_FLAME: "12178",
  QUEENS_KNIGHT: "12177",

} as const;
