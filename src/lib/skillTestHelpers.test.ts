import { describe, expect, it } from "vitest";
import { countMatchingIcons } from "./skillTestHelpers";
import type { PlayerCard } from "../types/game";

function card(icons: string[]): PlayerCard {
    return {
        instanceId: "test-card",
        name: "Test Card",
        type: "skill",
        faction: "neutral",
        icons,
    };
}

describe("countMatchingIcons", () => {
    it("counts matching skill icons", () => {
        expect(countMatchingIcons(card(["combat", "combat"]), "combat")).toBe(2);
    });

    it("counts wild icons as matching any skill", () => {
        expect(countMatchingIcons(card(["wild"]), "agility")).toBe(1);
    });

    it("returns 0 when there are no matching icons", () => {
        expect(countMatchingIcons(card(["intellect"]), "combat")).toBe(0);
    });
});
