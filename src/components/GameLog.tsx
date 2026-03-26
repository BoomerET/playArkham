import { useEffect, useRef } from "react";
import { useGameStore } from "../store/gameStore";
import "./components.css";

export default function GameLog() {
  const log = useGameStore((state) => state.log);

  const visibleLog = log.slice(-20);
  const containerRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
    });
  }, [visibleLog]);

  return (
    <section className="game-panel">
      <h2>Game Log</h2>

      {visibleLog.length === 0 ? (
        <p className="panel-subtitle">No log entries yet.</p>
      ) : (
        <ol className="log-list" ref={containerRef}>
          {visibleLog.map((entry, index) => (
            <li key={`${entry}-${index}`} className="log-entry">
              {entry}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
