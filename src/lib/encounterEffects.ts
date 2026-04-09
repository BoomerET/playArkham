import type { EncounterCard, Enemy, Investigator, SkillType } from "../types/game";

type EncounterChoiceEffect =
  | { kind: "doomOnAgenda"; amount: number }
  | { kind: "surge" };

type EncounterChoiceOption = {
  id: string;
  label: string;
  effect: EncounterChoiceEffect;
};

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
    kind: "spawnAcolyte";
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

type EncounterSkillTestOutcome =
  | { kind: "none" }
  | { kind: "damage"; amount: number }
  | { kind: "horror"; amount: number };

export function resolveEncounterCardImmediate(args: {
  card: EncounterCard;
  investigator: Investigator;
  currentLocationId: string;
}): EncounterImmediateResolution {
  const { card, investigator, currentLocationId } = args;

  switch (card.code) {
    case "12124":
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


    /*  case "12129":
      return {
        kind: "spawnAcolyte",
        doomOnAgenda: 1,
        enemy: {
          id: `acolyte-${Date.now()}`,
          name: "Acolyte",
          fight: card.fight ?? 3,
          evade: card.evade ?? 2,
          health: card.health ?? 3,
          damage: card.damage ?? 1,
          horror: card.horror ?? 1,
          locationId: currentLocationId,
          engagedInvestigatorId: investigator.id,
          exhausted: false,
          damageOnEnemy: 0,
        },
        logText:
          "Acolyte: spawn engaged with the investigator and place 1 doom on the agenda.",
      };
      */

    case "12125":
      return {
        kind: "attachToThreatArea",
        uniqueByName: true,
        logText: "Unspeakable Truths entered your threat area.",
        duplicateLogText:
          "Unspeakable Truths was drawn, but a copy is already in your threat area. It was discarded.",
      };

    case "12129":
      return {
        kind: "attachToLocation",
        uniqueByNameAtLocation: true,
        logText: "Fire! attached to your location.",
        duplicateLogText:
          "Fire! was drawn, but your location already has Fire! attached. It was discarded.",
      };

    default:
      return {
        kind: "genericTreachery",
        horror: 1,
        logText: `${card.name}: generic treachery resolution for now (1 horror).`,
      };
  }
}
