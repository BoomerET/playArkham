import type {
    PlayerCard,
    GameState,
    Investigator,
    EncounterCard,
    LocationAttachment,
    GameLogKind,
    Phase,
    ChaosToken,
    SkillType,
    SkillTestResult,
    CardCounterType,
    Enemy,
    ParleyEffect,
    LocationAbilityEffect,
    ScenarioStatus,
    LoadedDeck,
} from "../types/game";

import type {
    ScenarioDefinition,
} from "../data/scenarios/scenarioTypes";

import {
    type CampaignState,
} from "../lib/campaignSetup";

import {
    type ScenarioEffectState,
} from "../lib/scenarioEffects";

type Screen = "home" | "game";

export type GameStore = GameState & CampaignStoreActions & {
    screen: Screen;
    availableInvestigators: Investigator[];
    availableScenarios: ScenarioDefinition[];
    selectedInvestigatorId: string;
    selectedScenarioId: string;
    selectedDeckId: string;
    selectedEnemyTargetId: string | null;
    pendingTestResolution: PendingTestResolution;
    pendingAssetPlay: PendingAssetPlay;
    showDeckInspector: boolean;
    showEncounterInspector: boolean;
    encounterDeck: EncounterCard[];
    encounterDiscard: EncounterCard[];
    isMulliganActive: boolean;
    selectedMulliganCardIds: string[];
    pendingInvestigateDifficultyModifier: number;
    pendingFightCombatModifier: number;
    pendingFightDamageBonus: number;
    pendingEncounterResolution: PendingEncounterResolution;
    pendingInteractiveResolution: PendingInteractiveResolution;
    locationAttachments: LocationAttachment[];
    campaignState: CampaignState;
    pendingChoice: PendingChoice;
    setAsideEncounterCards: EncounterCard[];
    discard: PlayerCard[];
    drawPlayerCards: (count: number) => void;
    playPlayerCard: (card: PlayerCard) => void;
    discardFromPlayArea: (card: PlayerCard) => void;
    discardPlayerCards: (cards: PlayerCard[]) => void;
    advanceActByClues: () => void;
    locationAbility: (abilityIndex: number) => void;
    setPreviousScenarioOutcome: (outcome: string | null) => void;
    setCampaignRandomizedSelection: (
        campaignKey: string,
        slotId: string,
        optionId: string,
    ) => void;
    toggleEncounterInspector: () => void;
    togglePendingAssetReplacementChoice: (cardCode: string) => void;
    confirmAssetReplacement: () => void;
    cancelPendingAssetPlay: () => void;
    toggleDeckInspector: () => void;
    closeDeckInspector: () => void;
    setSelectedInvestigator: (investigatorId: string) => void;
    setSelectedScenario: (scenarioId: string) => void;
    setSelectedDeckId: (deckId: string) => void;
    setSelectedEnemyTarget: (enemyCode: string | null) => void;
    setLocationVisible: (locationId: string, visible?: boolean) => void;
    revealLocation: (locationId: string) => void;
    setAgendaProgress: (progress: number) => void;
    setActProgress: (progress: number) => void;
    advanceAgenda: () => void;
    advanceAct: () => void;
    addAgendaProgress: (amount?: number) => void;
    removeAgendaProgress: (amount?: number) => void;
    pushLog: (kind: GameLogKind, text: string) => void;
    setDraggedCardId: (cardCode: string | null) => void;
    startGame: () => Promise<void>;
    returnToHome: () => void;
    setupGame: () => Promise<void>;
    drawCard: () => void;
    drawStartingHand: (count?: number) => void;
    shuffleDeck: () => void;
    discardCard: (cardCode: string) => void;
    playCard: (cardCode: string) => void;
    canPlayCardInSlots: (cardCode: string) => boolean;
    togglePlayAreaCardExhausted: (cardCode: string) => void;
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
    enemyPhaseAttack: () => void;
    beginSkillTest: (
        skill: SkillType,
        difficulty: number,
        source: string,
    ) => void;
    commitSkillCard: (cardCode: string) => void;
    cancelActiveSkillTest: () => void;
    resolveActiveSkillTest: () => SkillTestResult | null;
    incrementPlayAreaCardCounter: (
        cardCode: string,
        counterType: CardCounterType,
    ) => void;
    decrementPlayAreaCardCounter: (
        cardCode: string,
        counterType: CardCounterType,
    ) => void;
    drawEncounterCard: () => EncounterCard | null;
    resolveMythosPhase: () => void;
    resolvePendingChoice: (optionId: string) => void;
    toggleMulliganCardSelection: (cardCode: string) => void;
    confirmMulligan: () => void;
    skipMulligan: () => void;
    discardCardFromHand: (cardCode: string) => void;
    triggerPlayAreaCardAbility: (cardCode: string) => void;
    clearPendingCardAbilityBonuses: () => void;
    shuffleEncounterDeck: () => void;
    discardThreatAreaCard: (cardCode: string) => void;
    discardLocationAttachment: (attachmentId: string) => void;
    randomizeCampaignSelectionsForScenario: (scenarioId: string) => void;
    moveHunterEnemies: () => void;
    engageEnemy: (enemyCode: string) => void;
    parleyAction: (enemyCode?: string) => void;
    resignAction: () => void;
    locationAction: (actionIndex: number) => void;
};

export type PendingEncounterResolution = {
    cardName: string;
    onPass?: EncounterSkillTestOutcome;
    onFail?: EncounterSkillTestOutcome;
} | null;

export type PendingChoice = {
    sourceCard: EncounterCard;
    options: {
        id: string;
        label: string;
        effect: ChoiceEffect;
    }[];
} | null;

export type EncounterSkillTestOutcome =
    | { kind: "none" }
    | { kind: "damage"; amount: number }
    | { kind: "horror"; amount: number }
    | { kind: "damageByFailure" }
    | { kind: "horrorByFailure" };

export type ChoiceEffect =
    | { kind: "doomOnAgenda"; amount: number }
    | { kind: "spawnEnemy"; enemy: Enemy }
    | { kind: "surge" };

export type CampaignStoreActions = {
    setPreviousScenarioOutcome: (outcome: string | null) => void;
    setCampaignRandomizedSelection: (
        campaignKey: string,
        slotId: string,
        optionId: string,
    ) => void;
};

export type PendingTestResolution =
    | { kind: "investigate"; locationId: string }
    | { kind: "fight"; enemyCode: string }
    | { kind: "evade"; enemyCode: string }
    | null;

export type PendingAssetPlay = {
    cardCode: string;
    replacedSlot: string;
    replacementChoices: PlayerCard[];
    selectedReplacementIds: string[];
    requiredHandSlotsToFree?: number;
} | null;

export type PendingInteractiveResolution =
    | {
        sourceName: string;
        sourceKind: "parley" | "locationAction";
        currentLocationId: string;
        onSuccess: ParleyEffect | LocationAbilityEffect;
        onFail?: ParleyEffect | LocationAbilityEffect;
    }
    | null;

export type AdvanceState = ScenarioEffectState & {
    scenarioStatus: ScenarioStatus;
    scenarioResolutionText: string | null;
    scenarioResolutionTitle: string | null;
    scenarioResolutionSubtitle: string | null;
    campaignState: CampaignState;
    campaignOutcomeToSet?: string | null;
};

export type AdvanceStoreSlice = Pick<
    GameStore,
    | "agenda"
    | "act"
    | "locations"
    | "enemies"
    | "log"
    | "playArea"
    | "selectedEnemyTargetId"
    | "scenarioStatus"
    | "scenarioResolutionText"
    | "scenarioResolutionTitle"
    | "scenarioResolutionSubtitle"
    | "campaignState"
    | "locationAttachments"
    | "setAsideEncounterCards"
>;

export type PersistedCampaignSetup = {
    selectedDeckId: string;
    selectedScenarioId: string;
    campaignState: CampaignState;
};

export type ResolvedDeckSource = "arkhamBuild" | "arkhamDb";

export type ResolvedDeckSelection = {
    loadedDeck: LoadedDeck;
    source: ResolvedDeckSource;
};

export type PlayerCardEffect =
    | { kind: "none" }
    | { kind: "gainResources"; amount: number }
    | { kind: "drawCards"; amount: number }
    | { kind: "takeDamage"; amount: number }
    | { kind: "takeHorror"; amount: number };
