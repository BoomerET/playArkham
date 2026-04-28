import { describe, expect, it } from "vitest";
//import { drawOpeningHandWithoutWeaknesses } from "./gsFunctions";
import { drawOpeningHandWithoutWeaknesses } from "../lib/openingHand";
import type { PlayerCard } from "../types/game";
import { shuffleDeck } from "../lib/openingHand";

function card(name: string, isWeakness = false): PlayerCard {
    return {
        instanceId: name,
        name,
        type: isWeakness ? "treachery" : "asset",
        faction: "neutral",
        isWeakness,
    };
}

describe("drawOpeningHandWithoutWeaknesses", () => {
    it("skips weaknesses when drawing the opening hand", () => {
        const weakness = card("Random Basic Weakness", true);
        const normal1 = card("Normal Card 1");
        const normal2 = card("Normal Card 2");

        const result = drawOpeningHandWithoutWeaknesses({
            deck: [weakness, normal1, normal2],
            handSize: 2,
        });
        expect(result.deck).toHaveLength(1);
        expect(result.deck[0].isWeakness).toBe(true);
        expect(result.skippedWeaknesses).toHaveLength(1);
        //expect(result.skippedWeaknesses).toEqual([]);
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
});
