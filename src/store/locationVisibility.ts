import type { GameState } from "../types/game";
import { type CampaignState } from "../lib/campaignSetup";

export function applyConditionalLocationVisibility(args: {
    locations: GameState["locations"];
    campaignState: CampaignState;
}): GameState["locations"] {
    const { locations, campaignState } = args;

    return locations.map((location) => {
        if (!location.revealCondition) {
            return location;
        }

        const matches =
            campaignState.scenarioFlags[location.revealCondition.key] ===
            location.revealCondition.equals;

        if (!matches || location.isVisible) {
            return location;
        }

        return {
            ...location,
            isVisible: true,
        };
    });
}
