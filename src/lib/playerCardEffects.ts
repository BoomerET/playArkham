import type { Investigator, PlayerCard } from "../types/game";

export type PlayedEventResolution = {
  investigator: Investigator;
  logText: string;
};

export function resolvePlayedEvent(
  card: PlayerCard,
  investigator: Investigator,
): PlayedEventResolution {
  if (card.name === "Working a Hunch") {
    return {
      investigator: {
        ...investigator,
        clues: investigator.clues + 1,
      },
      logText: `Played event ${card.name}. Resolved its effect and gained 1 clue.`,
    };
  }

  if (card.name === "Emergency Cache") {
    return {
      investigator: {
        ...investigator,
        resources: investigator.resources + 3,
      },
      logText: `Played event ${card.name}. Resolved its effect and gained 3 resources.`,
    };
  }

  return {
    investigator,
    logText: `Played event ${card.name}. Event resolved and was discarded.`,
  };
}
