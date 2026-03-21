import { useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { getCardTypeClassName } from "../../lib/ui";

export default function PlayAreaPanel() {
  const playArea = useGameStore((state) => state.playArea);
  const playCard = useGameStore((state) => state.playCard);
  const draggedCardId = useGameStore((state) => state.draggedCardId);
  const setDraggedCardId = useGameStore((state) => state.setDraggedCardId);
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <section
      className={`game-panel drop-zone ${isDragOver ? "drop-zone-active" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
      }}
      onDragLeave={() => {
        setIsDragOver(false);
      }}
      onDrop={(event) => {
        event.preventDefault();

        const cardId = event.dataTransfer.getData("text/plain") || draggedCardId;
        setIsDragOver(false);
        setDraggedCardId(null);

        if (cardId) {
          playCard(cardId);
        }
      }}
    >
      <h2>Play Area ({playArea.length})</h2>
      <p className="panel-subtitle">
        Drag cards here from your hand to play them.
      </p>

      {playArea.length === 0 ? (
        <div className="empty-drop-message">
          Drop an asset or event here
        </div>
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