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
});
