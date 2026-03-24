import { enemyDefinitions } from "../data/enemyDefinitions";
import type { Enemy, EnemySpawn } from "../types/game";

export function buildScenarioEnemies(spawns: EnemySpawn[]): Enemy[] {
  return spawns.flatMap((spawn, index) => {
    const definition = enemyDefinitions.find((enemy) => enemy.id === spawn.enemyId);

    if (!definition) {
      console.warn(`Missing enemy definition for ${spawn.enemyId}`);
      return [];
    }

    return [
      {
        id: spawn.instanceId ?? `${spawn.enemyId}-${index + 1}`,
        name: definition.name,
        fight: definition.fight,
        evade: definition.evade,
        health: definition.health,
        damage: definition.damage,
        horror: definition.horror,
        locationId: spawn.locationId,
        engagedInvestigatorId: spawn.engagedInvestigatorId ?? null,
        exhausted: spawn.exhausted ?? false,
        damageOnEnemy: spawn.damageOnEnemy ?? 0,
      },
    ];
  });
}
