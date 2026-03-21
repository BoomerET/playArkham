import { useGameStore } from "../../store/gameStore";
import { getCardTypeClassName } from "../../lib/ui";

export default function DiscardPanel() {
  const discard = useGameStore((state) => state.discard);

  return (
    <section className="game-panel">
      <h2>Discard ({discard.length})</h2>

      {discard.length === 0 ? (
        <p className="panel-subtitle">No cards in discard.</p>
      ) : (
        <div className="card-grid">
          {discard.map((card) => (
            <div
              key={card.id}
              className={`entity-card dim player-card ${getCardTypeClassName(card)}`}
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
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

