import type {
    GameState,
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
    targetEnemyId?: string;
}): {
    investigator: Investigator;
    locations: GameState["locations"];
    enemies: Enemy[];
    campaignState: CampaignState;
    logEntries: ReturnType<typeof createLogEntry>[];
} {
    const {
        effect,
        investigator,
        currentLocationId,
        locations,
        enemies,
        campaignState,
    } = args;

    if (effect.kind === "none") {
        return {
            investigator,
            locations,
            enemies,
            campaignState,
            logEntries: [],
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
                createLogEntry(
                    "scenario",
                    `Took ${effect.amount} horror.`,
                ),
            ],
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
                createLogEntry(
                    "scenario",
                    `Took ${effect.amount} damage.`,
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
            enemies,
            campaignState,
            logEntries: [
                createLogEntry(
                    "scenario",
                    `Gained ${effect.amount} resource${effect.amount === 1 ? "" : "s"}.`,
                ),
            ],
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
            enemies,
            campaignState,
            logEntries: [
                createLogEntry(
                    "scenario",
                    `Discovered ${cluesToDiscover} clue${cluesToDiscover === 1 ? "" : "s"} at this location.`,
                ),
            ],
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
        };
    }

    return {
        investigator,
        locations,
        enemies,
        campaignState,
        logEntries: [],
    };
}