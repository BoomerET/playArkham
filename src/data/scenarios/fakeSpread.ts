import type { ScenarioDefinition } from "./scenarioTypes";
import { ENCOUNTER_CARD_CODES } from "../../types/game";

export const fakeSpreadingFlamesScenario: ScenarioDefinition = {
  id: "fake-spreading-flames",
  name: "Fake Spreading Flames",
  description:
    "A recent spate of fires and grisly “accidents” have the entire city on edge.",
  startingLocationId: "fake-friends-room",
  locations: [
    {
      id: "fake-friends-room",
      code: "12113",
      name: "Your Friend's Room",

      shroud: 2,
      clues: 2,
      traits: [
        "Miskatonic",
      ],

      text: "Action: Engage - Choose an enemy at a connecting location. That enemy moves to this location and engages your. This action does not provoke attacks of opportunity.",
      parley: {
        label: "Parley",
        text: "Test (intellect) 2 to reason with him.",
        skillTest: {
          skill: "intellect",
          difficulty: 2,
          onSuccess: {
            kind: "gainResources",
            amount: 1,
          },
          onFail: {
            kind: "none",
          },
        },
      },

      connections: ["fake-dormitories"],
      mapPosition: { x: 8, y: 16 },

      revealed: true,
      isVisible: true,
      investigatorsHere: [],
    },
    {
      id: "fake-dormitories",
      name: "Dormitories",
      code: "12117",

      shroud: 3,
      clues: 1,
      traits: [
        "Miskatonic",
      ],

      text: "Action: Heal 1 damage and 1 horror. (Limit once per game)",
      parley: {
        label: "Parley",
        text: "You parley with the RA.",
        effect: {
          kind: "gainClues",
          amount: 1,
        },
      },

      connections: ["fake-friends-room", "fake-miskatonic-quad"],
      mapPosition: { x: 30, y: 16 },

      revealed: true,
      isVisible: true,
      investigatorsHere: [],
    },
    {
      id: "fake-miskatonic-quad",
      code: "12116",
      name: "Miskatonic Quad",

      shroud: 1,
      clues: 0,
      traits: [
        "Miskatonic",
        "Central",
      ],
      actions: [
        {
          label: "Search the Office",
          text: "Test (intellect) 3. If you succeed, discover 1 clue at this location.",
          skillTest: {
            skill: "intellect",
            difficulty: 3,
            onSuccess: {
              kind: "discoverLocationClue",
              amount: 1,
            },
            onFail: {
              kind: "none",
            },
          },
        },
      ],

      text: "Free: During your turn, if there are exactly 1 or 2 investigators in the game: Move to a connection location. (Group limit once per round.)",

      connections: [
        "fake-dormitories",
        "fake-science-hall",
      ],
      mapPosition: { x: 51, y: 16 },

      revealed: true,
      isVisible: true,
      investigatorsHere: [],
    },
    {
      id: "fake-science-hall",
      code: "12118",
      name: "Science Hall",

      shroud: 2,
      clues: 1,
      victoryPoints: 1,
      traits: [
        "Miskatonic",
      ],
      actions: [
        {
          label: "Engage from connected location",
          text: "You call out to a nearby enemy and draw it toward you.",
          effect: {
            kind: "engageEnemyFromConnectedLocation",
          },
        },
      ],

      text: "Forced - After you discover 1 or more clues at Science Hall: Choose and discard 1 card from your hand.",

      connections: ["fake-miskatonic-quad", "fake-orne-library"],
      mapPosition: { x: 72, y: 16 },

      investigatorsHere: [],

      revealed: true,
      isVisible: true,
    },
    {
      id: "fake-orne-library",
      code: "12120",
      name: "Orne Library",

      shroud: 4,
      clues: 1,
      victoryPoints: 1,
      traits: [
        "Miskatonic"
      ],

      text: "Action x2: Draw 3 cards (Limit once per game.)",
      parley: {
        label: "Parley",
        text: "You parley with the librarian.",
        effect: {
          kind: "gainClues",
          amount: 1,
        },
      },

      connections: ["fake-science-hall"],
      mapPosition: { x: 93, y: 16 },

      revealed: true,
      isVisible: true,
      investigatorsHere: [],
    },
  ],
  enemySpawns: [],
  acts: [
    {
      id: "fake-spreading-flames-act-1a",
      kind: "act",
      sequence: "1a",
      title: "Where There's Smoke",
      text: "You are searching the dormitories for any sign of your friend.",
      threshold: 2,
      thresholdLabel: "Clues",
    },
    {
      id: "fake-spreading-flames-act-2a",
      kind: "act",
      sequence: "2a",
      title: "Escape the Dorms",
      text: "A burning apparition stands between you and the exit. You must escape the dormitories.",
      threshold: 2,
      thresholdLabel: "Clues",
      onAdvance: {
        showLocationIds: ["dormitories", "miskatonic-quad"],
      },
    },
    {
      id: "fake-spreading-flames-act-3a",
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
    },
    {
      id: "fake-spreading-flames-act-4a",
      kind: "act",
      sequence: "4a",
      title: "Blaze of Glory",
      text: "Your fiery nemesis can't be allowed to hurt more innocents! With Dr. Armitage's help, perhaps you can stop them.",
      threshold: 3,
      thresholdLabel: "Clues",
    },
  ],
  agendas: [
    {
      id: "fake-spreading-flames-agenda-1a",
      kind: "agenda",
      sequence: "1a",
      title: "Past Curfew",
      text: "The campus is strangely quiet, and there is no sign of your friend. Hooded figures cross the quad as nervous students scurry under painfully bright streetlamps.",
      threshold: 3,
      thresholdLabel: "Doom",
    },
    {
      id: "fake-spreading-flames-agenda-2a",
      kind: "agenda",
      sequence: "2a",
      title: "Lit Up",
      text: "The sky glows a faint orange as the flames spread.",
      threshold: 5,
      thresholdLabel: "Doom",
    },
    {
      id: "fake-spreading-flames-agenda-3a",
      kind: "agenda",
      sequence: "3a",
      title: "Wild Flames",
      text: "The campus is ablaze!",
      threshold: 10,
      thresholdLabel: "Doom",
    },
  ],
  encounterCardCodes: [
    ENCOUNTER_CARD_CODES.DAVES_TEST,
    ENCOUNTER_CARD_CODES.DAVES_TEST,
    ENCOUNTER_CARD_CODES.DAVES_TEST,
    ENCOUNTER_CARD_CODES.DAVES_TEST,
    ENCOUNTER_CARD_CODES.DAVES_TEST,
    ENCOUNTER_CARD_CODES.DAVES_TEST,
    ENCOUNTER_CARD_CODES.DAVES_TEST,
    ENCOUNTER_CARD_CODES.DAVES_TEST,
  ],
};
