import { describe, expect, it } from "vitest";
import { drawChaosToken } from "./chaosBagRules";

describe("drawChaosToken", () => {
    it("draws a token deterministically with injected rng", () => {
        const result = drawChaosToken({
            chaosBag: [0, -1, -2],
            rng: () => 0,
        });

        expect(result.token).toBe(0);
    });

    it("returns null for empty chaos bag", () => {
        const result = drawChaosToken({
            chaosBag: [],
            rng: () => 0,
        });

        expect(result.token).toBe(null);
    });
});
