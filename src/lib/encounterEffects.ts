/**
 * Encounter immediate resolution contract
 *
 * resolveEncounterCardImmediate() does not mutate store state directly.
 * It returns an instruction object that resolveMythosPhase() interprets.
 *
 * Available kinds:
 * - "none"
 * - "doomOnAgenda"
 * - "spawnAcolyte"
 * - "skillTest"
 * - "choice"
 * - "attachToThreatArea"
 * - "attachToLocation"
 * - "genericTreachery"
 *
 * Use "pending" when the card needs later follow-up resolution
 * (usually after a skill test).
 *
 * Use "options" when the card requires player input before it can resolve.
 *
 * Use attach kinds for persistent cards that remain in play.
 * Use immediate kinds for one-shot effects.
 */

import type { EncounterCard, Enemy, Investigator, SkillType } from "../types/game";
import { ENCOUNTER_CARD_CODES } from "../types/game";

type EncounterChoiceEffect =
  | { kind: "doomOnAgenda"; amount: number }
  | { kind: "surge" };

type EncounterChoiceOption = {
  id: string;
  label: string;
  effect: EncounterChoiceEffect;
};

export type EncounterSkillTestOutcome =
  | { kind: "none" }
  | { kind: "damage"; amount: number }
  | { kind: "horror"; amount: number }
  | { kind: "damageByFailure" }
  | { kind: "horrorByFailure" };

export type EncounterImmediateResolution =
  | {
    kind: "none";
    logText: string;
  }
  | {
    kind: "choice";
    pending: {
      options: EncounterChoiceOption[];
    };
    logText: string;
  }
  | {
    kind: "doomOnAgenda";
    amount: number;
    logText: string;
  }
  | {
    kind: "spawnEnemy";
    enemy: Enemy;
    doomOnAgenda: number;
    logText: string;
  }
  | {
    kind: "skillTest";
    skill: SkillType;
    difficulty: number;
    pending: {
      cardName: string;
      onPass?: EncounterSkillTestOutcome;
      onFail?: EncounterSkillTestOutcome;
    };
    logText: string;
  }
  | {
    kind: "attachToThreatArea";
    uniqueByName: boolean;
    logText: string;
    duplicateLogText?: string;
  }
  | {
    kind: "attachToLocation";
    uniqueByNameAtLocation: boolean;
    logText: string;
    duplicateLogText?: string;
  }
  | {
    kind: "genericTreachery";
    horror: number;
    logText: string;
  };

export function resolveEncounterCardImmediate(args: {
  card: EncounterCard;
  investigator: Investigator;
  currentLocationId: string;
}): EncounterImmediateResolution {
  const { card, currentLocationId } = args;

  switch (card.code) {

    case ENCOUNTER_CARD_CODES.NOXIOUS_SMOKE:
      return {
        kind: "skillTest",
        skill: "willpower",
        difficulty: 3,
        pending: {
          cardName: card.name,
          onPass: { kind: "none" },
          onFail: { kind: "horrorByFailure" },
        },
        logText: "Noxious Smoke: test Willpower (3).",
      };


    case ENCOUNTER_CARD_CODES.COSMIC_EVILS:
      return {
        kind: "choice",
        pending: {
          options: [
            {
              id: "doom",
              label: "Place 1 doom on the current agenda",
              effect: { kind: "doomOnAgenda", amount: 1 },
            },
            {
              id: "surge",
              label: "Cosmic Evils gains surge",
              effect: { kind: "surge" },
            },
          ],
        },
        logText:
          "Cosmic Evils: choose one - place 1 doom on the current agenda, or Cosmic Evils gains surge.",
      };

    case ENCOUNTER_CARD_CODES.CANTOR_OF_FLAME:
      return {
        kind: "skillTest",
        skill: "agility",
        difficulty: 3,
        pending: {
          cardName: card.name,
          onPass: { kind: "none" },
          onFail: { kind: "damage", amount: 1 },
        },
        logText: "Grasping Hands: test Agility (3).",
      };

    case ENCOUNTER_CARD_CODES.UNSPEAKABLE_TRUTHS:
      return {
        kind: "attachToThreatArea",
        uniqueByName: true,
        logText: "Unspeakable Truths entered your threat area.",
        duplicateLogText:
          "Unspeakable Truths was drawn, but a copy is already in your threat area. It was discarded.",
      };

    case ENCOUNTER_CARD_CODES.FIRE:
      return {
        kind: "attachToLocation",
        uniqueByNameAtLocation: true,
        logText: "Fire! attached to your location.",
        duplicateLogText:
          "Fire! was drawn, but your location already has Fire! attached. It was discarded.",
      };

    case ENCOUNTER_CARD_CODES.DAVES_TEST_TREACHERY:
      return {
        kind: "spawnEnemy",
        enemy: {
          id: `14003-${Date.now()}`,
          locationId: currentLocationId,
          engagedInvestigatorId: null,
          name: "Test Enemy",
          fight: 2,
          evade: 2,
          health: 2,
          damage: 1,
          horror: 1,
          exhausted: false,
          damageOnEnemy: 0,
          ability: [],
        },
        doomOnAgenda: 1,
        logText: "Dave's Test Treachery: place 1 doom on the current agenda.",
      };

    case ENCOUNTER_CARD_CODES.MUTATED_EXPERIMENT:
      return {

      }
    default:
      return {
        kind: "genericTreachery",
        horror: 1,
        logText: `${card.name}: generic treachery resolution for now (1 horror).`,
      };
  }
}
