import type {
    Investigator,
    LocationAttachment,
    GameLocation,
} from "../types/game";

export function runInvestigationPhaseEnd(params: {
    investigator: Investigator;
    currentLocation: Pick<GameLocation, "id" | "name"> | null;
    locationAttachments: LocationAttachment[];
}): {
    investigator: Investigator;
    logTexts: string[];
} {
    let updatedInvestigator = params.investigator;
    const logTexts: string[] = [];

    const fireAttachments = params.locationAttachments.filter(
        (attachment) => attachment.name === "Fire!",
    );

    for (const attachment of fireAttachments) {
        if (
            params.currentLocation &&
            attachment.attachedLocationId === params.currentLocation.id
        ) {
            updatedInvestigator = {
                ...updatedInvestigator,
                damage: updatedInvestigator.damage + 1,
            };

            logTexts.push(
                `Fire! at ${params.currentLocation.name} dealt 1 direct damage at the end of the Investigation phase.`,
            );
        }
    }

    return {
        investigator: updatedInvestigator,
        logTexts,
    };
}
