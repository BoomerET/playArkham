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

export interface Investigator {
  id: string;
  name: string;
  faction: Faction;
  portrait: string;
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
}

export interface PlayerCard {
  id: string;
  name: string;
  type: "asset" | "event" | "skill" | "treachery" | "enemy" | "location" | "investigator";
  cost?: number;
  icons?: string[];
  text?: string;
}

export interface Location {
  id: string;
  name: string;
  shroud: number;
  clues: number;
  revealed: boolean;
  connections: string[];
  investigatorsHere: string[];
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

export interface SkillTestResult {
  skill: SkillType;
  baseValue: number;
  assetModifier: number;
  modifierDetails: SkillModifierDetail[];
  difficulty: number;
  token: ChaosToken;
  tokenModifier: number;
  finalValue: number;
  success: boolean;
  source: string;
}

export interface GameState {
  investigator: Investigator;
  deck: PlayerCard[];
  hand: PlayerCard[];
  discard: PlayerCard[];
  playArea: PlayerCard[];
  chaosBag: ChaosToken[];
  locations: Location[];
  enemies: Enemy[];
  log: string[];
  turn: TurnState;
  lastSkillTest: SkillTestResult | null;
  draggedCardId: string | null;
}

