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
} from "../types/game";

import {
    findCurrentLocation,
} from "../lib/gameStateHelpers";

import type {
    CampaignState
} from "../lib/campaignSetup";

import {
    resolveLocationAbilityEffect
} from "./locationAbilities";

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