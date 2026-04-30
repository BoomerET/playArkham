import type { ChaosToken } from "../types/game";
import { drawChaosToken } from "./chaosBagRules";

export function getChaosTokenValue(token: ChaosToken | null): number {
    if (typeof token === "number") {
        return token;
    }

    if (token === "autoFail") {
        return Number.NEGATIVE_INFINITY;
    }

    return 0;
}

export function drawAndResolveSkillTest(params: {
    baseValue: number;
    modifier: number;
    difficulty: number;
    chaosBag: ChaosToken[];
    rng?: () => number;
}): {
    token: ChaosToken | null;
    finalValue: number;
    success: boolean;
} {
    const tokenResult = drawChaosToken({
        chaosBag: params.chaosBag,
        rng: params.rng,
    });

    const chaosTokenValue = getChaosTokenValue(tokenResult.token);

    const result = resolveSkillTest({
        baseValue: params.baseValue,
        modifier: params.modifier,
        chaosToken: chaosTokenValue,
        difficulty: params.difficulty,
    });

    return {
        token: tokenResult.token,
        finalValue: result.finalValue,
        success: result.success,
    };
}

export function resolveSkillTest(params: {
    baseValue: number;
    modifier: number;
    chaosToken: number;
    difficulty: number;
}): {
    finalValue: number;
    success: boolean;
} {
    const finalValue = params.baseValue + params.modifier + params.chaosToken;

    return {
        finalValue,
        success:
            params.chaosToken === Number.NEGATIVE_INFINITY
                ? false
                : finalValue >= params.difficulty,
    };
}
