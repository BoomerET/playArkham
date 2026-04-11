import type { EncounterCard } from "../types/game";

export type EncounterCardDefinition = Omit<EncounterCard, "id">;

export const encounterCards: EncounterCard[] = [
    {
        id: "servant-of-flame",
        code: "12114",
        name: "Servant of Flame",
        subname: "Raging Fury",
        type: "enemy",
        ability: [
            "Hunter",
            "Prey (lowest SPD)",
            "Retaliate."
        ],
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
        victoryPoints: 2,
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
        text: [
            "Forced - When this enemy is defeated: Each investigator at it's location takes 1 horror.",
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
        subname: "Head Librarian",
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
    },
    {
        id: "servant-of-flame_2",
        code: "12138",
        name: "Servant of Flame",
        subname: "On the Run",
        type: "enemy",
        ability: ["Elusive", "Hunter", "Retaliate."],
        damage: 2,
        horror: 2,
        fight: 4,
        health: 5,
        evade: 4,
        set: "smoke-and-mirrors",
        text: [
            "Forced - When Servant of Flame is defeated (INT Theta)"
        ],
        traits: [
            "Humanoid",
            "Cultist",
            "Elite",
        ],
        inEncounterDeck: false,
        victoryPoints: 1,
    },
    {
        id: "mark-of-elokoss",
        code: "12137",
        name: "Mark of Elokoss",
        type: "weakness",
        text: [
            "Revelation - Put Mark of Elokoss into play in your threat area.",
            "Forced - When your turn ends: Take 1 damage. Assign that damage to an asset you control, if able.",
            "Action x2: Discard Mark of Elokoss.",
        ],
        set: "smoke-and-mirrors",
        traits: [
            "Curse",
        ],
        inEncounterDeck: false,
    },
    {
        id: "david-renfield",
        code: "12139",
        name: "David Renfield",
        subname: "Disillusioned Eschatologist",
        type: "enemy",
        text: [
            "Reaction - After you successfully investigate David Renfield's location.",
        ],
        damage: 0,
        horror: 1,
        fight: 1,
        health: 5,
        evade: 4,
        set: "people-of-arkham",
        traits: [
            "Humanoid",
            "Silver Twilight",
            "Elite",
        ],
        inEncounterDeck: false,
        victoryPoints: 1,
        ability: [
            "Aloof"
        ],
    },
    {
        id: "cornelia-akely",
        code: "12140",
        name: "Cornelia Akely",
        subname: "Exhausted Supervisor",
        type: "enemy",
        text: [
            "Alert. After you fail a skill test while evading this enemy, it attacks you.",
            "Reaction - After you successfully evade Cornelia Akely: Ready her (int 2)",
        ],
        damage: 1,
        horror: 0,
        fight: 3,
        health: 4,
        evade: 3,
        set: "people-of-arkham",
        traits: [
            "Humanoid",
            "Worker",
            "Elite",
        ],
        inEncounterDeck: false,
        victoryPoints: 1,
    },
    {
        id: "naomi-o-bannion",
        code: "12141",
        name: "Naomi O'Bannion",
        subname: "Runs This Town",
        type: "enemy",
        text: [
            "Retaliate. (After you fail a skill test while fighting this enemy, it attacks you.)",
            "Action: Spend 1 resource: Parley. (INT 3)",
        ],
        damage: 1,
        horror: 1,
        fight: 4,
        health: 5,
        evade: 2,
        set: "people-of-arkham",
        traits: [
            "Humanoid",
            "Syndicate",
            "Elite",
        ],
        inEncounterDeck: false,
        victoryPoints: 1,
    },
    {
        id: "sgt-earl-monroe",
        code: "12142",
        name: "Sgt. Earl Monroe",
        subname: "Dirty Cop",
        type: "enemy",
        text: [
            "Elusive. (After this enemy attacks or is attacked while it is ready, it moves to a connection location with no investigators and exhausts.)",
            "Action: Parley. Test COM (4). Decrease the difficulty for this test by 1 for each damage on Sgt. Earl Montor. If you succeed, (INT 4)",
        ],
        damage: 1,
        horror: 1,
        fight: 3,
        health: 4,
        evade: 3,
        set: "people-of-arkham",
        traits: [
            "Humanoid",
            "Police",
            "Elite",
        ],
        inEncounterDeck: false,
        victoryPoints: 1,
    },
    {
        id: "abigail-foreman",
        code: "12143",
        name: "Abigail Foreman",
        subname: "Wary Librarian",
        type: "enemy",
        text: [
            "Action: Parley. Test INT (X), where X is the number of clues on Abigail Foreman's location. If you succeed, place 1 clue (from the token pool) on Abigail Foreman's location. (Del 5)",
        ],
        damage: 0,
        horror: 1,
        fight: 2,
        health: 4,
        evade: 4,
        set: "people-of-arkham",
        traits: [
            "Humanoid",
            "Miskatonic",
            "Elite",
        ],
        inEncounterDeck: false,
        victoryPoints: 1,
        ability: [
            "Aloof"
        ],
    },
    {
        id: "maragaret-lui",
        code: "12144",
        name: "Margaret Lui",
        subname: "Beguiling Lounge Singer",
        type: "enemy",
        text: [
            "Reaction: After you succeed at a skill test by 2 or more at Margaret Liu's location: (Del 6)",
        ],
        damage: 0,
        horror: 1,
        fight: 1,
        health: 3,
        evade: 5,
        set: "people-of-arkham",
        traits: [
            "Humanoid",
            "Socialite",
            "Elite",
        ],
        inEncounterDeck: false,
        victoryPoints: 1,
        ability: [
            "Aloof"
        ],
    },
    {
        id: "arcane-lock",
        code: "12157",
        name: "Arcane Lock",
        type: "treachery",
        text: [
            "Revelation - Attach Arcane Lock to your location. Limit 1 per location.",
            "As an additional cost to enter or leave attached location you must spend 1 actions.",
            "Action: Test WIL or INT (4). If you succeed, discard Arcane Lock.",
        ],
        set: "arcane-lock",
        traits: [
            "Hex",
            "Obstacle",
        ],
        inEncounterDeck: true,
    },
    {
        id: "downpour",
        code: "12158",
        name: "Downpour",
        type: "treachery",
        text: [
            "Revelation - Test SPD (3). For each point you fail by, you must either lose 1 action or place 1 of your clues on your location.",
        ],
        set: "bad-weather",
        traits: [
            "Hazard",
        ],
        inEncounterDeck: true,
    },
    {
        id: "flash-flood",
        code: "12159",
        name: "Flash Flood",
        type: "treachery",
        text: [
            "Revelation - Attach Flash Flood to your lacation. Attached location gets +4 shroud.",
            "Forced - When the round ends: Discard Flash Flood."
        ],
        set: "bad-weather",
        traits: [
            "Hazard",
        ],
        inEncounterDeck: true,
    },
    {
        id: "raising-suspicions",
        code: "12160",
        name: "Raising Suspicions",
        type: "treachery",
        text: [
            "Revelation - Place 1 doom on the nearest enemy with no doom on it. If no doom was placed by this effect, Raising Suspicions gains surge.",
        ],
        set: "dead-ends",
        traits: [
            "Blunder",
        ],
        inEncounterDeck: true,
    },
    {
        id: "red-herring",
        code: "12161",
        name: "Red Herring",
        type: "treachery",
        text: [
            "Revelation - Test INT (2). This test gets +2 difficulty if you control 2 or more clues. If you fail, take 1 horror and place 1 of your clues on your location.",
        ],
        set: "dead-ends",
        traits: [
            "Scheme",
        ],
        inEncounterDeck: true,
    },
    {
        id: "bat-horror",
        code: "12162",
        name: "Bat Horror",
        type: "enemy",
        damage: 1,
        horror: 1,
        fight: 3,
        health: 4,
        evade: 4,
        set: "flying-terrors",
        traits: [
            "Monster",
        ],
        ability: [
            "Elusive",
            "Hunter",
        ],
        inEncounterDeck: true,
    },
    {
        id: "aerial-pursuit",
        code: "12163",
        name: "Aerial Pursuit",
        type: "treachery",
        text: [
            "Revelation - The nearest non-Elite enemy moves once toward your location. If it engages an investigator, it makes an immediate attack.",
        ],
        set: "flying-terrors",
        traits: [
            "Hazard",
        ],
        inEncounterDeck: true,
        ability: [
            "Surge",
        ],
    },
    {
        id: "rogue-gangster",
        code: "12164",
        name: "Rogue Gangster",
        type: "enemy",
        damage: 1,
        horror: 0,
        fight: 3,
        health: 3,
        evade: 3,
        set: "gangs-of-arkham",
        traits: [
            "Humanoid",
            "Syndicate",
        ],
        ability: [
            "Hunter",
            "Prey (most resources)",
            "Retaliate",
        ],
        text: [
            "Forced - After Rogue Gangster engages you: Lose 1 resource. If you cannot, this enemy attacks you.",
        ],
        inEncounterDeck: true,
    },
    {
        id: "crossfire",
        code: "12165",
        name: "Crossfire",
        type: "treachery",
        text: [
            "Revelation - Test SPD (3). If you fail, each investigator at your locations takes 1 damage.",
        ],
        set: "gangs-of-arkham",
        traits: [
            "Hazard",
        ],
        inEncounterDeck: true,
    },
    {
        id: "whippoorwill",
        code: "12166",
        name: "Whippoorwill",
        type: "enemy",
        damage: 0,
        horror: 1,
        fight: 2,
        health: 1,
        evade: 4,
        set: "whipporwills",
        traits: [
            "Creature",
        ],
        ability: [
            "Aloof",
            "Hunter",
        ],
        text: [
            "Each investigator at Whippoorwill's location gets -1 WIL, -1 INT, -1 COM, and -1 SPD.",
        ],
        inEncounterDeck: true,
    },
    {
        id: "eager-for-death",
        code: "12167",
        name: "Eager for Death",
        type: "treachery",
        text: [
            "Revelation - Test INT (2). Increase this skill test's difficulty by 1 for each damage on you. If you fail, take 2 horror.",
        ],
        set: "whippoorwills",
        traits: [
            "Omen",
        ],
        inEncounterDeck: true,
    },

    /*
    This is my test card
    */

    {
        id: "davesaloof",
        code: "14001",
        name: "Dave's Test Encounter",
        type: "enemy",
        damage: 1,
        horror: 1,
        fight: 2,
        health: 1,
        evade: 4,
        set: "daves-tests",
        traits: [
            "Creature",
        ],
        ability: [
            "Aloof",
            "Hunter",
        ],
        text: [
            "This is an ememy that I use for testing.",
        ],
        inEncounterDeck: true,
    },


];

export const encounterCardsByCode: Record<string, EncounterCardDefinition> =
    Object.fromEntries(encounterCards.map((card) => [card.code, card]));