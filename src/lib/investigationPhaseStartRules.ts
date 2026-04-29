import type { Investigator } from "../types/game";

export function runInvestigationPhaseStart(params: {
    investigator: Investigator;
}): {
    actionsRemaining: number;
    logTexts: string[];
} {
    return {
        actionsRemaining: 3,
        logTexts: [`${params.investigator.name} has 3 actions this turn.`],
    };
}
