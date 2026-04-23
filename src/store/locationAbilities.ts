import type {
    GameState,
    EncounterCard,
    LocationAttachment,
} from "../types/game";

import {
    type
        CampaignState,
} from "../lib/campaignSetup";

import type {
    LocationAbilityEffect, Investigator, Enemy,
} from "../types/game";

import {
    createLogEntry,
    discardThreatAreaCardByCode,
    discardLocationAttachmentByCode,
    discardEnemyFromPlay,
} from "./gsFunctions";

import {
    applyConditionalLocationVisibility,
} from "./locationVisibility";

export function resolveLocationAbilityEffect(args: {
    effect: LocationAbilityEffect;
    investigator: Investigator;
    currentLocationId: string;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
    threatArea: EncounterCard[];
    encounterDiscard: EncounterCard[];
    targetEnemyId?: string;
    locationAttachments: LocationAttachment[];
}): {
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
    threatArea: EncounterCard[];
    encounterDiscard: EncounterCard[];
    logEntries: ReturnType<typeof createLogEntry>[];
    locationAttachments: LocationAttachment[];
} {
    const {
        effect,
        investigator,
        currentLocationId,
        locations,
        enemies,
        campaignState,
        threatArea,
        encounterDiscard,
    } = args;

    if (effect.kind === "none") {
        return {
            investigator,
            locations,
            enemies,
            campaignState,
            threatArea,
            encounterDiscard,
            logEntries: [],
            locationAttachments: args.locationAttachments,
        };
    }

    if (effect.kind === "takeHorror") {
        return {
            investigator: {
                ...investigator,
                horror: investigator.horror + effect.amount,
            },
            locations,
            enemies,
            campaignState,
            logEntries: [
                createLogEntry("scenario", `Took ${effect.amount} horror.`),
            ],
            threatArea,
            encounterDiscard,
            locationAttachments: args.locationAttachments,
        };
    }

    if (effect.kind === "takeDamage") {
        return {
            investigator: {
                ...investigator,
                damage: investigator.damage + effect.amount,
            },
            locations,
            enemies,
            campaignState,
            logEntries: [
                createLogEntry("scenario", `Took ${effect.amount} damage.`),
            ],
            threatArea,
            encounterDiscard,
            locationAttachments: args.locationAttachments,
        };
    }

    if (effect.kind === "gainResources") {
        return {
            investigator: {
                ...investigator,
                resources: investigator.resources + effect.amount,
            },
            locations,
            enemies,
            campaignState,
            logEntries: [
                createLogEntry(
                    "scenario",
                    `Gained ${effect.amount} resource${effect.amount === 1 ? "" : "s"}.`,
                ),
            ],
            threatArea,
            encounterDiscard,
            locationAttachments: args.locationAttachments,
        };
    }

    if (effect.kind === "gainClues") {
        return {
            investigator: {
                ...investigator,
                clues: investigator.clues + effect.amount,
            },
            locations,
            enemies,
            campaignState,
            logEntries: [
                createLogEntry(
                    "scenario",
                    `Gained ${effect.amount} clue${effect.amount === 1 ? "" : "s"}.`,
                ),
            ],
            threatArea,
            encounterDiscard,
            locationAttachments: args.locationAttachments,
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
                    ? {
                        ...entry,
                        clues: Math.max(0, entry.clues - cluesToDiscover),
                    }
                    : entry,
            ),
            enemies,
            campaignState,
            logEntries: [
                createLogEntry(
                    "scenario",
                    `Discovered ${cluesToDiscover} clue${cluesToDiscover === 1 ? "" : "s"} at this location.`,
                ),
            ],
            threatArea,
            encounterDiscard,
            locationAttachments: args.locationAttachments,
        };
    }

    if (effect.kind === "setPreviousScenarioOutcome") {
        return {
            investigator,
            locations,
            enemies,
            campaignState: {
                ...campaignState,
                previousScenarioOutcome: effect.outcome,
            },
            logEntries: [
                createLogEntry(
                    "scenario",
                    `Scenario outcome set to "${effect.outcome}".`,
                ),
            ],
            threatArea,
            encounterDiscard,
            locationAttachments: args.locationAttachments,
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
            enemies,
            campaignState: nextCampaignState,
            logEntries: [
                createLogEntry(
                    "scenario",
                    `Set scenario flag "${effect.key}" to ${String(effect.value)}.`,
                ),
            ],
            threatArea,
            encounterDiscard,
            locationAttachments: args.locationAttachments,
        };
    }

    if (effect.kind === "discardThreatAreaCard") {
        const result = discardThreatAreaCardByCode({
            threatArea,
            cardCode: effect.cardCode,
            encounterDiscard,
        });

        return {
            investigator,
            locations,
            enemies,
            campaignState,
            threatArea: result.threatArea,
            encounterDiscard: result.encounterDiscard,
            logEntries: result.discardedCard
                ? [
                    createLogEntry(
                        "scenario",
                        `${result.discardedCard.name} was discarded from the threat area.`,
                    ),
                ]
                : [
                    createLogEntry(
                        "system",
                        `Could not find threat area card ${effect.cardCode} to discard.`,
                    ),
                ],
            locationAttachments: args.locationAttachments,
        };
    }

    if (effect.kind === "discardLocationAttachment") {
        const result = discardLocationAttachmentByCode({
            locationAttachments: [],
            cardCode: effect.cardCode,
            encounterDiscard,
            locationId: effect.locationId ?? currentLocationId,
        });

        return {
            investigator,
            locations,
            enemies,
            campaignState,
            threatArea,
            encounterDiscard: result.encounterDiscard,
            locationAttachments: result.locationAttachments,
            logEntries: result.discardedAttachment
                ? [
                    createLogEntry(
                        "scenario",
                        `${result.discardedAttachment.name} was discarded from ${result.discardedAttachment.attachedLocationId}.`,
                    ),
                ]
                : [
                    createLogEntry(
                        "system",
                        `Could not find location attachment ${effect.cardCode} to discard.`,
                    ),
                ],
        };
    }

    if (effect.kind === "discardEnemy") {
        const result = discardEnemyFromPlay({
            enemies,
            encounterDiscard,
            investigatorId: investigator.id,
            enemyCode: effect.enemyCode,
            enemyId: effect.enemyId,
            onlyIfEngaged: effect.onlyIfEngaged,
            locationId: effect.locationId ?? currentLocationId,
        });

        return {
            investigator,
            locations,
            enemies: result.enemies,
            campaignState,
            threatArea,
            encounterDiscard: result.encounterDiscard,
            locationAttachments: args.locationAttachments,
            logEntries: result.discardedEnemy
                ? [
                    createLogEntry(
                        "scenario",
                        effect.logText || `${result.discardedEnemy.name} was discarded from play.`,
                    ),
                ]
                : [
                    createLogEntry(
                        "system",
                        "Could not find the enemy to discard from play.",
                    ),
                ],
        };
    }

    return {
        investigator,
        locations,
        enemies,
        campaignState,
        logEntries: [],
        threatArea,
        encounterDiscard,
        locationAttachments: args.locationAttachments,
    };
}
