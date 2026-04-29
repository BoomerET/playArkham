import type { Phase } from "../types/game";

export function getNextPhase(phase: Phase): Phase {
    if (phase === "mythos") return "investigation";
    if (phase === "investigation") return "enemy";
    if (phase === "enemy") return "upkeep";
    if (phase === "upkeep") return "mythos";

    return "mythos";
}
