import type { Investigator } from "../types/game";
import type { PlayerCardEffect } from "../store/gsTypes";

export function resolvePlayerCardEffect(params: {
    investigator: Investigator;
    effect?: PlayerCardEffect;
}): {
    investigator: Investigator;
    logText: string | null;
    drawCount?: number;
} {
    const effect = params.effect ?? { kind: "none" };

    if (effect.kind === "gainResources") {
        return {
            investigator: {
                ...params.investigator,
                resources: params.investigator.resources + effect.amount,
            },
            logText: `Gained ${effect.amount} resource${effect.amount === 1 ? "" : "s"}.`,
        };
    }

    if (effect.kind === "drawCards") {
        return {
            investigator: params.investigator,
            logText: `Draw ${effect.amount} card${effect.amount === 1 ? "" : "s"}.`,
            drawCount: effect.amount,
        };
    }

    if (effect.kind === "takeDamage") {
        return {
            investigator: {
                ...params.investigator,
                damage: params.investigator.damage + effect.amount,
            },
            logText: `Took ${effect.amount} damage.`,
        };
    }

    if (effect.kind === "takeHorror") {
        return {
            investigator: {
                ...params.investigator,
                horror: params.investigator.horror + effect.amount,
            },
            logText: `Took ${effect.amount} horror.`,
        };
    }

    return {
        investigator: params.investigator,
        logText: null,
    };
}
