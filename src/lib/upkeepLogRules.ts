import type { Investigator, PlayerCard } from "../types/game";

export function buildUpkeepLogTexts(params: {
    investigator: Investigator;
    drawnCard: PlayerCard | null;
    readyCount: number;
    nextRound: number;
    reshuffledDiscard: boolean;
}): string[] {
    const logTexts: string[] = [
        `${params.investigator.name} gains 1 resource during upkeep.`,
    ];

    logTexts.push(
        params.drawnCard
            ? `Drew card during upkeep: ${params.drawnCard.name}`
            : "Could not draw during upkeep because the deck is empty.",
    );

    if (params.readyCount > 0) {
        logTexts.push(
            params.readyCount === 1
                ? "1 exhausted enemy readied during upkeep."
                : `${params.readyCount} exhausted enemies readied during upkeep.`,
        );
    }

    if (params.reshuffledDiscard) {
        logTexts.push("Shuffled discard pile into a new player deck.");
    }

    logTexts.push(`Round ${params.nextRound} begins.`);

    return logTexts;
}
