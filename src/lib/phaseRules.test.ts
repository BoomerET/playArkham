import { describe, expect, it } from "vitest";
import { getNextPhase } from "./phaseRules";

describe("getNextPhase", () => {
    it("cycles through the phase order", () => {
        expect(getNextPhase("mythos")).toBe("investigation");
        expect(getNextPhase("investigation")).toBe("enemy");
        expect(getNextPhase("enemy")).toBe("upkeep");
        expect(getNextPhase("upkeep")).toBe("mythos");
    });
});
