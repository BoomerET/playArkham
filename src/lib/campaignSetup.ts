import type {
    ScenarioDefinition,
    ScenarioRandomizedSelection,
} from "../data/scenarios/scenarioTypes";

import { buildScenarioWithSelections } from "./buildScenarioWithSelections";

export type CampaignState = {
    previousScenarioOutcome: string | null;
    randomizedSelectionsByCampaignKey: Record<string, Record<string, string>>;
};

export function resolveScenarioForCampaign(args: {
    selectedScenarioId: string;
    availableScenarios: ScenarioDefinition[];
    campaignState: CampaignState;
}): ScenarioDefinition {
    const { selectedScenarioId, availableScenarios, campaignState } = args;

    const directlySelected =
        availableScenarios.find((scenario) => scenario.id === selectedScenarioId) ??
        availableScenarios[0];

    const campaignKey = directlySelected.campaignKey;

    if (!campaignKey) {
        return applyRandomizedSelections(directlySelected, campaignState);
    }

    const matchingVariant =
        availableScenarios.find(
            (scenario) =>
                scenario.campaignKey === campaignKey &&
                scenario.campaignOutcome === campaignState.previousScenarioOutcome,
        ) ?? directlySelected;

    return applyRandomizedSelections(matchingVariant, campaignState);
}

function applyRandomizedSelections(
    scenario: ScenarioDefinition,
    campaignState: CampaignState,
): ScenarioDefinition {
    const campaignKey = scenario.campaignKey ?? scenario.id;
    const storedSelections =
        campaignState.randomizedSelectionsByCampaignKey[campaignKey] ?? {};

    if (!scenario.randomizedSelections?.length) {
        return scenario;
    }

    const resolvedSelections: ScenarioRandomizedSelection[] =
        scenario.randomizedSelections.map((selection) => ({
            ...selection,
            chosenOptionId:
                storedSelections[selection.slotId] ?? selection.chosenOptionId,
        }));

    return buildScenarioWithSelections(
        {
            ...scenario,
            randomizedSelections: resolvedSelections,
        },
        campaignState,
    );
}
