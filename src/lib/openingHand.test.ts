import { describe, expect, it } from "vitest";
import {
    drawCards,
    drawOpeningHandWithoutWeaknesses,
    shuffleDeck,
    performMulligan
} from "./openingHand";
import { card } from "../store/gsFunctions";

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
    it("skips weaknesses when drawing the opening hand", () => {
        const weakness = card("Random Basic Weakness", true);
        const normal1 = card("Normal Card 1");
        const normal2 = card("Normal Card 2");

        const result = drawOpeningHandWithoutWeaknesses({
            deck: [weakness, normal1, normal2],
            handSize: 2,
        });

        expect(result.hand.map((card) => card.name)).toEqual([
            "Normal Card 1",
            "Normal Card 2",
        ]);
        expect(result.deck).toHaveLength(1);
        expect(result.deck[0].isWeakness).toBe(true);
        expect(result.skippedWeaknesses).toHaveLength(1);
    });
    it("returns deck with same cards after shuffle", () => {
        const deck = [
            card("A"),
            card("B"),
            card("C"),
        ];

        const shuffled = shuffleDeck(deck, () => 0.5);

        expect(shuffled).toHaveLength(3);
        expect(shuffled.map((c) => c.name).sort()).toEqual(["A", "B", "C"]);
    });
    it("performs mulligan correctly", () => {
        const c1 = card("Card 1");
        const c2 = card("Card 2");
        const c3 = card("Card 3");
        const c4 = card("Card 4");

        const result = performMulligan({
            hand: [c1, c2],
            deck: [c3, c4],
            cardsToMulligan: [c1],
            rng: () => 0,
        });

        expect(result.newHand).toHaveLength(2);
        expect(result.newDeck).toHaveLength(2);

        expect(result.newHand.some((c) => c.name === "Card 2")).toBe(true);
    });

    it("does not allow weaknesses to be mulliganed", () => {
        const weakness = card("Weakness", true);
        const normal = card("Normal");

        const result = performMulligan({
            hand: [weakness, normal],
            deck: [card("Deck Card")],
            cardsToMulligan: [weakness],
            rng: () => 0,
        });

        expect(result.newHand.some((c) => c.name === "Weakness")).toBe(true);
    });
});