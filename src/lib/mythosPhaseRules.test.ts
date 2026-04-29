import { expect, it } from "vitest";
import { runMythosPhase } from "./mythosPhaseRules";

it("returns mythos phase start log", () => {
    const result = runMythosPhase();

    expect(result.logTexts).toEqual(["Mythos phase begins."]);
});
