import { describe, expect, it } from "vitest";
import { resolveSkillTest } from "./skillTestRules";

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
});
