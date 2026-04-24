import { getPlayerCardByCode } from "../data/playerCards";
import type { PlayerCard } from "../types/game";

export type ArkhamBuildDeckJson = {
    id: string;
    name: string;
    investigator_code: string;
    investigator_name: string;
    slots: Record<string, number>;
};

export function loadArkhamBuildDeckFromJson(deckJson: ArkhamBuildDeckJson): {
    deckName: string;
    investigatorCode: string;
    investigatorName: string;
    cards: PlayerCard[];
} {
    const cards: PlayerCard[] = [];

    for (const [code, quantity] of Object.entries(deckJson.slots)) {
        const card = getPlayerCardByCode(code);

        if (!card) {
            console.warn(`Unsupported Arkham.build card code: ${code}`);
            continue;
        }

        for (let index = 0; index < quantity; index += 1) {
            cards.push({
                ...card,
                instanceId: `${code}-${crypto.randomUUID()}`,
            });
        }
    }

    return {
        deckName: deckJson.name,
        investigatorCode: deckJson.investigator_code,
        investigatorName: deckJson.investigator_name,
        cards,
    };
}
