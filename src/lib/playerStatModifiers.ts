import type { PlayerCard, SkillType } from "../types/game";

export function getStatModifierFromPlayArea(params: {
    playArea: PlayerCard[];
    skill: SkillType;
}): number {
    return params.playArea.reduce((total, card) => {
        if (card.exhausted) {
            return total;
        }

        return total + (card.statModifiers?.[params.skill] ?? 0);
    }, 0);
}