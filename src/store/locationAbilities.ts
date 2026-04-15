import type { GameState } from "../types/game";
import { type CampaignState } from "../lib/campaignSetup";
import type { LocationAbilityEffect, Investigator, Enemy } from "../types/game";
import { createLogEntry } from "./gameStore";
import { applyConditionalLocationVisibility } from "./locationVisibility";

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
        targetEnemyId,
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

    if (effect.kind === "engageEnemyFromConnectedLocation") {
        const currentLocation = locations.find((entry) => entry.id === currentLocationId);

        if (!currentLocation) {
            return {
                investigator,
                locations,
                enemies,
                campaignState,
                logEntries: [
                    createLogEntry(
                        "system",
                        "Current location could not be found for this action.",
                    ),
                ],
            };
        }

        const enemyToMove =
            targetEnemyId != null
                ? enemies.find(
                    (enemy) =>
                        enemy.id === targetEnemyId &&
                        enemy.engagedInvestigatorId === null &&
                        currentLocation.connections.includes(enemy.locationId),
                ) ?? null
                : null;

        if (!enemyToMove) {
            return {
                investigator,
                locations,
                enemies,
                campaignState,
                logEntries: [
                    createLogEntry(
                        "system",
                        "There is no valid enemy at a connecting location.",
                    ),
                ],
            };
        }

        return {
            investigator,
            locations,
            enemies: enemies.map((enemy) =>
                enemy.id === enemyToMove.id
                    ? {
                        ...enemy,
                        locationId: currentLocationId,
                        engagedInvestigatorId: investigator.id,
                    }
                    : enemy,
            ),
            campaignState,
            logEntries: [
                createLogEntry(
                    "enemy",
                    `${enemyToMove.name} moved to ${currentLocation.name} and engaged ${investigator.name}.`,
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