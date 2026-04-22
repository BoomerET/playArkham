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
      //abilities: [
      //  {
      //    label: "Bloodstained Ground",
      //    trigger: "forced",
      //    event: "enemyDefeated",
      //    text: "Forced — When an enemy is defeated here, gain 5 clue.",
      //    effect: { kind: "gainClues", amount: 5 },
      //  },
      //],

      text: [
        "Action: Engage - Choose an enemy at a connecting location. That enemy moves to this location and engages you. This action does not provoke attacks of opportunity.",
      ],

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
      abilities: [
        {
          label: "Clear Your Mind",
          trigger: "action",
          text: "Action: Discard Unspeakable Truths from your threat area.",
          effect: {
            kind: "discardThreatAreaCard",
            cardCode: "14002",
          },
        }
      ],

      text: ["Action: Heal 1 damage and 1 horror. (Limit once per game)",],

      connections: ["fake-friends-room", "fake-miskatonic-quad"],
      mapPosition: { x: 30, y: 16 },

      revealed: false,
      isVisible: false,
      investigatorsHere: [],
    },
    {
      id: "fake-miskatonic-quad",
      code: "12116",
      name: "Miskatonic Quad",

      shroud: 1,
      clues: 1,
      traits: [
        "Miskatonic",
        "Central",
      ],

      text: ["Free: During your turn, if there are exactly 1 or 2 investigators in the game: Move to a connection location. (Group limit once per round.)",],

      connections: [
        "fake-dormitories",
        "fake-science-hall",
      ],
      mapPosition: { x: 51, y: 16 },

      revealed: false,
      isVisible: false,
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

      text: ["Forced - After you discover 1 or more clues at Science Hall: Choose and discard 1 card from your hand.",],

      connections: ["fake-miskatonic-quad", "fake-orne-library"],
      mapPosition: { x: 72, y: 16 },

      investigatorsHere: [],

      revealed: false,
      isVisible: false,
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

      text: ["Action x2: Draw 3 cards (Limit once per game.)",],

      connections: ["fake-science-hall"],
      mapPosition: { x: 93, y: 16 },

      revealed: false,
      isVisible: false,
      investigatorsHere: [],
    },
  ],
  //enemySpawns: [
  //  {
  //    locationId: "fake-miskatonic-quad",
  //    enemyCode: "14004",
  //  },
  //],
  setAsideEncounterCardCodes: [
    ENCOUNTER_CARD_CODES.DAVES_TEST_ENEMY_2,
  ],
  acts: [
    {
      id: "fake-spreading-flames-act-1a",
      code: "12109",
      kind: "act",
      sequence: "1a",
      title: "Where There's Smoke",
      text: "You are searching the dormitories for any sign of your friend.",
      threshold: 2,
      thresholdLabel: "Clues",
    },
    {
      id: "fake-spreading-flames-act-1b",
      kind: "act",
      sequence: "1b",
      title: "There's Fire",
      text: "Discard each enemy in play.",
      threshold: 0,
      thresholdLabel: "Done",
      code: "12109",
      onAdvance: {
        showLocationIds: ["fake-dormitories", "fake-miskatonic-quad"],
        spawnSetAsideEnemy: {
          enemyCode: "14004",
          locationId: "fake-miskatonic-quad",
        },
      },
    },
    {
      id: "fake-spreading-flames-act-2a",
      kind: "act",
      code: "12110",
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
      id: "fake-spreading-flames-act-2b",
      kind: "act",
      sequence: "2b",
      title: "In the Open",
      text: "Search all in-play and all out-of-play areas for the Servant of Flame.",
      threshold: 0,
      thresholdLabel: "Done",
      code: "12110",
      onAdvance: {
        showLocationIds: ["orne-library", "science-hall", "warren-observatory"],
        hideLocationIds: ["friends-room"],
        grantEncounterCardToInvestigator: "dr-henry-armitage-1",
      },
    },
    {
      id: "fake-spreading-flames-act-3a",
      code: "12111",
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
      id: "fake-spreading-flames-act-3b",
      kind: "act",
      sequence: "3b",
      title: "The Servant Unleashed",
      text: "You find Dr. Armitage barricaded in one of Orne Library's lecture halls.",
      threshold: 0,
      thresholdLabel: "Done",
      code: "12111",
    },
    {
      id: "fake-spreading-flames-act-4a",
      code: "12112",
      kind: "act",
      sequence: "4a",
      title: "Blaze of Glory",
      text: "Your fiery nemesis can't be allowed to hurt more innocents! With Dr. Armitage's help, perhaps you can stop them.",
      threshold: 3,
      thresholdLabel: "Clues",
    },
    {
      id: "fake-spreading-flames-act-4b",
      kind: "act",
      sequence: "4b",
      title: "A Flame, Doused",
      text: "Your nightmarish pursuer reels back, clutching both hand to their head.",
      threshold: 0,
      thresholdLabel: "Done",
      code: "12112",
      onAdvance: {
        winScenario: true,
        setPreviousScenarioOutcome: "quiet",
        resolutionTitle: "Resolution 1",
        resolutionText: "The campus remains eerily quiet...",
      },
    },
  ],
  agendas: [
    {
      id: "fake-spreading-flames-agenda-1a",
      code: "12106",
      kind: "agenda",
      sequence: "1a",
      title: "Past Curfew",
      text: "The campus is strangely quiet, and there is no sign of your friend. Hooded figures cross the quad as nervous students scurry under painfully bright streetlamps.",
      threshold: 2,
      thresholdLabel: "Doom",
    },
    {
      id: "fake-spreading-flames-agenda-1b",
      kind: "agenda",
      sequence: "1b",
      title: "Smoke on the Wind",
      text: "In player order, each investigator test WIL (3).",
      threshold: 0,
      thresholdLabel: "Done",
      code: "12106",
    },
    {
      id: "fake-spreading-flames-agenda-2a",
      kind: "agenda",
      sequence: "2a",
      title: "Lit Up",
      text: "The sky glows a faint orange as the flames spread.",
      threshold: 5,
      thresholdLabel: "Doom",
      code: "12107",
    },
    {
      id: "fake-spreading-flames-agenda-2b",
      kind: "agenda",
      sequence: "2b",
      title: "Uncontrollable Fire",
      text: "If they are still set aside, place 4 set-aside copies of Fire! in the encounter discard pile.",
      threshold: 0,
      thresholdLabel: "Done",
      code: "12107",
    },
    {
      id: "fake-spreading-flames-agenda-3a",
      kind: "agenda",
      sequence: "3a",
      title: "Wild Flames",
      text: "The campus is ablaze!",
      threshold: 10,
      thresholdLabel: "Doom",
      code: "12108",
    },
    {
      id: "fake-spreading-flames-agenda-3b",
      kind: "agenda",
      sequence: "3b",
      title: "Up in Flames",
      text: "Each surviving investigator who has not resigned is defeated and suffers 1 physical trauma.",
      threshold: 0,
      thresholdLabel: "Done",
      onAdvance: {
        winScenario: true,
        setPreviousScenarioOutcome: "flames",
        resolutionTitle: "Resolution 2",
        resolutionText: "The city burns...",
      },
      code: "12108",
    },
  ],
  encounterCardCodes: [
    ENCOUNTER_CARD_CODES.DAVES_TEST_ENEMY_1,
    ENCOUNTER_CARD_CODES.DAVES_TEST_ENEMY_3,
    ENCOUNTER_CARD_CODES.DAVES_TEST_ENEMY_4,
    ENCOUNTER_CARD_CODES.DAVES_TEST_ENEMY_5,
    ENCOUNTER_CARD_CODES.DAVES_TEST_ENEMY_6,
    ENCOUNTER_CARD_CODES.DAVES_TEST_TREACHERY,
  ],
};
