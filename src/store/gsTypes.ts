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
} from "../types/game";

import type {
    ScenarioDefinition,
} from "../data/scenarios/scenarioTypes";

import {
    type CampaignState,
} from "../lib/campaignSetup";

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

type PendingEncounterResolution = {
    cardName: string;
    onPass?: EncounterSkillTestOutcome;
    onFail?: EncounterSkillTestOutcome;
} | null;

type PendingChoice = {
    sourceCard: EncounterCard;
    options: {
        id: string;
        label: string;
        effect: ChoiceEffect;
    }[];
} | null;


type EncounterSkillTestOutcome =
    | { kind: "none" }
    | { kind: "damage"; amount: number }
    | { kind: "horror"; amount: number }
    | { kind: "damageByFailure" }
    | { kind: "horrorByFailure" };

type ChoiceEffect =
    | { kind: "doomOnAgenda"; amount: number }
    | { kind: "spawnEnemy"; enemy: Enemy }
    | { kind: "surge" };

type CampaignStoreActions = {
    setPreviousScenarioOutcome: (outcome: string | null) => void;
    setCampaignRandomizedSelection: (
        campaignKey: string,
        slotId: string,
        optionId: string,
    ) => void;
};

type PendingTestResolution =
    | { kind: "investigate"; locationId: string }
    | { kind: "fight"; enemyCode: string }
    | { kind: "evade"; enemyCode: string }
    | null;

type PendingAssetPlay = {
    cardCode: string;
    replacedSlot: string;
    replacementChoices: PlayerCard[];
    selectedReplacementIds: string[];
    requiredHandSlotsToFree?: number;
} | null;

type PendingInteractiveResolution =
    | {
        sourceName: string;
        sourceKind: "parley" | "locationAction";
        currentLocationId: string;
        onSuccess: ParleyEffect | LocationAbilityEffect;
        onFail?: ParleyEffect | LocationAbilityEffect;
    }
    | null;
