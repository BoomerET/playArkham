// Exported functions for gameStore.ts
import type {
    Enemy,
} from "../types/game";

export function readyEnemies(enemies: Enemy[]): Enemy[] {
    return enemies.map((enemy) =>
        enemy.exhausted
            ? { ...enemy, exhausted: false }
            : enemy,
    );
}