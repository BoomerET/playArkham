import { describe, expect, it } from "vitest";
import { applyDeckExhaustionPenalty } from "./gameRules";

it("adds 1 horror when deck is exhausted", () => {
    const investigator = {
        name: "Test Investigator",
        horror: 2,
    } as any;

    const result = applyDeckExhaustionPenalty(investigator);

    expect(result.horror).toBe(3);
});
