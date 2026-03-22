import { useGameStore } from "../../store/gameStore";
import { getCardTypeClassName } from "../../lib/ui";

export default function HandPanel() {
  const hand = useGameStore((state) => state.hand);
  const discardCard = useGameStore((state) => state.discardCard);
  const playCard = useGameStore((state) => state.playCard);
  const setDraggedCardId = useGameStore((state) => state.setDraggedCardId);
  const draggedCardId = useGameStore((state) => state.draggedCardId);
  const activeSkillTest = useGameStore((state) => state.activeSkillTest);

  return (
    <section className="game-panel">
      <h2>Hand ({hand.length})</h2>

      {hand.length === 0 ? (
        <p className="panel-subtitle">No cards in hand.</p>
      ) : (
        <div className="horizontal-card-grid">
          {hand.map((card) => {
            const isDragging = draggedCardId === card.id;
            const draggable = activeSkillTest
              ? card.type === "skill"
              : card.type !== "skill";

            return (
              <div
                key={card.id}
                className={`entity-card player-card ${getCardTypeClassName(card)} ${
                  isDragging ? "dragging-card" : ""
                }`}
                draggable={draggable}
                onDragStart={(event) => {
                  if (!draggable) return;
                  event.dataTransfer.setData("text/plain", card.id);
                  event.dataTransfer.effectAllowed = "move";
                  setDraggedCardId(card.id);
                }}
                onDragEnd={() => {
                  setDraggedCardId(null);
                }}
              >
                <div className="card-topline">
                  <p className="entity-title">{card.name}</p>
                  <span
                    className={`card-type-badge ${getCardTypeClassName(card)}`}
                  >
                    {card.type}
                  </span>
                </div>

                <div className="entity-meta">
                  {card.cost !== undefined && <span>Cost: {card.cost}</span>}
                  {card.icons && card.icons.length > 0 && (
                    <span>Icons: {card.icons.join(", ")}</span>
                  )}
                </div>

                {card.text && <p className="entity-text">{card.text}</p>}

                <div className="card-actions">
                  {!activeSkillTest && (
                    <button onClick={() => playCard(card.id)}>Play</button>
                  )}
                  {!activeSkillTest && (
                    <button onClick={() => discardCard(card.id)}>
                      Discard
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
