import { describe, expect, it } from "vitest";
import { buildUpkeepLogTexts } from "./upkeepLogRules";

describe("buildUpkeepLogTexts", () => {
    it("builds full upkeep log with draw, ready, reshuffle, and round", () => {
        const result = buildUpkeepLogTexts({
            investigator: { name: "Roland Banks" } as any,
            drawnCard: { name: "Test Card" } as any,
            readyCount: 2,
            nextRound: 3,
            reshuffledDiscard: true,
        });

        expect(result).toEqual([
            "Roland Banks gains 1 resource during upkeep.",
            "Drew card during upkeep: Test Card",
            "2 exhausted enemies readied during upkeep.",
            "Shuffled discard pile into a new player deck.",
            "Round 3 begins.",
        ]);
    });

    it("handles no draw, no ready, no reshuffle", () => {
        const result = buildUpkeepLogTexts({
            investigator: { name: "Daisy Walker" } as any,
            drawnCard: null,
            readyCount: 0,
            nextRound: 2,
            reshuffledDiscard: false,
        });

        expect(result).toEqual([
            "Daisy Walker gains 1 resource during upkeep.",
            "Could not draw during upkeep because the deck is empty.",
            "Round 2 begins.",
        ]);
    });
});