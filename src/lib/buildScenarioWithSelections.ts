import type { GameLocation } from "../types/game";
import type {
    ScenarioDefinition,
} from "../data/scenarios/scenarioTypes";
import type { CampaignState } from "./campaignSetup";

export function buildScenarioWithSelections(
    scenario: ScenarioDefinition,
    campaignState: CampaignState,
): ScenarioDefinition {
    const campaignKey = scenario.campaignKey ?? scenario.id;
    const storedSelections =
        campaignState.randomizedSelectionsByCampaignKey[campaignKey] ?? {};

    const randomizedGroups = scenario.randomizedLocationOptions ?? [];

    if (randomizedGroups.length === 0) {
        return scenario;
    }

    const replacementMap = new Map<string, GameLocation>();

    for (const group of randomizedGroups) {
        const chosenOptionId =
            storedSelections[group.slotId] ??
            scenario.randomizedSelections?.find(
                (selection) => selection.slotId === group.slotId,
            )?.chosenOptionId;

        if (!chosenOptionId) {
            continue;
        }

        const chosenOption = group.options.find(
            (option) => option.optionId === chosenOptionId,
        );

        if (!chosenOption) {
            continue;
        }

        replacementMap.set(group.placeholderLocationId, chosenOption.location);
    }

    const resolvedLocations = scenario.locations.map((location) => {
        const replacement = replacementMap.get(location.id);
        return replacement ?? location;
    });

    return {
        ...scenario,
        locations: resolvedLocations,
    };
}
