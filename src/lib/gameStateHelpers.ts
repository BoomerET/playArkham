import type {
  Enemy,
  GameLocation,
  GameState,
  Investigator,
  Phase,
  PlayerCard,
  SkillType,
} from "../types/game";

export function normalizeScenarioLocations(
  locations: GameLocation[],
  investigatorId?: string,
  startingLocationId?: string,
): GameLocation[] {
  return locations.map((location) => {
    const shouldPlaceInvestigator =
      investigatorId !== undefined && location.id === startingLocationId;

    return {
      ...location,
      isVisible: location.isVisible ?? true,
      investigatorsHere: shouldPlaceInvestigator ? [investigatorId] : [],
    };
  });
}

export function cloneScenarioLocations(
  locations: GameLocation[],
): GameLocation[] {
  return locations.map((location) => ({
    ...location,
    isVisible: location.isVisible ?? true,
    investigatorsHere: [...location.investigatorsHere],
  }));
}

export function findCurrentLocation(
  locations: GameLocation[],
  investigatorId: string,
): GameLocation | undefined {
  return locations.find((location) =>
    location.investigatorsHere.includes(investigatorId),
  );
}

export function canSpendInvestigationAction(
  phase: Phase,
  actionsRemaining: number,
): boolean {
  return phase === "investigation" && actionsRemaining > 0;
}

export function getInvestigatorSkillValue(
  investigator: GameState["investigator"],
  skill: SkillType,
): number {
  return investigator[skill];
}

export function getEnemyAtInvestigator(
  enemies: Enemy[],
  locationId: string,
  investigatorId: string,
  selectedEnemyTargetId: string | null,
): Enemy | undefined {
  const selectedEnemy =
    selectedEnemyTargetId === null
      ? undefined
      : enemies.find(
          (enemy) =>
            enemy.id === selectedEnemyTargetId &&
            enemy.locationId === locationId &&
            enemy.engagedInvestigatorId === investigatorId,
        );

  if (selectedEnemy) {
    return selectedEnemy;
  }

  const engagedEnemy = enemies.find(
    (enemy) =>
      enemy.locationId === locationId &&
      enemy.engagedInvestigatorId === investigatorId,
  );

  if (engagedEnemy) {
    return engagedEnemy;
  }

  return enemies.find(
    (enemy) =>
      enemy.locationId === locationId &&
      enemy.engagedInvestigatorId === null,
  );
}

export function getPreferredEnemyTargetId(
  enemies: Enemy[],
  locationId: string,
  investigatorId: string,
  currentTargetId: string | null,
): string | null {
  const engagedEnemies = enemies.filter(
    (enemy) =>
      enemy.locationId === locationId &&
      enemy.engagedInvestigatorId === investigatorId,
  );

  if (engagedEnemies.length === 0) {
    return null;
  }

  const currentTargetStillValid = engagedEnemies.some(
    (enemy) => enemy.id === currentTargetId,
  );

  if (currentTargetStillValid) {
    return currentTargetId;
  }

  return engagedEnemies[0]?.id ?? null;
}

export function getCardCost(card: PlayerCard): number {
  return card.cost ?? 0;
}

export function createGameInvestigator(
  investigator: Investigator,
): Investigator {
  return {
    ...investigator,
    resources: 5,
    clues: 0,
    damage: 0,
    horror: 0,
  };
}
