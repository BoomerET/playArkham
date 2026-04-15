import type { ScenarioDefinition } from "./scenarioTypes";
import { ENCOUNTER_CARD_CODES } from "../../types/game";

export const queenOfAshScenario: ScenarioDefinition = {
  id: "queen-of-ash",
  name: "Queen of Ash",
  description:
    "Dr. Armitage thanks the waitress at Velma’s Diner as she sets two \
pieces of warm apple pie between you. The head librarian pushes one toward \
you with a strained smile. “Arkham is changing. The world is changing—for the \
worse, I fear—but at least we have pie.”",
  startingLocationId: "sewer-culvert",
  resign: {
    title: "Resigned",
    subtitle: "You flee before things get worse.",
    text: "YDr. Armitage barely escapes the sewers alive, \
wracked with guilt at leaving his companions behind. By dawn, \
an unquenchable fire has spread through all of Easttown, claiming \
countless lives. Although the Arkham Fire Department tries its best, \
the flames rage for three days before finally dying out. Those who fled \
whisper of unspeakable visions—a terrifying, ghoulish faces staring \
out of the flames—that still haunt them. Doctors and nurses are still \
unable to identify the source of the victims’ strange bruises, which will \
not heal. Any trace of Armitage’s companions, as well as the Brethren \
of Ash, has been eradicated in the inferno.",
    effects: {
      setPreviousScenarioOutcome: "nocult",
    }
  },
  locations: [
    {
      id: "sewer-culvert",
      name: "Sewer Culvert",
      shroud: 1,
      code: "12182",
      clues: 0,
      revealed: true,
      connections: [
        "sewer-tunnels-1",
        "sewer-tunnels-2",
        "sewer-tunnels-3",
        "sewer-tunnels-4",
        "sewer-tunnels-5",
      ],
      investigatorsHere: [],
      mapPosition: { x: 51, y: 84 },
      isVisible: true,
      traits: [
        "Sewer",
        "Central",
      ],
      text: "Sewer Culvert is connected to each Sewer Tunnels location, and vice versa",
    },
    {
      id: "sewer-tunnels-1",
      code: "12185",
      name: "Sewer Tunnels",
      subname: "Flooded Crypt",

      shroud: 4,
      clues: 1,
      victoryPoints: 1,
      traits: [
        "Sewer",
      ],

      text: "Forced - When you end your turn at this location: Take 1 horror.",

      connections: ["sewer-culvert"],
      mapPosition: { x: 8, y: 50 },

      revealed: false,
      isVisible: true,
      investigatorsHere: [],
    },
    {
      id: "sewer-tunnels-2",
      code: "12183",
      name: "Sewer Tunnels",
      subname: "Infested Pipes",

      shroud: 1,
      clues: 1,
      traits: [
        "Sewer",
      ],

      text: "Forced - After you enter this location: Discard cards from the top of the encounter deck until an enemy is discarded and draw it.",

      connections: ["sewer-culvert"],
      mapPosition: { x: 30, y: 50 },

      revealed: false,
      isVisible: true,
      investigatorsHere: [],
    },
    {
      id: "sewer-tunnels-3",
      code: "12184",
      name: "Sewer Tunnels",
      subname: "Overgrown Tunnels",

      shroud: 2,
      clues: 1,
      traits: [
        "Sewer",
      ],

      text: "Forced - After you enter this location: Lose 1 action.",

      connections: ["sewer-culvert"],
      mapPosition: { x: 51, y: 50 },

      revealed: false,
      isVisible: true,
      investigatorsHere: [],
    },
    {
      id: "sewer-tunnels-4",
      code: "12186",
      name: "Sewer Tunnels",
      subname: "Smuggler's Cache",

      shroud: 3,
      clues: 0,
      traits: [
        "Sewer",
      ],

      text: "Reaction - When you end your turn at this location: Gain 1 resource.",

      connections: ["sewer-culvert"],
      mapPosition: { x: 72, y: 50 },

      revealed: false,
      isVisible: true,
      investigatorsHere: [],
    },
    {
      id: "sewer-tunnels-5",
      code: "12187",
      name: "Sewer Tunnels",
      subname: "Toxic Waste Pit",

      shroud: 3,
      clues: 1,
      victoryPoints: 1,
      traits: [
        "Sewer",
      ],

      text: "Forced - When you end your turn at this location: Choose and discard 1 card from your hand.",

      connections: ["sewer-culvert"],
      mapPosition: { x: 93, y: 50 },

      revealed: false,
      isVisible: true,
      investigatorsHere: [],
    },
    {
      id: "underground-cistern",
      code: "12174",
      name: "Underground Cistern",
      subname: "Ritual Site",

      shroud: 4,
      clues: 2,
      traits: [
        "Ritual Site"
      ],

      text: "Action: .",

      connections: [
        "sewer-tunnels-1",
        "sewer-tunnels-2",
        "sewer-tunnels-3",
        "sewer-tunnels-4",
        "sewer-tunnels-5"
      ],
      mapPosition: { x: 51, y: 16 },

      revealed: true,
      isVisible: true,
      investigatorsHere: [],
    },
  ],
  enemySpawns: [],
  acts: [
    {
      id: "queen-of-ash-act-1a",
      kind: "act",
      sequence: "1a",
      title: "Search the Sewers",
      text: "The Brethren of Ash could be anywhere. You must search the sewers for the cult's ritual site if you hope to save your friend.",
      threshold: 2,
      thresholdLabel: "Clues",
      code: "12172",
    },
    {
      id: "queen-of-ash-act-1b",
      kind: "act",
      sequence: "1b",
      title: "The Ritual Site",
      text: "The chanting leads you through a labyrinth of tunnels to a dry cistern. Several dozen robed figures kneel before a burning birch tree, chanting. Your friend is among them. You must stop them before they sacrifice themselves for Elokoss!",
      threshold: 0,
      thresholdLabel: "Done",
      code: "12172",
    },
    {
      id: "queen-of-ash-act-2a",
      kind: "act",
      sequence: "2a",
      title: "Stop the Rite",
      text: "You must stop the rite at any cost. You could scour the cistern for a means to stop the cult, or you could try to chop their profane idol to tinder!",
      threshold: 0,
      thresholdLabel: "Clues",
      code: "12173",
    },
    {
      id: "queen-of-ash-act-2b",
      kind: "act",
      sequence: "2b",
      title: "Crisis Averted",
      text: "As you chop the burning tree to tinder, an unearthly howl fills the room. Ignoring it, you continue your attack, placing a well-timed strike after well-timed strike to destroy the ancient evil. Eventually, the former effigy of the Brethren's goddess lies in pieces.",
      threshold: 0,
      thresholdLabel: "Done",
      code: "12173",
    },
  ],
  agendas: [
    {
      id: "queen-of-ash-agenda-1a",
      kind: "agenda",
      sequence: "1a",
      title: "A Ritual",
      text: "   The air is choked with noxious smoke as the sounds of changing grow louder.",
      threshold: 10,
      thresholdLabel: "Doom",
      code: "12169",
    },
    {
      id: "queen-of-ash-agenda-1b",
      kind: "agenda",
      sequence: "1b",
      title: "The Mother Arrives",
      text: "A knotted, claw-like hand grabs your am as dozens more wrap around you, embracing you. The touch burns. You scream as a horrifying, toothy maw opens in Elokoss' belly",
      threshold: 0,
      thresholdLabel: "Done",
      code: "12169",
    },
    {
      id: "queen-of-ash-agenda-2a",
      kind: "agenda",
      sequence: "2a",
      title: "Brethren of Ash",
      text: "The sky glows a faint orange as the flames spread.",
      threshold: 5,
      thresholdLabel: "Doom",
      code: "12170",
    },
    {
      id: "squeen-of-ash-agenda-2b",
      kind: "agenda",
      sequence: "2b",
      title: "Out Like a Light",
      text: "If they are still set aside, place 4 set-aside copies of Fire! in the encounter discard pile.",
      threshold: 0,
      thresholdLabel: "Done",
      code: "12170",
    },
    {
      id: "queen-of-ash-agenda-3a",
      kind: "agenda",
      sequence: "3a",
      title: "A Gathering",
      text: "The campus is ablaze!",
      threshold: 10,
      thresholdLabel: "Doom",
      code: "12171",
    },
    {
      id: "queen-of-ash-agenda-3b",
      kind: "agenda",
      sequence: "3b",
      title: "Flame in the Dark",
      text: "Each surviving investigator who has not resigned is defeated and suffers 1 physical trauma.",
      threshold: 0,
      thresholdLabel: "Done",
      code: "12171",
    },
  ],
  encounterCardCodes: [
    ENCOUNTER_CARD_CODES.CANTOR_OF_FLAME,
    ENCOUNTER_CARD_CODES.CANTOR_OF_FLAME,
    ENCOUNTER_CARD_CODES.HELLHOUND,
    ENCOUNTER_CARD_CODES.HELLHOUND,
    ENCOUNTER_CARD_CODES.BYSTANDER,
    ENCOUNTER_CARD_CODES.BYSTANDER,
    ENCOUNTER_CARD_CODES.BYSTANDER,
    ENCOUNTER_CARD_CODES.COSMIC_EVILS,
    ENCOUNTER_CARD_CODES.COSMIC_EVILS,
    ENCOUNTER_CARD_CODES.COSMIC_EVILS,
    ENCOUNTER_CARD_CODES.UNSPEAKABLE_TRUTHS,
    ENCOUNTER_CARD_CODES.UNSPEAKABLE_TRUTHS,
    ENCOUNTER_CARD_CODES.FORBIDDEN_SECRETS,
    ENCOUNTER_CARD_CODES.FORBIDDEN_SECRETS,
    ENCOUNTER_CARD_CODES.EXTRAPLANAR_VISIONS,
    ENCOUNTER_CARD_CODES.EXTRAPLANAR_VISIONS,
    ENCOUNTER_CARD_CODES.WILD_COMPULSION,
    ENCOUNTER_CARD_CODES.WILD_COMPULSION,
    ENCOUNTER_CARD_CODES.NOXIOUS_SMOKE,
    ENCOUNTER_CARD_CODES.NOXIOUS_SMOKE,
    ENCOUNTER_CARD_CODES.MUTATED,
    ENCOUNTER_CARD_CODES.MUTATED,
    ENCOUNTER_CARD_CODES.MUTATED_EXPERIMENT,
    ENCOUNTER_CARD_CODES.MUTATED_EXPERIMENT,
  ],
};
