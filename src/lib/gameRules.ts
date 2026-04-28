import type { Investigator } from "../types/game";

export function applyDeckExhaustionPenalty(
    investigator: Investigator,
): Investigator {
    return {
        ...investigator,
        horror: investigator.horror + 1,
    };
}
