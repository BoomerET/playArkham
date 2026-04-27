import { describe, expect, it } from "vitest";
import { buildDeckCardsFromSlots } from "./loadArkhamDeck";

describe("buildDeckCardsFromSlots", () => {
    it("replaces random weakness placeholders with a real weakness", () => {
        const result = buildDeckCardsFromSlots(
            {
                "01000": 1,
            },
            () => 0,
        );

        expect(result.cards).toHaveLength(1);
        expect(result.metadata.randomWeaknesses).toHaveLength(1);
        expect(result.cards[0].isWeakness).toBe(true);
        expect(result.cards[0].code).not.toBe("01000");
    });
    it("does not pick the same random weakness twice when alternatives exist", () => {
        const result = buildDeckCardsFromSlots(
            {
                "01000": 2,
            },
            () => 0,
        );

        expect(result.cards).toHaveLength(2);
        expect(result.metadata.randomWeaknesses).toHaveLength(2);

        const weaknessCodes = result.cards.map((card) => card.code);

        expect(new Set(weaknessCodes).size).toBe(2);
    });
    it("tracks unsupported card codes and skips them", () => {
        const result = buildDeckCardsFromSlots(
            {
                NOT_A_REAL_CARD: 1,
            },
            () => 0,
        );

        expect(result.cards).toHaveLength(0);
        expect(result.metadata.unsupportedCodes).toEqual(["NOT_A_REAL_CARD"]);
    });
    it("warns when a non-weakness card exceeds its deck limit", () => {
        const result = buildDeckCardsFromSlots(
            {
                "60352": 3,
            },
            () => 0,
        );

        expect(result.metadata.validationWarnings).toEqual([
            expect.stringContaining("has 3 copies; limit is"),
        ]);
    });
});
