export type PassiveSkillModifier = {
  skill: SkillType;
  amount: number;
  appliesTo?: "any" | "investigate" | "fight" | "evade" | "none";
  whileCommitted?: boolean;
};

export type PassiveSkillModifiers = PassiveSkillModifier[];

export type ChaosToken =
  | "skull"
  | "cultist"
  | "tablet"
  | "elderThing"
  | "autoFail"
  | "elderSign"
  | number;

export type Phase = "setup" | "mythos" | "investigation" | "enemy" | "upkeep";

export type SkillType = "willpower" | "intellect" | "combat" | "agility";

export type Faction =
  | "guardian"
  | "seeker"
  | "mystic"
  | "rogue"
  | "survivor"
  | "neutral";

export type ScenarioStatus = "inProgress" | "won" | "lost";

export type InvestigatorSlotType =
  | "Hand"
  | "Arcane"
  | "Ally"
  | "Accessory"
  | "Head"
  | "Body";

export type InvestigatorSlotCounts = Record<InvestigatorSlotType, number>;

export type PlayerCardSlot = InvestigatorSlotType | "Hand x2";

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
  cost?: number;
  icons?: string[];
  text?: string;
  slot?: PlayerCardSlot;
  traits?: string[];
  faction: Faction;
  image?: string;
  exhausted?: boolean;
  counters?: CardCounters;
  isWeakness?: boolean;
  code?: string;
  passiveSkillModifiers?: PassiveSkillModifiers;
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
  text?: string;
  traits?: string[];
  victoryPoints?: number;
  subname?: string;
  code: string;
}

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
}

export interface TurnState {
  round: number;
  phase: Phase;
  actionsRemaining: number;
}

export interface SkillModifierDetail {
  source: string;
  skill: SkillType;
  amount: number;
}

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

export type ScenarioCardKind = "agenda" | "act";

export type SkillTestKind = "investigate" | "fight" | "evade" | "none";

export type LocationDifficultyModifier = {
  amount: number;
  skill?: SkillType;
  appliesTo?: SkillTestKind | "any";
};

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

export interface EnemyDefinition {
  id: string;
  name: string;
  fight: number;
  evade: number;
  health: number;
  damage: number;
  horror: number;
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
  ability?: string[]
  text?: string[];
  damage?: number;
  horror?: number;
  fight?: number;
  evade?: number;
  health?: number;
  set?: string;
  traits?: string[];
  inEncounterDeck?: boolean;
  victoryPoints?: number;
}

export const ENCOUNTER_CARD_CODES = {
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
  SERVANT_OF_FLAME_2: "12138",
  MARK_OF_ELOKOSS: "12137",
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
} as const;
