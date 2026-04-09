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
    pending:
    | { kind: "graspingHands"; cardName: string }
    | { kind: "rottingRemains"; cardName: string };
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
  const { card, investigator, currentLocationId } = args;

  switch (card.name) {
    case "Cosmic Evils":
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

    case "Ancient Evils":
      return {
        kind: "doomOnAgenda",
        amount: 1,
        logText: "Ancient Evils: place 1 doom on the current agenda.",
      };

    case "Frozen in Fear":
      return {
        kind: "genericTreachery",
        horror: 1,
        logText: "Frozen in Fear: for now, resolve as 1 horror.",
      };

    case "Grasping Hands":
      return {
        kind: "skillTest",
        skill: "agility",
        difficulty: 3,
        pending: {
          kind: "graspingHands",
          cardName: card.name,
        },
        logText: "Grasping Hands: test Agility (3).",
      };

    case "Rotting Remains":
      return {
        kind: "skillTest",
        skill: "willpower",
        difficulty: 3,
        pending: {
          kind: "rottingRemains",
          cardName: card.name,
        },
        logText: "Rotting Remains: test Willpower (3).",
      };

    case "Acolyte":
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

    case "Unspeakable Truths":
      return {
        kind: "attachToThreatArea",
        uniqueByName: true,
        logText: "Unspeakable Truths entered your threat area.",
        duplicateLogText:
          "Unspeakable Truths was drawn, but a copy is already in your threat area. It was discarded.",
      };

    case "Fire!":
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
