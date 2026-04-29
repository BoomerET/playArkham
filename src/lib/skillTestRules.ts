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
        success: finalValue >= params.difficulty,
    };
}
