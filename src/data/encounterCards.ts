import type { EncounterCard } from "../types/game";

export type EncounterCardDefinition = Omit<EncounterCard, "id">;

export const encounterCards: EncounterCard[] = [
    {
        id: "servant-of-flame",
        code: "12114",
        name: "Servant of Flame",
        subname: "Raging Fury",
        type: "enemy",

        fight: 4,
        health: 5,
        evade: 4,
        damage: 2,
        horror: 2,
        victoryPoints: 2,

        traits: [
            "Humanoid",
            "Elite",
        ],

        ability: [
            "Hunter",
            "Prey (lowest SPD)",
            "Retaliate",
        ],

        set: "spreading-flames",
    },
    {
        id: "cantor-of-flame",
        code: "12121",
        name: "Cantor of Flame",
        type: "enemy",

        fight: 2,
        health: 2,
        evade: 2,
        damage: 1,
        horror: 0,
        traits: [
            "Humanoid",
            "Cultist",
        ],

        ability: [
            "Retaliate",
        ],

        set: "ashen-pilgrims",
    },
    {
        id: "hellhound",
        code: "12122",
        name: "Hellhound",
        type: "enemy",

        fight: 2,
        health: 3,
        evade: 4,
        damage: 1,
        horror: 1,
        traits: [
            "Creature",
            "Monster",
        ],

        ability: [
            "Hunter",
        ],

        text: [
            "Forced - After Hellhound attacks you during the enemy phase: Choose and discard 1 asset you control.",
        ],

        set: "ashen-pilgrims",
    },
    {
        id: "bystander",
        code: "12123",
        name: "Bystander",
        type: "enemy",

        fight: 1,
        health: 1,
        evade: 1,
        damage: 1,
        horror: 0,
        traits: [
            "Humanoid",
            "Civilian",
        ],

        ability: [
            "Doomed",
        ],

        text: [
            "When this enemy is defeated, place 1 doom on the current agenda. This effect can cause the current agenda to advance",
        ],

        set: "bystanders",
    },
    {
        id: "cosmic-evils",
        code: "12124",
        name: "Cosmic Evils",
        type: "treachery",

        traits: [
            "Omen",
        ],

        ability: [
            "Peril",
        ],

        text: [
            "Revelation - You must either (choose one): Place 1 doom on the current agenda. This effect can cause the agenta to advance. OR Take 1 direct damage and 1 direct horror. Cosmic Evils gains surge",
        ],

        set: "cosmic-evils",
    },
    {
        id: "unspeakable-truths",
        code: "12125",
        name: "Unspeakable Truths",
        type: "treachery",

        traits: [
            "Terror",
        ],

        text: [
            "Revelation - Put Unspeakable Truths into play in your threat area. Limit 1 per investigator.",
            "Forced - After you discover 1 or more clues: Take 1 Horror",
            "Spend 2 actions to Discard",
        ],

        set: "eldritch-lore",
    },
    {
        id: "forbidden-secrets",
        code: "12126",
        name: "Forbidden Secrets",
        type: "treachery",

        traits: [
            "Pact",
        ],

        text: [
            "Revelation - If you have no clues, Forbidden Secrets gains surge. Otherwise test INT (3). For each point you fail by, you must either place 1 of your clues on your location, or take 1 horror.",
        ],

        set: "eldritch-lore",
    },
    {
        id: "extraplanar-visions",
        code: "12127",
        name: "Extraplanar Vision",
        type: "treachery",

        traits: [
            "Power",
        ],

        text: [
            "Revelation - Test WIL or INT (X), where X is the number of cards in your hand. If you fail, take 1 damage and discard 1 card at random from your hand.",
        ],

        set: "hallucinations",
    },
    {
        id: "wild-compulsion",
        code: "12128",
        name: "Wild Compulsion",
        type: "treachery",

        traits: [
            "Madness",
            "Bane",
        ],

        text: [
            "Revelation - Test WIL (3), For each point you fail by, you must either discard 1 card at random from your hand, or lose 1 resource.",
        ],

        set: "hallucinations",
    },
    {
        id: "fire",
        code: "12129",
        name: "Fire!",
        type: "treachery",

        traits: [
            "Hazard",
        ],

        text: [
            "Revelation - Attach Fire! to the nearest location without Fire! attached.",
            "Forced - When the investigation phase ends: Each non-Elite card with health at this location takes 1 direct damage",
            "Action: Test SPD (3). If you succeed, discard Fire!",
        ],

        set: "fire",
    },
    {
        id: "noxious-smoke",
        code: "12130",
        name: "Noxious Smoke",
        type: "treachery",

        traits: [
            "Hazard",
        ],

        text: [
            "Revelation - Test WIL or SPD (3). Take 1 damage for each point you fail by.",
        ],

        set: "fire",
    },
    {
        id: "mutated",
        code: "12131",
        name: "Mutated!",
        type: "treachery",

        traits: [
            "Mutation",
        ],

        text: [
            "Revelation - Test WIL (2). This test gets +2 difficulty if there is an enemy at your location. If you fail, you must either take 2 damage, or each investigator at your location takes 1 horror.",
        ],

        set: "mad-science",
    },
    {
        id: "mutated-experiment",
        code: "12132",
        name: "Mutated Experiment",
        type: "enemy",

        fight: 3,
        health: 3,
        evade: 3,
        damage: 1,
        horror: 1,
        traits: [
            "Creature",
            "Mutated",
        ],

        text: [
            "Forced - When this enemy is defeated: Each investigator at it's location takes 1 horror.",
        ],

        set: "mad-science",
    },
    {
        id: "dr-henry-armitage",
        code: "12115",
        name: "Dr. Henry Armitage",
        subname: "Head Librarian",
        type: "ally",

        traits: [
            "Ally",
            "Miskatonic",
        ],

        text: [
            "You get +1 WIL and +1 INT",
            "The first action you perform each round does not provoke attacks of opportunity.",
        ],

        set: "spreading-flames",
    },
    {
        id: "servant-of-flame_2",
        code: "12138",
        name: "Servant of Flame",
        subname: "On the Run",
        type: "enemy",

        fight: 4,
        health: 5,
        evade: 4,
        damage: 2,
        horror: 2,
        victoryPoints: 1,

        traits: [
            "Humanoid",
            "Cultist",
            "Elite",
        ],

        ability: [
            "Elusive",
            "Hunter",
            "Retaliate.",
        ],

        text: [
            "Forced - When Servant of Flame is defeated (INT Theta)",
        ],

        set: "smoke-and-mirrors",
    },
    {
        id: "mark-of-elokoss",
        code: "12137",
        name: "Mark of Elokoss",
        type: "weakness",

        traits: [
            "Curse",
        ],

        text: [
            "Revelation - Put Mark of Elokoss into play in your threat area.",
            "Forced - When your turn ends: Take 1 damage. Assign that damage to an asset you control, if able.",
            "Action x2: Discard Mark of Elokoss.",
        ],

        set: "smoke-and-mirrors",
    },
    {
        id: "david-renfield",
        code: "12139",
        name: "David Renfield",
        subname: "Disillusioned Eschatologist",
        type: "enemy",

        fight: 1,
        health: 5,
        evade: 4,
        damage: 0,
        horror: 1,
        victoryPoints: 1,

        traits: [
            "Humanoid",
            "Silver Twilight",
            "Elite",
        ],

        ability: [
            "Aloof",
        ],

        text: [
            "Reaction - After you successfully investigate David Renfield's location.",
        ],

        set: "people-of-arkham",
    },
    {
        id: "cornelia-akely",
        code: "12140",
        name: "Cornelia Akely",
        subname: "Exhausted Supervisor",
        type: "enemy",

        fight: 3,
        health: 4,
        evade: 3,
        damage: 1,
        horror: 0,
        victoryPoints: 1,

        traits: [
            "Humanoid",
            "Worker",
            "Elite",
        ],

        text: [
            "Alert. After you fail a skill test while evading this enemy, it attacks you.",
            "Reaction - After you successfully evade Cornelia Akely: Ready her (int 2)",
        ],

        set: "people-of-arkham",
    },
    {
        id: "naomi-o-bannion",
        code: "12141",
        name: "Naomi O'Bannion",
        subname: "Runs This Town",
        type: "enemy",

        fight: 4,
        health: 5,
        evade: 2,
        damage: 1,
        horror: 1,
        victoryPoints: 1,

        traits: [
            "Humanoid",
            "Syndicate",
            "Elite",
        ],

        text: [
            "Retaliate. (After you fail a skill test while fighting this enemy, it attacks you.)",
            "Action: Spend 1 resource: Parley. (INT 3)",
        ],

        set: "people-of-arkham",
    },
    {
        id: "sgt-earl-monroe",
        code: "12142",
        name: "Sgt. Earl Monroe",
        subname: "Dirty Cop",
        type: "enemy",

        fight: 3,
        health: 4,
        evade: 3,
        damage: 1,
        horror: 1,
        victoryPoints: 1,

        traits: [
            "Humanoid",
            "Police",
            "Elite",
        ],

        text: [
            "Elusive. (After this enemy attacks or is attacked while it is ready, it moves to a connection location with no investigators and exhausts.)",
            "Action: Parley. Test COM (4). Decrease the difficulty for this test by 1 for each damage on Sgt. Earl Montor. If you succeed, (INT 4)",
        ],

        set: "people-of-arkham",
    },
    {
        id: "abigail-foreman",
        code: "12143",
        name: "Abigail Foreman",
        subname: "Wary Librarian",
        type: "enemy",

        fight: 2,
        health: 4,
        evade: 4,
        damage: 0,
        horror: 1,
        victoryPoints: 1,

        traits: [
            "Humanoid",
            "Miskatonic",
            "Elite",
        ],

        ability: [
            "Aloof",
        ],

        text: [
            "Action: Parley. Test INT (X), where X is the number of clues on Abigail Foreman's location. If you succeed, place 1 clue (from the token pool) on Abigail Foreman's location. (Del 5)",
        ],

        set: "people-of-arkham",
    },
    {
        id: "maragaret-lui",
        code: "12144",
        name: "Margaret Lui",
        subname: "Beguiling Lounge Singer",
        type: "enemy",

        fight: 1,
        health: 3,
        evade: 5,
        damage: 0,
        horror: 1,
        victoryPoints: 1,

        traits: [
            "Humanoid",
            "Socialite",
            "Elite",
        ],

        ability: [
            "Aloof",
        ],

        text: [
            "Reaction: After you succeed at a skill test by 2 or more at Margaret Liu's location: (Del 6)",
        ],

        set: "people-of-arkham",
    },
    {
        id: "arcane-lock",
        code: "12157",
        name: "Arcane Lock",
        type: "treachery",

        traits: [
            "Hex",
            "Obstacle",
        ],

        text: [
            "Revelation - Attach Arcane Lock to your location. Limit 1 per location.",
            "As an additional cost to enter or leave attached location you must spend 1 actions.",
            "Action: Test WIL or INT (4). If you succeed, discard Arcane Lock.",
        ],

        set: "arcane-lock",
    },
    {
        id: "downpour",
        code: "12158",
        name: "Downpour",
        type: "treachery",

        traits: [
            "Hazard",
        ],

        text: [
            "Revelation - Test SPD (3). For each point you fail by, you must either lose 1 action or place 1 of your clues on your location.",
        ],

        set: "bad-weather",
    },
    {
        id: "flash-flood",
        code: "12159",
        name: "Flash Flood",
        type: "treachery",

        traits: [
            "Hazard",
        ],

        text: [
            "Revelation - Attach Flash Flood to your lacation. Attached location gets +4 shroud.",
            "Forced - When the round ends: Discard Flash Flood.",
        ],

        set: "bad-weather",
    },
    {
        id: "raising-suspicions",
        code: "12160",
        name: "Raising Suspicions",
        type: "treachery",

        traits: [
            "Blunder",
        ],

        text: [
            "Revelation - Place 1 doom on the nearest enemy with no doom on it. If no doom was placed by this effect, Raising Suspicions gains surge.",
        ],

        set: "dead-ends",
    },
    {
        id: "red-herring",
        code: "12161",
        name: "Red Herring",
        type: "treachery",

        traits: [
            "Scheme",
        ],

        text: [
            "Revelation - Test INT (2). This test gets +2 difficulty if you control 2 or more clues. If you fail, take 1 horror and place 1 of your clues on your location.",
        ],

        set: "dead-ends",
    },
    {
        id: "bat-horror",
        code: "12162",
        name: "Bat Horror",
        type: "enemy",

        fight: 3,
        health: 4,
        evade: 4,
        damage: 1,
        horror: 1,
        traits: [
            "Monster",
        ],

        ability: [
            "Elusive",
            "Hunter",
        ],

        set: "flying-terrors",
    },
    {
        id: "aerial-pursuit",
        code: "12163",
        name: "Aerial Pursuit",
        type: "treachery",

        traits: [
            "Hazard",
        ],

        ability: [
            "Surge",
        ],

        text: [
            "Revelation - The nearest non-Elite enemy moves once toward your location. If it engages an investigator, it makes an immediate attack.",
        ],

        set: "flying-terrors",
    },
    {
        id: "rogue-gangster",
        code: "12164",
        name: "Rogue Gangster",
        type: "enemy",

        fight: 3,
        health: 3,
        evade: 3,
        damage: 1,
        horror: 0,
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

        set: "gangs-of-arkham",
    },
    {
        id: "crossfire",
        code: "12165",
        name: "Crossfire",
        type: "treachery",

        traits: [
            "Hazard",
        ],

        text: [
            "Revelation - Test SPD (3). If you fail, each investigator at your locations takes 1 damage.",
        ],

        set: "gangs-of-arkham",
    },
    {
        id: "whippoorwill",
        code: "12166",
        name: "Whippoorwill",
        type: "enemy",

        fight: 2,
        health: 1,
        evade: 4,
        damage: 0,
        horror: 1,
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

        set: "whipporwills",
    },
    {
        id: "eager-for-death",
        code: "12167",
        name: "Eager for Death",
        type: "treachery",

        traits: [
            "Omen",
        ],

        text: [
            "Revelation - Test INT (2). Increase this skill test's difficulty by 1 for each damage on you. If you fail, take 2 horror.",
        ],

        set: "whippoorwills",
    },
    {
        id: "servant-of-flame_3",
        code: "12180",
        name: "Servant of Flame",
        subname: "A Willing Sacrifice",
        type: "enemy",

        fight: 4,
        health: 5,
        evade: 4,
        damage: 2,
        horror: 2,
        victoryPoints: 2,

        traits: [
            "Humanoid",
            "Cultist",
            "Elite",
        ],

        ability: [
            "Hunter",
            "Retaliate",
        ],
        text: [
            "Forced - When Servant of Flame is defeated: (Codex Theta)",
        ],

        set: "queen-of-ash",
    },
    {
        id: "elokoss_a",
        code: "12179a",
        name: "Elokoss",
        subname: "Faint Embers",
        type: "enemy",

        fight: 5,
        health: 5,
        evade: 5,
        damage: 3,
        horror: 3,
        victoryPoints: 5,

        traits: [
            "Ancient One",
            "Flora",
            "Elite",
        ],
        ability: [
            "Massive",
            "Retaliate.",
        ],
        text: [
            "Elokoss gets +5 health, cannot move, and cannot make attacks of opportunity.",
            "Free - Spend 1 (Investigator) clues: Pleace 1 clue on Elokoss. If Elokoss has 5 clues on her, (-> R2) (page 14)",
        ],

        set: "queen-of-ash",
    },
    {
        id: "elokoss_b",
        code: "12179b",
        name: "Elokoss",
        subname: "Mother of Flame",
        type: "enemy",

        fight: 5,
        health: 5,
        evade: 5,
        damage: 3,
        horror: 3,
        victoryPoints: 5,

        traits: [
            "Ancient One",
            "Flora",
            "Elite",
        ],
        ability: [
            "Hunter",
            "Massive",
            "Retaliate.",
        ],
        text: [
            "Elokoss gets +5 health",
            "Forced - After you evade Elokoss: Ready her. She cannot attack you for the remainder of the round."
        ],

        set: "queen-of-ash",
    },
    {
        id: "herald-of-flame",
        code: "12178",
        name: "Herald of Flame",
        type: "enemy",

        fight: 4,
        health: 5,
        evade: 2,
        damage: 0,
        horror: 2,
        victoryPoints: 1,

        traits: [
            "Monster",
        ],
        ability: [
            "Hunter",
        ],
        text: [
            "Forced - After this enemy attacks: Heal 1 damage from each enemy at its location.",
        ],

        set: "queen-of-ash",
    },
    {
        id: "queens-knight",
        code: "12177",
        name: "Queen's Knight",
        type: "enemy",

        fight: 2,
        health: 5,
        evade: 2,
        damage: 2,
        horror: 0,
        victoryPoints: 1,

        traits: [
            "Humanoid",
            "Cultist",
        ],
        ability: [
            "Hunter",
        ],
        text: [
            "Forced - When Queen's Knight takes 1 or more damage: Deal 1 damage to Elokoss.",
        ],

        set: "queen-of-ash",
    },
    {
        id: "zealot",
        code: "12188",
        name: "Zealot",
        type: "enemy",

        fight: 2,
        health: 1,
        evade: 2,
        damage: 1,
        horror: 0,

        traits: [
            "Humanoid",
            "Cultist",
        ],
        ability: [
            "Aloof",
        ],
        text: [
            "Forced - After this enemy enters play: Place 1 doom on it.",
        ],

        set: "cultists",
    },
    {
        id: "languor",
        code: "12193",
        name: "Languor",
        type: "treachery",

        traits: [
            "Hex",
            "Bane",
        ],

        text: [
            "Revelation - Put Languor into play in your threat area. Limit 1 per investigator.",
            "Forced - After your turn begins: Discard the top card of your deck. If it is a weakness, draw it. Otherwise, you cannot play or commit cards of that type (asset, even, or skill) this round.",
            "Spend 2 actions to Discard",
        ],

        set: "torment",
    },
    {
        id: "dark-magician",
        code: "12189",
        name: "Dark Magician",
        subname: "Raging Fury",
        type: "enemy",

        fight: 4,
        health: 4,
        evade: 2,
        damage: 1,
        horror: 1,
        victoryPoints: 2,

        traits: [
            "Humanoid",
            "Cultist",
        ],
        ability: [
            "Hunter",
            "Retaliate.",
        ],
        text: [
            "Forced - When the round ends: Place 1 doom on the enemy with no doom on it nearest to Dark Magician.",
        ],

        set: "cultists",
    },
    {
        id: "collector",
        code: "12181",
        name: "Collector",
        type: "ally",
        traits: ["Talent",],
        text: [
            "Permanent. Reward. Limit 1 per deck. Purchase at deck creation.",
            "You get +5 deck size.",
            "Your investigator's Deckbuilding Options gains: \"one other Relic or Charm asset of any class\"",
            "(Guardian, Seeker, Rogue, Mystic, Survivor) level 0-3",
        ],
        set: "fix-me",
    },
    {
        id: "ashen-rebirth",
        code: "12176",
        name: "Ashen Rebirth",
        type: "treachery",
        traits: [
            "Power",
        ],

        text: [
            "Revelation - Test WIL (4). If you fail, you must either take 2 direct damage or 2 direct horror (whichever you have more of).",
        ],
        set: "queen-of-ash",
    },
    {
        id: "putrid-vapors",
        code: "12192",
        name: "Putrid Vapors",
        type: "treachery",
        traits: [
            "Hazard",
        ],
        text: [
            "Revelation - Test SPD (3). If you fail, take 1 horror and discard a non-story asset you control.",
        ],
        set: "reeking-decay",
    },
    {
        id: "unnatural-decay",
        code: "12191",
        name: "Unnatural Decay",
        type: "treachery",
        traits: [
            "Curse",
        ],

        text: [
            "Revelation - Test WIL (4). If you fail, you must either place 1 doom on an asset you control, or take 2 damage.",
        ],
        set: "reeking-decay",
    },
    {
        id: "torment",
        code: "12195",
        name: "Torment",
        type: "treachery",
        traits: [
            "Power",
            "Bane",
        ],
        ability: [
            "Peril",
        ],
        text: [
            "Revelation - Test WIL (3). If you fail, name a cardtype (asset, event, or skill). Each invetigator discards 1 card of the named type from their hand.",
        ],
        set: "torment",
    },
    {
        id: "dissonance",
        code: "12194",
        name: "Dissonance",
        type: "treachery",
        traits: [
            "Curse",
            "Bane",
        ],
        text: [
            "Revelation - Test WIL (3). If you fail, lose 1 action and choose a cardtype (asset, event, or skill). Discard all non-weakness cards of the chosen type from your hand.",
        ],
        set: "torment",
    },
    {
        id: "blasphemous-invocation",
        code: "12190",
        name: "Blasphemous Invocation",
        type: "treachery",
        traits: [
            "Hex",
        ],

        text: [
            "Revelation - Test WIL (3). For each point you fail by, place 1 doom on a Cultist enemy with no doom on it. If you fail and no doom was placed, search the encounter deck and discard pile for a Cultist enemy and draw it. (Shuffle the encounter deck if it was searched)",
        ],
        set: "cultist",
    },
    /*
      This is my test card
    */
    {
        id: "davestestenemy",
        code: "14001",
        name: "Dave's Test Enemy",
        type: "enemy",

        fight: 1,
        health: 1,
        evade: 1,
        damage: 1,
        horror: 1,
        traits: [
            "Creature",
        ],

        ability: [
            "Hunter",
            "Aloof",
        ],
        //abilities: [
        //    {
        //        label: "Death Rattle",
        //        trigger: "forced",
        //        event: "enemyDefeated",
        //        text: "Forced — When this enemy is defeated, take 7 horror.",
        //        effect: { kind: "takeHorror", amount: 7 },
        //    },
        //],

        victoryPoints: 2,

        text: [
            "This is an ememy that I use for testing.",
        ],

        set: "daves-tests",
    },
    {
        id: "davestesttreachery",
        code: "14002",
        name: "Dave's Test Treachery",
        type: "treachery",
        traits: [
            "Omen",
            "Cultist",
        ],
        ability: [
            "Peril",
        ],
        abilities: [
            {
                label: "Lingering Pain",
                trigger: "forced",
                event: "turnEnds",
                text: "Forced — When your turn ends, take 1 damage.",
                effect: { kind: "takeDamage", amount: 10 },
            },
            {
                label: "Draining Burden",
                trigger: "forced",
                event: "turnBegins",
                text: "Forced — When your turn begins, gain 1 resource.",
                effect: { kind: "gainResources", amount: 10 },
            },
        ],
        text: [
            "Revelation - Flavor text.",
        ],
        set: "daves-tests",
    },
    {
        id: "davestestspawn",
        code: "14003",
        name: "Dave's Test Spawn",
        type: "enemy",

        fight: 1,
        health: 1,
        evade: 1,
        damage: 1,
        horror: 1,
        traits: [
            "Humanoid",
            "Cultist",
        ],

        ability: [
            "Hunter",
            //"Parley",
        ],

        text: [
            "This is an ememy that I use for testing.",
        ],

        set: "daves-tests",
    },
    {
        id: "davestestenemy2",
        code: "14004",
        name: "Dave's Test Enemy 2",
        type: "enemy",

        fight: 1,
        health: 1,
        evade: 1,
        damage: 1,
        horror: 1,
        traits: [
            "Creature",
        ],

        ability: [
            "Aloof",
        ],

        text: [
            "This is an ememy that I use for testing.",
        ],

        set: "daves-tests",
    },
    {
        id: "davestestenemy3",
        code: "14005",
        name: "Dave's Test Enemy 3",
        type: "enemy",
        fight: 1,
        health: 1,
        evade: 1,
        damage: 1,
        horror: 1,
        traits: [
            "Creature",
        ],
        ability: [
            "Aloof",
        ],
        text: [
            "This is an ememy that I use for testing.",
        ],
        set: "daves-tests",
    },
    {
        id: "davestestenemy4",
        code: "14006",
        name: "Dave's Test Enemy 4",
        type: "enemy",
        fight: 1,
        health: 1,
        evade: 1,
        damage: 1,
        horror: 1,
        traits: [
            "Creature",
        ],
        ability: [
            "Aloof",
        ],
        text: [
            "This is an ememy that I use for testing.",
        ],
        set: "daves-tests",
    },
    {
        id: "davestestenemy5",
        code: "14007",
        name: "Dave's Test Enemy 5",
        type: "enemy",
        fight: 1,
        health: 1,
        evade: 1,
        damage: 1,
        horror: 1,
        traits: [
            "Creature",
        ],
        ability: [
            "Aloof",
        ],
        text: [
            "This is an ememy that I use for testing.",
        ],
        set: "daves-tests",
    },
    {
        id: "davestestenemy6",
        code: "14008",
        name: "Dave's Test Enemy 6",
        type: "enemy",
        fight: 1,
        health: 1,
        evade: 1,
        damage: 1,
        horror: 1,
        traits: [
            "Creature",
        ],
        ability: [
            "Aloof",
        ],
        text: [
            "This is an ememy that I use for testing.",
        ],
        set: "daves-tests",
    },
];

export const encounterCardsByCode: Record<string, EncounterCardDefinition> =
    Object.fromEntries(encounterCards.map((card) => [card.code, card]));
