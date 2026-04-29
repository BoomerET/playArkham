import { describe, expect, it } from "vitest";
import { resolveSkillTest, drawAndResolveSkillTest } from "./skillTestRules";

describe("resolveSkillTest", () => {
    it("succeeds when value meets difficulty", () => {
        const result = resolveSkillTest({
            baseValue: 3,
            modifier: 1,
            chaosToken: 0,
            difficulty: 4,
        });

        expect(result.success).toBe(true);
    });

    it("fails when below difficulty", () => {
        const result = resolveSkillTest({
            baseValue: 3,
            modifier: 0,
            chaosToken: -2,
            difficulty: 4,
        });

        expect(result.success).toBe(false);
    });
    it("draws token and resolves skill test", () => {
        const result = drawAndResolveSkillTest({
            baseValue: 4,
            modifier: 0,
            difficulty: 3,
            chaosBag: [-1],
            rng: () => 0,
        });

        expect(result.token).toBe(-1);
        expect(result.finalValue).toBe(3);
        expect(result.success).toBe(true);
    });
    it("treats empty chaos bag as token value 0", () => {
        const result = drawAndResolveSkillTest({
            baseValue: 3,
            modifier: 0,
            difficulty: 3,
            chaosBag: [],
            rng: () => 0,
        });

        expect(result.token).toBe(null);
        expect(result.finalValue).toBe(3);
        expect(result.success).toBe(true);
    });
});
