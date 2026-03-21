import { useState } from "react";
import type { ChaosToken } from "../../types/game";
import { useGameStore } from "../../store/gameStore";

export default function ChaosBagPanel() {
  const drawChaosToken = useGameStore((state) => state.drawChaosToken);
  const chaosBag = useGameStore((state) => state.chaosBag);
  const [lastDraw, setLastDraw] = useState<ChaosToken | null>(null);

  function handleDraw() {
    const token = drawChaosToken();
    setLastDraw(token);
  }

  return (
    <section className="game-panel">
      <h2>Chaos Bag</h2>
      <p className="panel-subtitle">Pull from the bag and tempt the unknown.</p>

      <div className="stat-grid">
        <div className="stat-box">
          <span className="stat-label">Tokens: </span>
          <span className="stat-value">{chaosBag.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Last Draw: </span>
          <span className="stat-value">
            {lastDraw === null ? "None" : String(lastDraw)}
          </span>
        </div>
      </div>

      <div className="button-row" style={{ marginTop: 14 }}>
        <button onClick={handleDraw}>Draw Token</button>
      </div>
    </section>
  );
}

