import type { ChaosToken } from "../types/game";

export function drawChaosToken(params: {
    chaosBag: ChaosToken[];
    rng?: () => number;
}): {
    token: ChaosToken | null;
} {
    if (params.chaosBag.length === 0) {
        return { token: null };
    }

    const rng = params.rng ?? Math.random;
    const index = Math.floor(rng() * params.chaosBag.length);

    return {
        token: params.chaosBag[index],
    };
}
