import type { ScenarioDefinition } from "./scenarioTypes";

export const spreadingFlamesScenario: ScenarioDefinition = {
  id: "spreading-flames",
  name: "Spreading Flames",
  description:
    "A recent spate of fires and grisly “accidents” have the entire city on edge.",
  startingLocationId: "friends-room",
  locations: [
    {
      id: "friends-room",
      name: "Your Friend's Room",
      shroud: 2,
      code: "12113",
      clues: 2,
      revealed: true,
      connections: ["dormitories"],
      investigatorsHere: [],
      mapPosition: { x: 22, y: 84 },
      isVisible: true,
      traits: [
        "Miskatonic"
      ],
      text: "Action: Engage - Choose an enemy at a connecting location. That enemy moves to this location and engages your. This action does not provoke attacks of opportunity.",
    },
    {
      id: "dormitories",
      name: "Dormitories",
      shroud: 3,
      clues: 1,
      revealed: false,
      connections: ["friends-room", "miskatonic-quad"],
      investigatorsHere: [],
      mapPosition: { x: 50, y: 84 },
      isVisible: false,
      traits: [
        "Miskatonic"
      ],
      text: "Action: Heal 1 damage and 1 horror. (Limit once per game)",
      code: "12117",
    },
    {
      id: "miskatonic-quad",
      name: "Miskatonic Quad",
      shroud: 1,
      clues: 0,
      revealed: false,
      connections: [
        "dormitories",
        "science-hall",
        "orne-library",
        "warren-observatory",
      ],
      investigatorsHere: [],
      mapPosition: { x: 50, y: 50 },
      isVisible: false,
      traits: [
        "Miskatonic",
        "Central"
      ],
      text: "Free: During your turn, if there are exactly 1 or 2 investigators in the game: Move to a connection location. (Group limit once per round.)",
      code: "12116",
    },
    {
      id: "science-hall",
      name: "Science Hall",
      shroud: 2,
      clues: 1,
      revealed: false,
      connections: ["miskatonic-quad"],
      investigatorsHere: [],
      mapPosition: { x: 78, y: 50 },
      isVisible: false,
      traits: [
        "Miskatonic"
      ],
      text: "Forced - After you discover 1 or more clues at Science Hall: Choose and discard 1 card from your hand.",
      victoryPoints: 1,
      code: "12118",
    },
    {
      id: "orne-library",
      name: "Orne Library",
      shroud: 4,
      clues: 1,
      revealed: false,
      connections: ["miskatonic-quad"],
      investigatorsHere: [],
      mapPosition: { x: 22, y: 50 },
      isVisible: false,
      traits: [
        "Miskatonic"
      ],
      text: "Action x2: Draw 3 cards (Limit once per game.)",
      victoryPoints: 1,
      code: "12120",
    },
    {
      id: "warren-observatory",
      name: "Warren Observatory",
      shroud: 3,
      clues: 1,
      revealed: false,
      connections: ["miskatonic-quad"],
      investigatorsHere: [],
      mapPosition: { x: 50, y: 16 },
      isVisible: false,
      traits: [
        "Miskatonic"
      ],
      text: "Reaction: After you discover 1 or more clues at this location: Draw 1 card (Limit once per round.)",
      code: "12119",
    },
  ],
  enemySpawns: [],
  acts: [
    {
      id: "spreading-flames-act-1a",
      kind: "act",
      sequence: "1a",
      title: "Where There's Smoke",
      text: "You are searching the dormitories for any sign of your friend.",
      threshold: 2,
      thresholdLabel: "Clues",
      code: "12109",
    },
    {
      id: "spreading-flames-act-1b",
      kind: "act",
      sequence: "1b",
      title: "There's Fire",
      text: "Discard each enemy in play.",
      threshold: 0,
      thresholdLabel: "Done",
      code: "12109",
    },
    {
      id: "spreading-flames-act-2a",
      kind: "act",
      sequence: "2a",
      title: "Escape the Dorms",
      text: "A burning apparition stands between you and the exit. You must escape the dormitories.",
      threshold: 2,
      thresholdLabel: "Clues",
      onAdvance: {
        showLocationIds: ["dormitories", "miskatonic-quad"],
      },
      code: "12110",
    },
    {
      id: "spreading-flames-act-2b",
      kind: "act",
      sequence: "2b",
      title: "In the Open",
      text: "Search all in-play and all out-of-play areas for the Servant of Flame.",
      threshold: 0,
      thresholdLabel: "Done",
      code: "12110",
    },
    {
      id: "spreading-flames-act-3a",
      kind: "act",
      sequence: "3a",
      title: "Searching for Dr. Armitage",
      text: "Your friend had mentioned visiting the head librarian, Dr. Henry Armitage. With more and more strange figures arriving, you must scour the campus for his whereabouts.",
      threshold: 3,
      thresholdLabel: "Clues",
      onAdvance: {
        showLocationIds: ["orne-library", "science-hall", "warren-observatory"],
        hideLocationIds: ["friends-room"],
        grantEncounterCardToInvestigator: "dr-henry-armitage-1",
      },
      code: "12111",
    },

    {
      id: "spreading-flames-act-3b",
      kind: "act",
      sequence: "3b",
      title: "The Servant Unleashed",
      text: "You find Dr. Armitage barricaded in one of Orne Library's lecture halls.",
      threshold: 0,
      thresholdLabel: "Done",
      code: "12111",
    },
    {
      id: "spreading-flames-act-4a",
      kind: "act",
      sequence: "4a",
      title: "Blaze of Glory",
      text: "Your fiery nemesis can't be allowed to hurt more innocents! With Dr. Armitage's help, perhaps you can stop them.",
      threshold: 3,
      thresholdLabel: "Clues",
      onAdvance: {
        winScenario: true,
        setPreviousScenarioOutcome: "quiet",
        resolutionTitle: "Resolution 1",
        resolutionText: "The campus remains eerily quiet...",
      },
      code: "12112",
    },
    {
      id: "spreading-flames-act-4b",
      kind: "act",
      sequence: "4b",
      title: "A Flame, Doused",
      text: "Your nightmarish pursuer reels back, clutching both hand to their head.",
      threshold: 0,
      thresholdLabel: "Done",
      code: "12112",
    },
  ],
  agendas: [
    {
      id: "spreading-flames-agenda-1a",
      kind: "agenda",
      sequence: "1a",
      title: "Past Curfew",
      text: "The campus is strangely quiet, and there is no sign of your friend. Hooded figures cross the quad as nervous students scurry under painfully bright streetlamps.",
      threshold: 3,
      thresholdLabel: "Doom",
      code: "12109",
    },
    {
      id: "spreading-flames-agenda-2a",
      kind: "agenda",
      sequence: "2a",
      title: "Lit Up",
      text: "The sky glows a faint orange as the flames spread.",
      threshold: 5,
      thresholdLabel: "Doom",
      code: "12110",
    },
    {
      id: "spreading-flames-agenda-3a",
      kind: "agenda",
      sequence: "3a",
      title: "Wild Flames",
      text: "The campus is ablaze!",
      threshold: 10,
      thresholdLabel: "Doom",
      onAdvance: {
        winScenario: true,
        setPreviousScenarioOutcome: "flames",
        resolutionTitle: "Resolution 2",
        resolutionText: "The city burns...",
      },
      code: "12111",
    },
  ],
  encounterDeck: [
    {
      id: "servant-of-flame-1",
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
      id: "cantor-of-flame-1",
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
      id: "cantor-of-flame-2",
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
      id: "hellhound-1",
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
      id: "hellhound-2",
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
      id: "bystander-1",
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
      id: "bystander-2",
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
      id: "bystander-3",
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
      id: "cosmic-evils-1",
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
      id: "cosmic-evils-2",
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
      id: "cosmic-evils-3",
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
      id: "unspeakable-truths-1",
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
      id: "unspeakable-truths-2",
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
      id: "forbidden-secrets-1",
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
      id: "forbidden-secrets-2",
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
      id: "extraplanar-visions-1",
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
      id: "extraplanar-visions-2",
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
      id: "wild-compulsion-1",
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
      id: "wild-compulsion-2",
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
      id: "fire-1",
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
      id: "fire-2",
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
      id: "fire-3",
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
      id: "fire-4",
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
      id: "fire-5",
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
      id: "noxious-smoke-1",
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
      id: "noxious-smoke-2",
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
      id: "mutated-1",
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
      id: "mutated-2",
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
      id: "mutated-experiment-1",
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
      id: "mutated-experiment-2",
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
      id: "dr-henry-armitage-1",
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
  ],
};
