import { expect, it } from "vitest";
import { resolveEnemyAttack } from "./enemyRules";

it("applies enemy attack damage and horror", () => {
    const result = resolveEnemyAttack({
        investigator: { damage: 1, horror: 2 } as any,
        enemyName: "Ghoul",
        damage: 2,
        horror: 1,
    });

    expect(result.investigator.damage).toBe(3);
    expect(result.investigator.horror).toBe(3);
    expect(result.logText).toContain("Ghoul attacks!");
});