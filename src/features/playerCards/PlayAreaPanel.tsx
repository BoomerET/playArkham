import { useGameStore } from "../../store/gameStore";
import { getCardTypeClassName } from "../../lib/ui";

export default function PlayAreaPanel() {
  const playArea = useGameStore((state) => state.playArea);

  return (
    <section className="game-panel">
      <h2>Play Area ({playArea.length})</h2>
      <p className="panel-subtitle">Assets in play and affecting your board.</p>

      {playArea.length === 0 ? (
        <p>No assets in play.</p>
      ) : (
        <div className="horizontal-card-grid">
          {playArea.map((card) => (
            <div
              key={card.id}
              className={`entity-card player-card highlight ${getCardTypeClassName(card)}`}
            >
              <div className="card-topline">
                <p className="entity-title">{card.name}</p>
                <span className={`card-type-badge ${getCardTypeClassName(card)}`}>
                  {card.type}
                </span>
              </div>

              <div className="entity-meta">
                {card.cost !== undefined && <span>Cost: {card.cost}</span>}
              </div>

              {card.text && <p className="entity-text">{card.text}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

