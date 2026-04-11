import type {
    LocationAttachment,
    SkillType,
    SkillTestKind,
} from "../types/game";

export type DifficultyModifierContext = {
    skill: SkillType;
    testKind: SkillTestKind;
    locationId: string | null;
};

export type DifficultyModifierDetail = {
    source: string;
    amount: number;
};

function modifierApplies(
    modifier: NonNullable<LocationAttachment["difficultyModifiers"]>[number],
    context: DifficultyModifierContext,
): boolean {
    if (modifier.skill && modifier.skill !== context.skill) {
        return false;
    }

    const appliesTo = modifier.appliesTo ?? "any";

    if (appliesTo === "any") {
        return true;
    }

    return appliesTo === context.testKind;
}

export function getDifficultyModifiersFromLocationAttachments(
    locationAttachments: LocationAttachment[],
    context: DifficultyModifierContext,
): DifficultyModifierDetail[] {
    if (!context.locationId) {
        return [];
    }

    const details: DifficultyModifierDetail[] = [];

    for (const attachment of locationAttachments) {
        if (attachment.attachedLocationId !== context.locationId) {
            continue;
        }

        const modifiers = attachment.difficultyModifiers ?? [];

        for (const modifier of modifiers) {
            if (!modifierApplies(modifier, context)) {
                continue;
            }

            details.push({
                source: attachment.name,
                amount: modifier.amount,
            });
        }
    }

    return details;
}
