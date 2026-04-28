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
        playArea: [],
    });

    expect(result.newHand).toEqual([]);
    expect(result.newDiscard).toEqual([c1]);
    expect(result.newInvestigator.resources).toBe(3);
    expect(result.status).toBe("playedAndDiscarded");
});
it("puts assets into play instead of discard", () => {
    const asset = {
        instanceId: "asset-1",
        name: "Test Asset",
        type: "asset",
    } as any;

    const result = playCard({
        hand: [asset],
        discard: [],
        playArea: [],
        investigator: { resources: 5 } as any,
        card: asset,
        cost: 2,
    });

    expect(result.newHand).toEqual([]);
    expect(result.newDiscard).toEqual([]);
    expect(result.newPlayArea).toEqual([asset]);
    expect(result.newInvestigator.resources).toBe(3);
    expect(result.status).toBe("playedAsset");
});

it("does nothing if the card is not in hand", () => {
    const cardNotInHand = {
        instanceId: "missing",
        name: "Missing Card",
        type: "event",
    } as any;

    const result = playCard({
        hand: [],
        discard: [],
        playArea: [],
        investigator: { resources: 5 } as any,
        card: cardNotInHand,
        cost: 2,
    });

    expect(result.newHand).toEqual([]);
    expect(result.newDiscard).toEqual([]);
    expect(result.newPlayArea).toEqual([]);
    expect(result.newInvestigator.resources).toBe(5);
    expect(result.status).toBe("notInHand");
});

it("does nothing if investigator cannot afford the card", () => {
    const expensive = {
        instanceId: "expensive",
        name: "Expensive Card",
        type: "event",
    } as any;

    const result = playCard({
        hand: [expensive],
        discard: [],
        playArea: [],
        investigator: { resources: 1 } as any,
        card: expensive,
        cost: 2,
    });

    expect(result.newHand).toEqual([expensive]);
    expect(result.newDiscard).toEqual([]);
    expect(result.newPlayArea).toEqual([]);
    expect(result.newInvestigator.resources).toBe(1);
    expect(result.status).toBe("notEnoughResources");
});

it("uses card cost when explicit cost is not provided", () => {
    const event = {
        instanceId: "event-1",
        name: "Test Event",
        type: "event",
        cost: 2,
    } as any;

    const result = playCard({
        hand: [event],
        discard: [],
        playArea: [],
        investigator: { resources: 5 } as any,
        card: event,
    });

    expect(result.newInvestigator.resources).toBe(3);
    expect(result.status).toBe("playedAndDiscarded");
});

it("returns the amount of resources paid", () => {
    const event = {
        instanceId: "event-1",
        name: "Test Event",
        type: "event",
        cost: 2,
    } as any;

    const result = playCard({
        hand: [event],
        discard: [],
        playArea: [],
        investigator: { resources: 5 } as any,
        card: event,
    });

    expect(result.paidCost).toBe(2);
});

it("returns 0 paid cost when card not in hand", () => {
    const cardNotInHand = {
        instanceId: "missing",
        name: "Missing Card",
        type: "event",
        cost: 2,
    } as any;

    const result = playCard({
        hand: [],
        discard: [],
        playArea: [],
        investigator: { resources: 5 } as any,
        card: cardNotInHand,
    });

    expect(result.paidCost).toBe(0);
});

it("returns paid cost when not enough resources", () => {
    const card = {
        instanceId: "card-1",
        name: "Test Card",
        type: "event",
        cost: 4,
    } as any;

    const result = playCard({
        hand: [card],
        discard: [],
        playArea: [],
        investigator: { resources: 1 } as any,
        card,
    });

    expect(result.paidCost).toBe(4);
});
