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
} from "../types/game";

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

export function createLogEntry(kind: GameLogKind, text: string) {
    return {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        kind,
        text,
        createdAt: Date.now(),
    } as const;
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
        code: discardedAttachment.code,
        name: discardedAttachment.name,
        type: "treachery",
        text: discardedAttachment.text,
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
