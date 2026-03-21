import { useGameStore } from "../store/gameStore";

export default function GameLog() {
  const log = useGameStore((state) => state.log);

  return (
    <section className="game-panel">
      <h2>Game Log</h2>

      {log.length === 0 ? (
        <p className="panel-subtitle">No log entries yet.</p>
      ) : (
        <ol className="log-list">
          {log.map((entry, index) => (
            <li key={`${entry}-${index}`} className="log-entry">
              {entry}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

