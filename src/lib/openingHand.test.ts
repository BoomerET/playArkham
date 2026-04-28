import { describe, expect, it } from "vitest";
import { drawCards, drawOpeningHandWithoutWeaknesses } from "./openingHand";
import { card } from "../store/gsFunctions.test";

describe("drawOpeningHandWithoutWeaknesses", () => {
    it("draws cards from the top of the deck", () => {
        const c1 = card("Card 1");
        const c2 = card("Card 2");
        const c3 = card("Card 3");

        const result = drawCards({
            deck: [c1, c2, c3],
            count: 2,
        });

        expect(result.drawn.map((card) => card.name)).toEqual([
            "Card 1",
            "Card 2",
        ]);

        expect(result.deck.map((card) => card.name)).toEqual([
            "Card 3",
        ]);
    });
    it("draws fewer cards when the deck runs out", () => {
        const c1 = card("Card 1");

        const result = drawCards({
            deck: [c1],
            count: 3,
        });

        expect(result.drawn.map((card) => card.name)).toEqual(["Card 1"]);
        expect(result.deck).toEqual([]);
    });
});