import { useEffect, useMemo, useRef } from "react";
import { useGameStore } from "../store/gameStore";
import type { GameLogEntry, GameLogItem, GameLogKind } from "../types/game";

function classifyLegacyLogEntry(text: string): GameLogKind {
  const normalized = text.toLowerCase();

  if (
    normalized.includes("agenda") ||
    normalized.includes("act effect") ||
    normalized.includes("scenario effect") ||
    normalized.includes("was revealed") ||
    normalized.includes("is now visible on the board")
  ) {
    return "scenario";
  }

  if (
    normalized.includes("fight") ||
    normalized.includes("evade") ||
    normalized.includes("defeated") ||
    normalized.includes("dealt") ||
    normalized.includes("damage") ||
    normalized.includes("horror")
  ) {
    return "combat";
  }

  if (
    normalized.includes("skill test") ||
    normalized.includes("committed") ||
    normalized.includes("auto-fail") ||
    normalized.includes("token") ||
    normalized.includes("investigate")
  ) {
    return "skill-test";
  }

  if (
    normalized.includes("enemy phase") ||
    normalized.includes("engaged") ||
    normalized.includes("spawned enemy") ||
    normalized.includes("enemy")
  ) {
    return "enemy";
  }

  if (
    normalized.includes("moved to") ||
    normalized.includes("played ") ||
    normalized.includes("drew ") ||
    normalized.includes("discarded ") ||
    normalized.includes("gained ") ||
    normalized.includes("spent ")
  ) {
    return "player";
  }

  return "system";
}

function normalizeLogEntry(entry: GameLogItem, index: number): GameLogEntry {
  if (typeof entry === "string") {
    return {
      id: `legacy-log-${index}`,
      kind: classifyLegacyLogEntry(entry),
      text: entry,
    };
  }

  return entry;
}

function formatKindLabel(kind: GameLogKind): string {
  switch (kind) {
    case "skill-test":
      return "Skill";
    case "player":
      return "Player";
    case "enemy":
      return "Enemy";
    case "combat":
      return "Combat";
    case "scenario":
      return "Scenario";
    case "system":
    default:
      return "System";
  }
}

export default function GameLog() {
  const log = useGameStore((state) => state.log);
  const listRef = useRef<HTMLOListElement>(null);

  const normalizedLog = useMemo(
    () => log.map((entry, index) => normalizeLogEntry(entry, index)),
    [log],
  );

  useEffect(() => {
    const element = listRef.current;

    if (!element) {
      return;
    }

    element.scrollTop = element.scrollHeight;
  }, [normalizedLog]);

  return (
    <section className="game-panel">
      <h2>Game Log</h2>

      {normalizedLog.length === 0 ? (
        <p className="panel-subtitle">No log entries yet.</p>
      ) : (
        <ol className="log-list" ref={listRef}>
          {normalizedLog.map((entry) => (
            <li
              key={entry.id}
              className={`log-entry log-entry-${entry.kind}`}
            >
              <span className={`log-entry-badge log-entry-badge-${entry.kind}`}>
                {formatKindLabel(entry.kind)}
              </span>
              <span className="log-entry-text">{entry.text}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
