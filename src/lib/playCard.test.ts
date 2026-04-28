import { expect, it } from "vitest";
import { playCard } from "./playCard";

function card(name: string): any {
    return {
        instanceId: name,
        name,
    };
}

it("removes card from hand, adds to discard, and spends resources", () => {
    const c1 = card("Test Card");

    const result = playCard({
        hand: [c1],
        discard: [],
        investigator: { resources: 5 } as any,
        card: c1,
        cost: 2,
    });

    expect(result.newHand).toEqual([]);
    expect(result.newDiscard).toEqual([c1]);
    expect(result.newInvestigator.resources).toBe(3);
});