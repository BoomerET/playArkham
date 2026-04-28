import { expect, it } from "vitest";
import { resolvePlayerCardEffect } from "./playerCardRules";

it("resolves gain resources effect", () => {
    const result = resolvePlayerCardEffect({
        investigator: { resources: 2 } as any,
        effect: { kind: "gainResources", amount: 3 },
    });

    expect(result.investigator.resources).toBe(5);
    expect(result.logText).toBe("Gained 3 resources.");
});