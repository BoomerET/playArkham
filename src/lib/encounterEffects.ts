import type { EncounterCard, Enemy, Investigator, SkillType } from "../types/game";

export type EncounterImmediateResolution =
  | {
      kind: "none";
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

    default:
      return {
        kind: "genericTreachery",
        horror: 1,
        logText: `${card.name}: generic treachery resolution for now (1 horror).`,
      };
  }
}
