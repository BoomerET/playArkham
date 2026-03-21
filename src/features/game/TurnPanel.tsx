import { useGameStore } from "../../store/gameStore";

function prettyPhase(phase: string): string {
  return phase.charAt(0).toUpperCase() + phase.slice(1);
}

export default function TurnPanel() {
  const turn = useGameStore((state) => state.turn);
  const advancePhase = useGameStore((state) => state.advancePhase);

  return (
    <section className="game-panel">
      <h2>Turn</h2>

      <div className="stat-grid">
        <div className="stat-box">
          <span className="stat-label">Round: </span>
          <span className="stat-value">{turn.round}</span>
        </div>

        <div className="stat-box">
          <span className="stat-label">Phase: </span>
          <span className="stat-value">{prettyPhase(turn.phase)}</span>
        </div>

        <div className="stat-box">
          <span className="stat-label">Actions Remaining: </span>
          <span className="stat-value">
            {turn.phase === "investigation" ? turn.actionsRemaining : "N/A"}
          </span>
        </div>
      </div>

      <div className="button-row" style={{ marginTop: 14 }}>
        <button onClick={advancePhase}>
          {turn.phase === "upkeep" ? "Start Next Round" : "Advance Phase"}
        </button>
      </div>
    </section>
  );
}

