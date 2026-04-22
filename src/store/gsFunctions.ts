// Exported functions for gameStore.ts
import type {
    Enemy,
    EncounterCard,
    Investigator,
    CardAbilityEvent,
    GameState,
    GameLogKind,
    ScenarioCardState,
    CardAbilityDefinition,
    CardAbilityEffect,
    LocationAbilityEffect,
    GameLocation,
    ParleyEffect,
    InteractiveActionDefinition,
    SkillType,
    LocationAttachment,
    ScenarioStatus,
    PlayerCard,
    CardCounterType,
} from "../types/game";

import type {
    AdvanceStoreSlice,
    PersistedCampaignSetup,
    AdvanceState,
} from "./gsTypes";

import {
    CAMPAIGN_SETUP_STORAGE_KEY,
} from "./gsConst";

import {
    findCurrentLocation,
} from "../lib/gameStateHelpers";

import type {
    CampaignState
} from "../lib/campaignSetup";

import {
    resolveLocationAbilityEffect,
} from "./locationAbilities";

import {
    applyConditionalLocationVisibility,
} from "./locationVisibility";

import type {
    ScenarioCardDefinition,
    ScenarioDefinition,
} from "../data/scenarios/scenarioTypes";

import {
    buildScenarioCardState,
} from "../lib/scenarioCards";

import {
    applyScenarioAgendaAdvanceEffects,
    applyScenarioActAdvanceEffects,
} from "../lib/scenarioEffects";

import {
    defaultScenarioId,
} from "../data/scenarios";

import {
    encounterCards,
} from "../data/encounterCards";

import {
    buildEncounterDeckFromCodes,
} from "../lib/buildEncounterDeck";

export function readyEnemies(enemies: Enemy[]): Enemy[] {
    return enemies.map((enemy) =>
        enemy.exhausted
            ? { ...enemy, exhausted: false }
            : enemy,
    );
}

export function takeSetAsideEncounterCardByCode(args: {
    setAsideEncounterCards: EncounterCard[];
    cardCode: string;
}): {
    card: EncounterCard | null;
    remainingSetAsideEncounterCards: EncounterCard[];
} {
    const { setAsideEncounterCards, cardCode } = args;

    const index = setAsideEncounterCards.findIndex(
        (card) => card.code === cardCode,
    );

    if (index === -1) {
        return {
            card: null,
            remainingSetAsideEncounterCards: setAsideEncounterCards,
        };
    }

    return {
        card: setAsideEncounterCards[index],
        remainingSetAsideEncounterCards: [
            ...setAsideEncounterCards.slice(0, index),
            ...setAsideEncounterCards.slice(index + 1),
        ],
    };
}

export function hasReadyEngagedEnemy(args: {
    investigator: Investigator;
    enemies: Enemy[];
}): boolean {
    const { investigator, enemies } = args;

    return enemies.some(
        (enemy) =>
            enemy.engagedInvestigatorId === investigator.id &&
            !enemy.exhausted,
    );
}

export function removeOneEncounterCardByCode(
    encounterDeck: EncounterCard[],
    code: string,
): EncounterCard[] {
    const index = encounterDeck.findIndex((card) => card.code === code);

    if (index === -1) {
        return encounterDeck;
    }

    return [
        ...encounterDeck.slice(0, index),
        ...encounterDeck.slice(index + 1),
    ];
}

export function emitEnemyEvent(args: {
    event: CardAbilityEvent;
    enemyCode: string;
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
}): {
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
    logEntries: ReturnType<typeof createLogEntry>[];
} {
    const {
        event,
        enemyCode,
        investigator,
        locations,
        enemies,
        campaignState,
    } = args;

    const enemy = enemies.find((entry) => entry.id === enemyCode);

    if (!enemy) {
        return {
            investigator,
            locations,
            enemies,
            campaignState,
            logEntries: [],
        };
    }

    return executeForcedCardAbilities({
        sourceName: enemy.name,
        sourceAbilities: enemy.abilities,
        event,
        currentLocationId: enemy.locationId,
        investigator,
        locations,
        enemies,
        campaignState,
    });
}

export function emitCurrentLocationEvent(args: {
    event: CardAbilityEvent;
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
}): {
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
    logEntries: ReturnType<typeof createLogEntry>[];
} {
    const { investigator, locations } = args;
    const currentLocation = findCurrentLocation(locations, investigator.id);

    if (!currentLocation) {
        return {
            investigator: args.investigator,
            locations: args.locations,
            enemies: args.enemies,
            campaignState: args.campaignState,
            logEntries: [],
        };
    }

    return emitLocationEvent({
        ...args,
        locationId: currentLocation.id,
    });
}

export function emitEngagedEnemyEvent(args: {
    event: CardAbilityEvent;
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
}): {
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
    logEntries: ReturnType<typeof createLogEntry>[];
} {
    const {
        event,
        investigator,
        locations,
        enemies,
        campaignState,
    } = args;

    let updatedInvestigator = investigator;
    let updatedLocations = locations;
    let updatedEnemies = enemies;
    let updatedCampaignState = campaignState;
    const logEntries: ReturnType<typeof createLogEntry>[] = [];

    const engagedEnemies = enemies.filter(
        (enemy) => enemy.engagedInvestigatorId === investigator.id,
    );

    for (const enemy of engagedEnemies) {
        const resolution = emitEnemyEvent({
            event,
            enemyCode: enemy.id,
            investigator: updatedInvestigator,
            locations: updatedLocations,
            enemies: updatedEnemies,
            campaignState: updatedCampaignState,
        });

        updatedInvestigator = resolution.investigator;
        updatedLocations = resolution.locations;
        updatedEnemies = resolution.enemies;
        updatedCampaignState = resolution.campaignState;
        logEntries.push(...resolution.logEntries);
    }

    return {
        investigator: updatedInvestigator,
        locations: updatedLocations,
        enemies: updatedEnemies,
        campaignState: updatedCampaignState,
        logEntries,
    };
}

export function emitScenarioEvent(args: {
    event: CardAbilityEvent;
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
    agenda: ScenarioCardState | null;
    act: ScenarioCardState | null;
}): {
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
    logEntries: ReturnType<typeof createLogEntry>[];
} {
    const {
        event,
        investigator,
        locations,
        enemies,
        campaignState,
        agenda,
        act,
    } = args;

    let updatedInvestigator = investigator;
    let updatedLocations = locations;
    let updatedEnemies = enemies;
    let updatedCampaignState = campaignState;
    const logEntries: ReturnType<typeof createLogEntry>[] = [];

    const currentLocationId =
        findCurrentLocation(updatedLocations, updatedInvestigator.id)?.id ?? "";

    const scenarioCards = [agenda, act].filter(
        (card): card is ScenarioCardState => card !== null,
    );

    for (const card of scenarioCards) {
        const sourceName =
            card.kind === "agenda"
                ? `Agenda ${card.sequence}: ${card.title}`
                : `Act ${card.sequence}: ${card.title}`;

        const resolution = executeForcedCardAbilities({
            sourceName,
            sourceAbilities: card.abilities,
            event,
            currentLocationId,
            investigator: updatedInvestigator,
            locations: updatedLocations,
            enemies: updatedEnemies,
            campaignState: updatedCampaignState,
        });

        updatedInvestigator = resolution.investigator;
        updatedLocations = resolution.locations;
        updatedEnemies = resolution.enemies;
        updatedCampaignState = resolution.campaignState;
        logEntries.push(...resolution.logEntries);
    }

    return {
        investigator: updatedInvestigator,
        locations: updatedLocations,
        enemies: updatedEnemies,
        campaignState: updatedCampaignState,
        logEntries,
    };
}

export function resolveAttackOfOpportunity(args: {
    investigator: Investigator;
    enemies: Enemy[];
    logPrefix?: string;
}): {
    investigator: Investigator;
    enemies: Enemy[];
    logEntries: ReturnType<typeof createLogEntry>[];
} {
    const { investigator, enemies, logPrefix } = args;

    let updatedInvestigator = investigator;
    const logEntries: ReturnType<typeof createLogEntry>[] = [];

    const attackingEnemies = enemies.filter(
        (enemy) =>
            enemy.engagedInvestigatorId === investigator.id &&
            !enemy.exhausted,
    );

    for (const enemy of attackingEnemies) {
        updatedInvestigator = {
            ...updatedInvestigator,
            damage: updatedInvestigator.damage + enemy.damage,
            horror: updatedInvestigator.horror + enemy.horror,
        };

        logEntries.push(
            createLogEntry(
                "enemy",
                logPrefix
                    ? `${enemy.name} makes an attack of opportunity after ${logPrefix}. You take ${enemy.damage} damage and ${enemy.horror} horror.`
                    : `${enemy.name} makes an attack of opportunity. You take ${enemy.damage} damage and ${enemy.horror} horror.`,
            ),
        );
    }

    return {
        investigator: updatedInvestigator,
        enemies,
        logEntries,
    };
}



export function resolveEnemyDefeatedTriggers(args: {
    enemyCode: string;
    locationId: string;
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
}): {
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
    logEntries: ReturnType<typeof createLogEntry>[];
} {
    const {
        enemyCode,
        locationId,
        investigator,
        locations,
        enemies,
        campaignState,
    } = args;

    const locationResolution = emitLocationEvent({
        event: "enemyDefeated",
        locationId,
        investigator,
        locations,
        enemies,
        campaignState,
    });

    const enemyResolution = emitEnemyEvent({
        event: "enemyDefeated",
        enemyCode,
        investigator: locationResolution.investigator,
        locations: locationResolution.locations,
        enemies: locationResolution.enemies,
        campaignState: locationResolution.campaignState,
    });

    return {
        investigator: enemyResolution.investigator,
        locations: enemyResolution.locations,
        enemies: enemyResolution.enemies,
        campaignState: enemyResolution.campaignState,
        logEntries: [
            ...locationResolution.logEntries,
            ...enemyResolution.logEntries,
        ],
    };
}

export function resolveEnemyAttacks(args: {
    investigator: Investigator;
    enemies: Enemy[];
}): {
    investigator: Investigator;
    enemies: Enemy[];
    logEntries: ReturnType<typeof createLogEntry>[];
} {
    const { investigator, enemies } = args;

    let updatedInvestigator = investigator;
    const updatedEnemies = enemies.map((enemy) => {
        const isEngaged = enemy.engagedInvestigatorId === investigator.id;

        if (!isEngaged) return enemy;
        if (enemy.exhausted) return enemy;
        if (enemyHasAloof(enemy) && !isEngaged) return enemy;

        updatedInvestigator = {
            ...updatedInvestigator,
            damage: updatedInvestigator.damage + enemy.damage,
            horror: updatedInvestigator.horror + enemy.horror,
        };

        return enemy;
    });

    const logEntries = enemies
        .filter((enemy) => enemy.engagedInvestigatorId === investigator.id)
        .map((enemy) =>
            createLogEntry(
                "enemy",
                `${enemy.name} attacks! You take ${enemy.damage} damage and ${enemy.horror} horror.`,
            ),
        );

    return {
        investigator: updatedInvestigator,
        enemies: updatedEnemies,
        logEntries,
    };
}

export function emitLocationEvent(args: {
    event: CardAbilityEvent;
    locationId: string;
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
}) {
    const { event, locationId, investigator, locations, enemies, campaignState } = args;

    const location = locations.find((entry) => entry.id === locationId);

    if (!location) {
        return {
            investigator,
            locations,
            enemies,
            campaignState,
            logEntries: [],
        };
    }

    return executeForcedCardAbilities({
        sourceName: location.name,
        sourceAbilities: location.abilities,
        event,
        currentLocationId: location.id,
        investigator,
        locations,
        enemies,
        campaignState,
    });
}

export function emitThreatAreaEvent(args: {
    event: CardAbilityEvent;
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    threatArea: GameState["threatArea"];
    campaignState: CampaignState;
}): {
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
    logEntries: ReturnType<typeof createLogEntry>[];
} {
    const {
        event,
        investigator,
        locations,
        enemies,
        threatArea,
        campaignState,
    } = args;

    const currentLocation = findCurrentLocation(locations, investigator.id);

    if (!currentLocation) {
        return {
            investigator,
            locations,
            enemies,
            campaignState,
            logEntries: [],
        };
    }

    let updatedInvestigator = investigator;
    let updatedLocations = locations;
    let updatedEnemies = enemies;
    let updatedCampaignState = campaignState;
    const logEntries: ReturnType<typeof createLogEntry>[] = [];

    for (const card of threatArea) {
        const resolution = executeForcedCardAbilities({
            sourceName: card.name,
            sourceAbilities: card.abilities,
            event,
            currentLocationId: currentLocation.id,
            investigator: updatedInvestigator,
            locations: updatedLocations,
            enemies: updatedEnemies,
            campaignState: updatedCampaignState,
        });

        updatedInvestigator = resolution.investigator;
        updatedLocations = resolution.locations;
        updatedEnemies = resolution.enemies;
        updatedCampaignState = resolution.campaignState;
        logEntries.push(...resolution.logEntries);
    }

    return {
        investigator: updatedInvestigator,
        locations: updatedLocations,
        enemies: updatedEnemies,
        campaignState: updatedCampaignState,
        logEntries,
    };
}

export function executeForcedCardAbilities(args: {
    sourceName: string;
    sourceAbilities: CardAbilityDefinition[] | undefined;
    event: CardAbilityEvent;
    currentLocationId: string;
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
}): {
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
    logEntries: ReturnType<typeof createLogEntry>[];
} {
    const {
        sourceName,
        sourceAbilities,
        event,
        currentLocationId,
        investigator,
        locations,
        enemies,
        campaignState,
    } = args;

    const abilities = getMatchingForcedAbilities({
        abilities: sourceAbilities,
        event,
        campaignState,
    });

    let updatedInvestigator = investigator;
    let updatedLocations = locations;
    let updatedEnemies = enemies;
    let updatedCampaignState = campaignState;
    const logEntries: ReturnType<typeof createLogEntry>[] = [];

    for (const ability of abilities) {
        logEntries.push(
            createLogEntry("scenario", `${sourceName}: ${ability.text}`),
        );

        if (!ability.effect) {
            continue;
        }

        const resolution = resolveImmediateAbilityEffect({
            effect: ability.effect,
            investigator: updatedInvestigator,
            currentLocationId,
            locations: updatedLocations,
            enemies: updatedEnemies,
            campaignState: updatedCampaignState,
        });

        updatedInvestigator = resolution.investigator;
        updatedLocations = resolution.locations;
        updatedEnemies = resolution.enemies;
        updatedCampaignState = resolution.campaignState;
        logEntries.push(...resolution.logEntries);
    }

    return {
        investigator: updatedInvestigator,
        locations: updatedLocations,
        enemies: updatedEnemies,
        campaignState: updatedCampaignState,
        logEntries,
    };
}

export function resolveEnemyEngagedTriggers(args: {
    enemyCode: string;
    locationId: string;
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
}): {
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
    logEntries: ReturnType<typeof createLogEntry>[];
} {
    const {
        enemyCode,
        locationId,
        investigator,
        locations,
        enemies,
        campaignState,
    } = args;

    const locationResolution = emitLocationEvent({
        event: "enemyEngaged",
        locationId,
        investigator,
        locations,
        enemies,
        campaignState,
    });

    const enemyResolution = emitEnemyEvent({
        event: "enemyEngaged",
        enemyCode,
        investigator: locationResolution.investigator,
        locations: locationResolution.locations,
        enemies: locationResolution.enemies,
        campaignState: locationResolution.campaignState,
    });

    return {
        investigator: enemyResolution.investigator,
        locations: enemyResolution.locations,
        enemies: enemyResolution.enemies,
        campaignState: enemyResolution.campaignState,
        logEntries: [
            ...locationResolution.logEntries,
            ...enemyResolution.logEntries,
        ],
    };
}

export function enemyHasRetaliate(enemy: Enemy | undefined): boolean {
    return enemy?.ability?.includes("Retaliate") ?? false;
}

export function enemyHasHunter(enemy: Enemy | undefined): boolean {
    return enemy?.ability?.includes("Hunter") ?? false;
}

export function enemyHasAloof(enemy: Enemy | undefined): boolean {
    return enemy?.ability?.includes("Aloof") ?? false;
}

export function getMatchingForcedAbilities(args: {
    abilities: CardAbilityDefinition[] | undefined;
    event: CardAbilityEvent;
    campaignState: CampaignState;
}): CardAbilityDefinition[] {
    const { abilities, event, campaignState } = args;

    return (abilities ?? []).filter((ability) => {
        if (ability.trigger !== "forced") {
            return false;
        }

        if (ability.event !== event) {
            return false;
        }

        if (
            ability.requiresFlag &&
            campaignState.scenarioFlags[ability.requiresFlag.key] !==
            ability.requiresFlag.equals
        ) {
            return false;
        }

        return true;
    });
}

export function resolveImmediateAbilityEffect(args: {
    effect: CardAbilityEffect;
    investigator: Investigator;
    currentLocationId: string;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
}): {
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
    logEntries: ReturnType<typeof createLogEntry>[];
} {
    return resolveLocationAbilityEffect({
        effect: args.effect as LocationAbilityEffect,
        investigator: args.investigator,
        currentLocationId: args.currentLocationId,
        locations: args.locations,
        enemies: args.enemies,
        campaignState: args.campaignState,
    });
}

export function addLocationToVictoryDisplayIfCleared(args: {
    locationId: string;
    locations: GameState["locations"];
    clearedVictoryLocations: GameLocation[];
}): {
    clearedVictoryLocations: GameLocation[];
    logEntries: ReturnType<typeof createLogEntry>[];
} {
    const { locationId, locations, clearedVictoryLocations } = args;

    const location = locations.find((entry) => entry.id === locationId);

    if (!location) {
        return {
            clearedVictoryLocations,
            logEntries: [],
        };
    }

    if ((location.victoryPoints ?? 0) <= 0) {
        return {
            clearedVictoryLocations,
            logEntries: [],
        };
    }

    if (location.clues > 0) {
        return {
            clearedVictoryLocations,
            logEntries: [],
        };
    }

    if (clearedVictoryLocations.some((entry) => entry.id === location.id)) {
        return {
            clearedVictoryLocations,
            logEntries: [],
        };
    }

    return {
        clearedVictoryLocations: [...clearedVictoryLocations, location],
        logEntries: [
            createLogEntry(
                "scenario",
                `${location.name} was added to the victory display worth ${location.victoryPoints} victory point${location.victoryPoints === 1 ? "" : "s"}.`,
            ),
        ],
    };
}

export function resolveEnemyDefeatEffect(args: {
    enemy: Enemy;
    investigator: Investigator;
}): {
    investigator: Investigator;
    logEntries: GameState["log"];
} {
    const { enemy, investigator } = args;

    if (!enemy.onDefeat || enemy.onDefeat.kind === "none") {
        return {
            investigator,
            logEntries: [],
        };
    }

    if (enemy.onDefeat.kind === "horrorToInvestigatorsAtLocation") {
        return {
            investigator: {
                ...investigator,
                horror: investigator.horror + enemy.onDefeat.amount,
            },
            logEntries: [
                createLogEntry(
                    "enemy",
                    `${enemy.name}: when defeated, took ${enemy.onDefeat.amount} horror.`,
                ),
            ],
        };
    }

    return {
        investigator,
        logEntries: [],
    };
}

export function resolveParleyEffect(args: {
    effect: ParleyEffect;
    investigator: Investigator;
    currentLocationId: string;
    locations: GameState["locations"];
    campaignState: CampaignState;
}): {
    investigator: Investigator;
    locations: GameState["locations"];
    campaignState: CampaignState;
    logEntries: ReturnType<typeof createLogEntry>[];
} {
    const { effect, investigator, currentLocationId, locations, campaignState } = args;

    if (effect.kind === "none") {
        return {
            investigator,
            locations,
            campaignState,
            logEntries: [],
        };
    }

    if (effect.kind === "gainClues") {
        return {
            investigator: {
                ...investigator,
                clues: investigator.clues + effect.amount,
            },
            locations,
            campaignState,
            logEntries: [
                createLogEntry(
                    "scenario",
                    `Parley succeeded. Gained ${effect.amount} clue${effect.amount === 1 ? "" : "s"}.`,
                ),
            ],
        };
    }

    if (effect.kind === "gainResources") {
        return {
            investigator: {
                ...investigator,
                resources: investigator.resources + effect.amount,
            },
            locations,
            campaignState,
            logEntries: [
                createLogEntry(
                    "scenario",
                    `Parley succeeded. Gained ${effect.amount} resource${effect.amount === 1 ? "" : "s"}.`,
                ),
            ],
        };
    }

    if (effect.kind === "discoverLocationClue") {
        const location = locations.find((entry) => entry.id === currentLocationId);
        const cluesToDiscover = Math.min(effect.amount, location?.clues ?? 0);

        return {
            investigator: {
                ...investigator,
                clues: investigator.clues + cluesToDiscover,
            },
            locations: locations.map((entry) =>
                entry.id === currentLocationId
                    ? { ...entry, clues: Math.max(0, entry.clues - cluesToDiscover) }
                    : entry,
            ),
            campaignState,
            logEntries: [
                createLogEntry(
                    "scenario",
                    `Parley succeeded. Discovered ${cluesToDiscover} clue${cluesToDiscover === 1 ? "" : "s"} at this location.`,
                ),
            ],
        };
    }
    if (effect.kind === "setScenarioFlag") {
        const nextCampaignState = {
            ...campaignState,
            scenarioFlags: {
                ...campaignState.scenarioFlags,
                [effect.key]: effect.value,
            },
        };

        return {
            investigator,
            locations: applyConditionalLocationVisibility({
                locations,
                campaignState: nextCampaignState,
            }),
            campaignState: nextCampaignState,
            logEntries: [
                createLogEntry(
                    "scenario",
                    `Set scenario flag "${effect.key}" to ${String(effect.value)}.`,
                ),
            ],
        };
    }

    if (effect.kind === "setPreviousScenarioOutcome") {
        return {
            investigator,
            locations,
            campaignState: {
                ...campaignState,
                previousScenarioOutcome: effect.outcome,
            },
            logEntries: [
                createLogEntry(
                    "scenario",
                    `Parley changed the campaign outcome to "${effect.outcome}".`,
                ),
            ],
        };
    }

    return {
        investigator,
        locations,
        campaignState,
        logEntries: [],
    };
}

export function beginInteractiveAction(args: {
    action: InteractiveActionDefinition<ParleyEffect | LocationAbilityEffect>;
    sourceName: string;
    sourceKind: "parley" | "locationAction";
    currentLocationId: string;
    turn: GameState["turn"];
    log: GameState["log"];
}):
    | {
        kind: "skillTest";
        pending: {
            sourceName: string;
            sourceKind: "parley" | "locationAction";
            currentLocationId: string;
            onSuccess: ParleyEffect | LocationAbilityEffect;
            onFail?: ParleyEffect | LocationAbilityEffect;
        };
        turn: GameState["turn"];
        log: GameState["log"];
        skill: SkillType;
        difficulty: number;
        skillTestSource: string;
    }
    | {
        kind: "immediate";
        effect: ParleyEffect | LocationAbilityEffect;
        turn: GameState["turn"];
        log: GameState["log"];
    }
    | {
        kind: "invalid";
        message: string;
    } {
    const { action, sourceName, sourceKind, currentLocationId, turn, log } = args;

    if (action.skillTest) {
        return {
            kind: "skillTest",
            pending: {
                sourceName,
                sourceKind,
                currentLocationId,
                onSuccess: action.skillTest.onSuccess,
                onFail: action.skillTest.onFail,
            },
            turn: {
                ...turn,
                actionsRemaining: turn.actionsRemaining - 1,
            },
            log: [...log, createLogEntry("scenario", action.text)],
            skill: action.skillTest.skill,
            difficulty: action.skillTest.difficulty,
            skillTestSource: action.label ?? sourceName,
        };
    }

    if (action.effect) {
        return {
            kind: "immediate",
            effect: action.effect,
            turn: {
                ...turn,
                actionsRemaining: turn.actionsRemaining - 1,
            },
            log: [...log, createLogEntry("scenario", action.text)],
        };
    }

    return {
        kind: "invalid",
        message: "This action has no effect configured.",
    };
}

export function discardThreatAreaCardByCode(args: {
    threatArea: EncounterCard[];
    cardCode: string;
    encounterDiscard: EncounterCard[];
}): {
    threatArea: EncounterCard[];
    encounterDiscard: EncounterCard[];
    discardedCard: EncounterCard | null;
} {
    const { threatArea, cardCode, encounterDiscard } = args;

    const index = threatArea.findIndex((card) => card.code === cardCode);

    if (index === -1) {
        return {
            threatArea,
            encounterDiscard,
            discardedCard: null,
        };
    }

    const discardedCard = threatArea[index];

    return {
        threatArea: [
            ...threatArea.slice(0, index),
            ...threatArea.slice(index + 1),
        ],
        encounterDiscard: [...encounterDiscard, discardedCard],
        discardedCard,
    };
}

export function discardLocationAttachmentByCode(args: {
    locationAttachments: LocationAttachment[];
    cardCode: string;
    encounterDiscard: EncounterCard[];
    locationId?: string;
}): {
    locationAttachments: LocationAttachment[];
    encounterDiscard: EncounterCard[];
    discardedAttachment: LocationAttachment | null;
} {
    const { locationAttachments, cardCode, encounterDiscard, locationId } = args;

    const index = locationAttachments.findIndex(
        (attachment) =>
            attachment.code === cardCode &&
            (locationId == null || attachment.attachedLocationId === locationId),
    );

    if (index === -1) {
        return {
            locationAttachments,
            encounterDiscard,
            discardedAttachment: null,
        };
    }

    const discardedAttachment = locationAttachments[index];

    const discardedCard: EncounterCard = {
        id: discardedAttachment.id,
        code: discardedAttachment.code ?? "",
        name: discardedAttachment.name,
        type: "treachery",
        text:
            discardedAttachment.text == null
                ? undefined
                : Array.isArray(discardedAttachment.text)
                    ? discardedAttachment.text
                    : [discardedAttachment.text],
        traits: discardedAttachment.traits,
    };

    return {
        locationAttachments: [
            ...locationAttachments.slice(0, index),
            ...locationAttachments.slice(index + 1),
        ],
        encounterDiscard: [...encounterDiscard, discardedCard],
        discardedAttachment,
    };
}

export function discardEnemyFromPlay(args: {
    enemies: Enemy[];
    encounterDiscard: EncounterCard[];
    investigatorId: string;
    enemyCode?: string;
    enemyId?: string;
    onlyIfEngaged?: boolean;
    locationId?: string;
}): {
    enemies: Enemy[];
    encounterDiscard: EncounterCard[];
    discardedEnemy: Enemy | null;
} {
    const {
        enemies,
        encounterDiscard,
        investigatorId,
        enemyCode,
        enemyId,
        onlyIfEngaged,
        locationId,
    } = args;

    const index = enemies.findIndex((enemy) => {
        if (enemyId && enemy.id !== enemyId) {
            return false;
        }

        if (enemyCode && enemy.code !== enemyCode) {
            return false;
        }

        if (onlyIfEngaged && enemy.engagedInvestigatorId !== investigatorId) {
            return false;
        }

        if (locationId && enemy.locationId !== locationId) {
            return false;
        }

        return true;
    });

    if (index === -1) {
        return {
            enemies,
            encounterDiscard,
            discardedEnemy: null,
        };
    }

    const discardedEnemy = enemies[index];

    const discardedCard: EncounterCard = {
        id: discardedEnemy.id,
        code: discardedEnemy.code,
        name: discardedEnemy.name,
        type: "enemy",
        ability: discardedEnemy.ability,
        abilities: discardedEnemy.abilities,
        text: discardedEnemy.text,
        damage: discardedEnemy.damage,
        horror: discardedEnemy.horror,
        fight: discardedEnemy.fight,
        evade: discardedEnemy.evade,
        health: discardedEnemy.health,
        set: discardedEnemy.set,
        traits: discardedEnemy.traits,
        victoryPoints: discardedEnemy.victoryPoints,
        parley: discardedEnemy.parley,
    };

    return {
        enemies: [
            ...enemies.slice(0, index),
            ...enemies.slice(index + 1),
        ],
        encounterDiscard: [...encounterDiscard, discardedCard],
        discardedEnemy,
    };
}

export function getNextLocationTowardTarget(
    locations: GameState["locations"],
    startLocationId: string,
    targetLocationId: string,
): string | null {
    if (startLocationId === targetLocationId) {
        return targetLocationId;
    }

    const visited = new Set<string>([startLocationId]);
    const queue: Array<{ locationId: string; firstStep: string | null }> = [
        { locationId: startLocationId, firstStep: null },
    ];

    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) {
            continue;
        }

        const location = locations.find((entry) => entry.id === current.locationId);
        if (!location) {
            continue;
        }

        for (const connectedId of location.connections) {
            if (visited.has(connectedId)) {
                continue;
            }

            const firstStep = current.firstStep ?? connectedId;

            if (connectedId === targetLocationId) {
                return firstStep;
            }

            visited.add(connectedId);
            queue.push({
                locationId: connectedId,
                firstStep,
            });
        }
    }

    return null;
}

export function advanceActState(
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
            playArea: state.playArea,
            log: state.log,
            selectedEnemyTargetId: state.selectedEnemyTargetId,
            scenarioStatus: state.scenarioStatus,
            scenarioResolutionText: state.scenarioResolutionText,
            scenarioResolutionTitle: state.scenarioResolutionTitle,
            scenarioResolutionSubtitle: state.scenarioResolutionSubtitle,
            campaignState: state.campaignState,
            locationAttachments: state.locationAttachments,
            setAsideEncounterCards: state.setAsideEncounterCards,
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
            playArea: state.playArea,
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
            campaignState: state.campaignState,
            locationAttachments: state.locationAttachments,
            setAsideEncounterCards: state.setAsideEncounterCards,
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
            playArea: state.playArea,
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
            campaignState: state.campaignState,
            locationAttachments: state.locationAttachments,
            setAsideEncounterCards: state.setAsideEncounterCards,
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

    const updatedCampaignState =
        effectResult.campaignOutcomeToSet != null
            ? {
                ...state.campaignState,
                previousScenarioOutcome: effectResult.campaignOutcomeToSet,
            }
            : state.campaignState;

    let result: AdvanceStoreSlice = {
        agenda: effectResult.agenda,
        act: effectResult.act,
        locations: effectResult.locations,
        enemies: effectResult.enemies,
        playArea: [
            ...state.playArea,
            ...(effectResult.grantedPlayerCards ?? []),
        ],
        log: effectResult.log,
        selectedEnemyTargetId: effectResult.selectedEnemyTargetId,
        scenarioStatus: state.scenarioStatus,
        scenarioResolutionText: state.scenarioResolutionText,
        scenarioResolutionTitle: state.scenarioResolutionTitle,
        scenarioResolutionSubtitle: state.scenarioResolutionSubtitle,
        campaignState: updatedCampaignState,
        locationAttachments: effectResult.locationAttachments,
        setAsideEncounterCards: effectResult.setAsideEncounterCards,
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
                campaignState: result.campaignState,
                campaignOutcomeToSet: effectResult.campaignOutcomeToSet ?? null,
                locationAttachments: result.locationAttachments,
                setAsideEncounterCards: result.setAsideEncounterCards,
            },
            false,
        );
    }

    return result;
}

export function applyAdvanceOutcome(
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

export function advanceAgendaState(
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
            playArea: state.playArea,
            log: state.log,
            selectedEnemyTargetId: state.selectedEnemyTargetId,
            scenarioStatus: state.scenarioStatus,
            scenarioResolutionText: state.scenarioResolutionText,
            scenarioResolutionTitle: state.scenarioResolutionTitle,
            scenarioResolutionSubtitle: state.scenarioResolutionSubtitle,
            campaignState: state.campaignState,
            locationAttachments: state.locationAttachments,
            setAsideEncounterCards: state.setAsideEncounterCards,
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
            playArea: state.playArea,
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
            campaignState: state.campaignState,
            locationAttachments: state.locationAttachments,
            setAsideEncounterCards: state.setAsideEncounterCards,
        };
    }

    const nextDefinition = getNextScenarioCardDefinition(agendas, currentAgenda);

    if (!nextDefinition) {
        return {
            agenda: {
                ...currentAgenda,
                progress: currentAgenda.threshold,
            },
            act: state.act,
            locations: state.locations,
            enemies: state.enemies,
            playArea: state.playArea,
            log: [
                ...state.log,
                createLogEntry(
                    "scenario",
                    `Agenda ${currentAgenda.sequence} has no further side to advance to.`
                ),
            ],
            selectedEnemyTargetId: state.selectedEnemyTargetId,
            scenarioStatus: state.scenarioStatus,
            scenarioResolutionText: state.scenarioResolutionText,
            scenarioResolutionTitle: state.scenarioResolutionTitle,
            scenarioResolutionSubtitle: state.scenarioResolutionSubtitle,
            campaignState: state.campaignState,
            locationAttachments: state.locationAttachments,
            setAsideEncounterCards: state.setAsideEncounterCards,
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

    const updatedCampaignState =
        effectResult.campaignOutcomeToSet != null
            ? {
                ...state.campaignState,
                previousScenarioOutcome: effectResult.campaignOutcomeToSet,
            }
            : state.campaignState;

    let result: AdvanceStoreSlice = {
        agenda: effectResult.agenda,
        act: effectResult.act,
        locations: effectResult.locations,
        enemies: effectResult.enemies,
        playArea: [
            ...state.playArea,
            ...(effectResult.grantedPlayerCards ?? []),
        ],
        log: effectResult.log,
        selectedEnemyTargetId: effectResult.selectedEnemyTargetId,
        scenarioStatus: state.scenarioStatus,
        scenarioResolutionText: state.scenarioResolutionText,
        scenarioResolutionTitle: state.scenarioResolutionTitle,
        scenarioResolutionSubtitle: state.scenarioResolutionSubtitle,
        campaignState: updatedCampaignState,
        locationAttachments: effectResult.locationAttachments,
        setAsideEncounterCards: effectResult.setAsideEncounterCards,
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
                playArea: state.playArea,
                log: result.log,
                selectedEnemyTargetId: result.selectedEnemyTargetId,
                scenarioStatus: result.scenarioStatus,
                scenarioResolutionText: result.scenarioResolutionText,
                scenarioResolutionTitle: result.scenarioResolutionTitle,
                scenarioResolutionSubtitle: result.scenarioResolutionSubtitle,
                campaignState: result.campaignState,
                campaignOutcomeToSet: effectResult.campaignOutcomeToSet ?? null,
                locationAttachments: result.locationAttachments,
                setAsideEncounterCards: result.setAsideEncounterCards,
            },
            false,
        );
    }

    return result;
}

export function loadPersistedCampaignSetup(): PersistedCampaignSetup | null {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const raw = window.localStorage.getItem(CAMPAIGN_SETUP_STORAGE_KEY);

        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as Partial<PersistedCampaignSetup>;

        return {
            selectedDeckId:
                typeof parsed.selectedDeckId === "string" ? parsed.selectedDeckId : "",
            selectedScenarioId:
                typeof parsed.selectedScenarioId === "string"
                    ? parsed.selectedScenarioId
                    : defaultScenarioId,
            campaignState: {
                scenarioFlags: {},
                previousScenarioOutcome:
                    typeof parsed.campaignState?.previousScenarioOutcome === "string"
                        ? parsed.campaignState.previousScenarioOutcome
                        : null,
                randomizedSelectionsByCampaignKey:
                    parsed.campaignState?.randomizedSelectionsByCampaignKey &&
                        typeof parsed.campaignState.randomizedSelectionsByCampaignKey ===
                        "object"
                        ? parsed.campaignState.randomizedSelectionsByCampaignKey
                        : {},
            },
        };
    } catch (error) {
        console.warn("Failed to load persisted campaign setup.", error);
        return null;
    }
}


export function getNextScenarioCardDefinition(
    cards: ScenarioCardDefinition[],
    currentCard: ScenarioCardState,
): ScenarioCardDefinition | undefined {
    const currentNumber = getScenarioSequenceNumber(currentCard.sequence);
    const currentSide = getScenarioSequenceSide(currentCard.sequence);

    if (currentSide === "a") {
        return cards.find(
            (entry) =>
                getScenarioSequenceNumber(entry.sequence) === currentNumber &&
                getScenarioSequenceSide(entry.sequence) === "b",
        );
    }

    const nextNumber = String(Number(currentNumber) + 1);

    return cards.find(
        (entry) =>
            getScenarioSequenceNumber(entry.sequence) === nextNumber &&
            getScenarioSequenceSide(entry.sequence) === "a",
    );
}

export function getScenarioSequenceNumber(sequence: string): string {
    return sequence.slice(0, -1);
}

export function getScenarioSequenceSide(sequence: string): string {
    return sequence.slice(-1).toLowerCase();
}

export function savePersistedCampaignSetup(setup: PersistedCampaignSetup): void {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(
            CAMPAIGN_SETUP_STORAGE_KEY,
            JSON.stringify(setup),
        );
    } catch (error) {
        console.warn("Failed to save persisted campaign setup.", error);
    }
}

export function isScenarioResolved(status: ScenarioStatus): boolean {
    return status !== "inProgress";
}

export function getScenarioResolvedMessage(status: ScenarioStatus): string {
    if (status === "won") {
        return "The scenario is already complete. Return to home to start again.";
    }

    if (status === "resigned") {
        return "You already resigned from the scenario. Return to home to start again.";
    }

    return "The scenario is over. Return to home to try again.";
}

export function buildEnemyFromEncounterCard(args: {
    card: EncounterCard;
    locationId: string;
}): Enemy {
    const { card, locationId } = args;

    return {
        id: `${card.code}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        code: card.code,
        name: card.name,
        fight: card.fight ?? 0,
        evade: card.evade ?? 0,
        health: card.health ?? 0,
        damage: card.damage ?? 0,
        horror: card.horror ?? 0,
        locationId,
        engagedInvestigatorId: null,
        exhausted: false,
        damageOnEnemy: 0,
        ability: card.ability,
        abilities: card.abilities,
        text: card.text,
        traits: card.traits,
        set: card.set,
        victoryPoints: card.victoryPoints,
        parley: card.parley,
    };
}

export function spawnEnemyAtLocation(args: {
    enemyCode: string;
    locationId: string;
    enemies: Enemy[];
    investigator: Investigator;
    locations: GameState["locations"];
}): Enemy[] {
    const { enemyCode, locationId, enemies, investigator, locations } = args;

    const enemyCard = getEncounterCardByCode(enemyCode);

    if (!enemyCard) {
        console.warn("Enemy not found for setup spawn:", enemyCode);
        return enemies;
    }

    const spawnedEnemy = buildEnemyFromEncounterCard({
        card: enemyCard,
        locationId,
    });

    const investigatorLocation = findCurrentLocation(locations, investigator.id);

    if (
        investigatorLocation &&
        investigatorLocation.id === locationId &&
        !enemyHasAloof(spawnedEnemy)
    ) {
        spawnedEnemy.engagedInvestigatorId = investigator.id;
    }

    return [...enemies, spawnedEnemy];
}

export function getEncounterCardByCode(code: string): EncounterCard | null {
    return encounterCards.find((card) => card.code === code) ?? null;
}

export function attachEncounterCardToLocation(args: {
    cardCode: string;
    locationId: string;
    locationAttachments: LocationAttachment[];
}): LocationAttachment[] {
    const { cardCode, locationId, locationAttachments } = args;

    const card = getEncounterCardByCode(cardCode);

    if (!card) {
        console.warn("Encounter card not found for location attachment:", cardCode);
        return locationAttachments;
    }

    const attachment = buildLocationAttachmentFromEncounterCard({
        card,
        locationId,
    });

    return [...locationAttachments, attachment];
}

export function buildLocationAttachmentFromEncounterCard(args: {
    card: EncounterCard;
    locationId: string;
}): LocationAttachment {
    const { card, locationId } = args;

    return {
        id: `${card.code}-${locationId}-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,
        cardCode: card.code,
        code: card.code,
        name: card.name,
        attachedLocationId: locationId,
        text: card.text,
        traits: card.traits,
    };
}

export function resolveInteractiveEffect(args: {
    sourceKind: "parley" | "locationAction";
    effect: ParleyEffect | LocationAbilityEffect;
    investigator: Investigator;
    currentLocationId: string;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
}): {
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
    logEntries: ReturnType<typeof createLogEntry>[];
} {
    const {
        sourceKind,
        effect,
        investigator,
        currentLocationId,
        locations,
        enemies,
        campaignState,
    } = args;

    if (sourceKind === "parley") {
        const result = resolveParleyEffect({
            effect: effect as ParleyEffect,
            investigator,
            currentLocationId,
            locations,
            campaignState,
        });

        return {
            investigator: result.investigator,
            locations: result.locations,
            enemies,
            campaignState: result.campaignState,
            logEntries: result.logEntries,
        };
    }

    return resolveLocationAbilityEffect({
        effect: effect as LocationAbilityEffect,
        investigator,
        currentLocationId,
        locations,
        enemies,
        campaignState,
    });
}

export function isOpeningHandWeakness(card: PlayerCard): boolean {
    return card.isWeakness === true;
}

export function createLogEntry(kind: GameLogKind, text: string) {
    return {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        kind,
        text,
        createdAt: Date.now(),
    } as const;
}

export function hasLocationAttachment(
    attachments: { attachedLocationId: string; name: string }[],
    locationId: string,
    name: string,
): boolean {
    return attachments.some(
        (attachment) =>
            attachment.attachedLocationId === locationId &&
            attachment.name === name,
    );
}

export function buildInitialEncounterDeck(
    encounterCardCodes: string[] | undefined,
): EncounterCard[] {
    return shuffleArray(buildEncounterDeckFromCodes(encounterCardCodes ?? []));
}

export function threatAreaHasCard(threatArea: EncounterCard[], cardName: string): boolean {
    return threatArea.some((card) => card.name === cardName);
}

export function normalizeCardCounters(
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

export function shuffleArray<T>(items: T[]): T[] {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}