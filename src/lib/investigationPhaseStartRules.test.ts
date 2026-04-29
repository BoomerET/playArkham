import { expect, it } from "vitest";
import { runInvestigationPhaseStart } from "./investigationPhaseStartRules";

it("starts investigation with 3 actions", () => {
    const result = runInvestigationPhaseStart({
        investigator: { name: "Roland Banks" } as any,
    });

    expect(result.actionsRemaining).toBe(3);
    expect(result.logTexts).toEqual(["Roland Banks has 3 actions this turn."]);
});
