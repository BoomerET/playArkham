import { encounterCardsByCode } from "../data/encounterCards";
import type { EncounterCard } from "../types/game";

function createEncounterInstanceId(code: string, index: number): string {
    return `${code}-${index}-${Math.random().toString(36).slice(2, 8)}`;
}

export function buildEncounterDeckFromCodes(codes: string[]): EncounterCard[] {
    return codes.map((code, index) => {
        const definition = encounterCardsByCode[code];

        if (!definition) {
            throw new Error(`Unknown encounter card code: ${code}`);
        }

        return {
            ...definition,
            id: createEncounterInstanceId(code, index),
        };
    });
}
