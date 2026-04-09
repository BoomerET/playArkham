import type { EncounterCard } from "../types/game";

export type EncounterCardDefinition = Omit<EncounterCard, "id">;

export const encounterCards: EncounterCard[] = [
    {
        id: "servant-of-flame",
        code: "12114",
        name: "Servant of Flame",
        type: "enemy",
        ability: ["Hunter", "Prey (lowest speed)", "Retaliate."],
        damage: 2,
        horror: 2,
        fight: 4,
        health: 5,
        evade: 4,
        set: "spreading-flames",
        traits: [
            "Humanoid",
            "Elite"
        ],
        inEncounterDeck: false,
    },
    {
        id: "cantor-of-flame",
        code: "12121",
        name: "Cantor of Flame",
        type: "enemy",
        ability: ["Retaliate"],
        damage: 1,
        horror: 0,
        fight: 2,
        health: 2,
        evade: 2,
        set: "ashen-pilgrims",
        traits: [
            "Humanoid",
            "Cultist"
        ],
        inEncounterDeck: true,
    },
    {
        id: "hellhound",
        code: "12122",
        name: "Hellhound",
        type: "enemy",
        ability: ["Hunter"],
        text: [
            "Forced - After Hellhound attacks you during the enemy phase: Choose and discard 1 asset you control."
        ],
        damage: 1,
        horror: 1,
        fight: 2,
        health: 3,
        evade: 4,
        set: "ashen-pilgrims",
        traits: [
            "Creature",
            "Monster"
        ],
        inEncounterDeck: true,
    },
    {
        id: "bystander",
        code: "12123",
        name: "Bystander",
        type: "enemy",
        ability: ["Doomed"],
        text: [
            "When this enemy is defeated, place 1 doom on the current agenda. This effect can cause the current agenda to advance"
        ],
        damage: 1,
        horror: 0,
        fight: 1,
        health: 1,
        evade: 1,
        set: "bystanders",
        traits: [
            "Humanoid",
            "Civilian"
        ],
        inEncounterDeck: true,
    },
    {
        id: "cosmic-evils",
        code: "12124",
        name: "Cosmic Evils",
        type: "treachery",
        ability: ["Peril"],
        text: [
            "Revelation - You must either (choose one): Place 1 doom on the current agenda. This effect can cause the agenta to advance. OR Take 1 direct damage and 1 direct horror. Cosmic Evils gains surge"
        ],
        set: "cosmic-evils",
        traits: [
            "Omen",
        ],
        inEncounterDeck: true,
    },
    {
        id: "unspeakable-truths",
        code: "12125",
        name: "Unspeakable Truths",
        type: "treachery",
        text: [
            "Revelation - Put Unspeakable Truths into play in your threat area. Limit 1 per investigator.",
            "Forced - After you discover 1 or more clues: Take 1 Horror",
            "Spend 2 actions to Discard"
        ],
        set: "eldritch-lore",
        traits: [
            "Terror",
        ],
        inEncounterDeck: true,
    },
    {
        id: "forbidden-secrets",
        code: "12126",
        name: "Forbidden Secrets",
        type: "treachery",
        text: [
            "Revelation - If you have no clues, Forbidden Secrets gains surge. Otherwise test INT (3). For each point you fail by, you must either place 1 of your clues on your location, or take 1 horror."
        ],
        set: "eldritch-lore",
        traits: [
            "Pact",
        ],
        inEncounterDeck: true,
    },
    {
        id: "extraplanar-visions",
        code: "12127",
        name: "Extraplanar Vision",
        type: "treachery",
        text: [
            "Revelation - Test WIL or INT (X), where X is the number of cards in your hand. If you fail, take 1 damage and discard 1 card at random from your hand."
        ],
        set: "hallucinations",
        traits: [
            "Power",
        ],
        inEncounterDeck: true,
    },
    {
        id: "wild-compulsion",
        code: "12128",
        name: "Wild Compulsion",
        type: "treachery",
        text: [
            "Revelation - Test WIL (3), For each point you fail by, you must either discard 1 card at random from your hand, or lose 1 resource."
        ],
        set: "hallucinations",
        traits: [
            "Madness",
            "Bane"
        ],
        inEncounterDeck: true,
    },
    {
        id: "fire",
        code: "12129",
        name: "Fire!",
        type: "treachery",
        text: [
            "Revelation - Attach Fire! to the nearest location without Fire! attached.",
            "Forced - When the investigation phase ends: Each non-Elite card with health at this location takes 1 direct damage",
            "Action: Test SPD (3). If you succeed, discard Fire!",
        ],
        set: "fire",
        traits: [
            "Hazard",
        ],
        inEncounterDeck: false,
    },
    {
        id: "noxious-smoke",
        code: "12130",
        name: "Noxious Smoke",
        type: "treachery",
        text: [
            "Revelation - Test WIL or SPD (3). Take 1 damage for each point you fail by.",
        ],
        set: "fire",
        traits: [
            "Hazard",
        ],
        inEncounterDeck: true,
    },
    {
        id: "mutated",
        code: "12131",
        name: "Mutated!",
        type: "treachery",
        text: [
            "Revelation - Test WIL (2). This test gets +2 difficulty if there is an enemy at your location. If you fail, you must either take 2 damage, or each investigator at your location takes 1 horror.",
        ],
        set: "mad-science",
        traits: [
            "Mutation",
        ],
        inEncounterDeck: true,
    },
    {
        id: "mutated-experiment",
        code: "12132",
        name: "Mutated Experiment",
        type: "enemy",
        ability: ["Retaliate"],
        text: [
            "Forced - AWhen this enemy is defeated: Each investigator at it's location takes 1 horror.",
        ],
        damage: 1,
        horror: 1,
        fight: 3,
        health: 3,
        evade: 3,
        set: "mad-science",
        traits: [
            "Creature",
            "Mutated"
        ],
        inEncounterDeck: true,
    },
    {
        id: "dr-henry-armitage",
        code: "12115",
        name: "Dr. Henry Armitage",
        type: "ally",
        text: [
            "You get +1 WIL and +1 INT",
            "The first action you perform each round does not provoke attacks of opportunity."
        ],
        set: "spreading-flames",
        traits: [
            "Ally",
            "Miskatonic"
        ],
        inEncounterDeck: false,
    }
];

export const encounterCardsByCode: Record<string, EncounterCardDefinition> =
    Object.fromEntries(encounterCards.map((card) => [card.code, card]));