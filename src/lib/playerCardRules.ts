import type { Investigator, PlayerCardEffect } from "../types/game";

export function resolvePlayerCardEffect(params: {
    investigator: Investigator;
    effect?: PlayerCardEffect;
}): {
    investigator: Investigator;
    logText: string | null;
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

    return {
        investigator: params.investigator,
        logText: null,
    };
}
