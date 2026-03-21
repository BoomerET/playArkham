import { useGameStore } from "../../store/gameStore";
import { getCardTypeClassName } from "../../lib/ui";

export default function HandPanel() {
  const hand = useGameStore((state) => state.hand);
  const discardCard = useGameStore((state) => state.discardCard);
  const playCard = useGameStore((state) => state.playCard);

  return (
    <section className="game-panel">
      <h2>Hand ({hand.length})</h2>

      {hand.length === 0 ? (
        <p className="panel-subtitle">No cards in hand.</p>
      ) : (
        <div className="horizontal-card-grid">
          {hand.map((card) => (
            <div
              key={card.id}
              className={`entity-card player-card ${getCardTypeClassName(card)}`}
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

              <div className="card-actions">
                <button onClick={() => playCard(card.id)}>Play</button>
                <button onClick={() => discardCard(card.id)}>Discard</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

