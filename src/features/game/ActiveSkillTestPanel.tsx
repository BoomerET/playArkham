import { useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { getCardTypeClassName } from "../../lib/ui";

export default function ActiveSkillTestPanel() {
  const activeSkillTest = useGameStore((state) => state.activeSkillTest);
  const hand = useGameStore((state) => state.hand);
  const commitSkillCard = useGameStore((state) => state.commitSkillCard);
  const resolveActiveSkillTest = useGameStore((state) => state.resolveActiveSkillTest);
  const cancelActiveSkillTest = useGameStore((state) => state.cancelActiveSkillTest);
  const setDraggedCardId = useGameStore((state) => state.setDraggedCardId);
  const draggedCardId = useGameStore((state) => state.draggedCardId);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!activeSkillTest) {
    return null;
  }

  const skillCards = hand.filter((card) => card.type === "skill");

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
          commitSkillCard(cardId);
        }
      }}
    >
      <h2>Active Skill Test</h2>
      <p className="panel-subtitle">
        {activeSkillTest.source} — Commit skill cards, then resolve.
      </p>

      <div className="token-row">
        <span className="token-chip gold">Skill {activeSkillTest.skill}</span>
        <span className="token-chip gold">Difficulty {activeSkillTest.difficulty}</span>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Committed Cards:</strong>
        {activeSkillTest.committedCards.length === 0 ? (
          <div className="empty-drop-message" style={{ minHeight: 72, marginTop: 8 }}>
            Drag skill cards here
          </div>
        ) : (
          <div className="horizontal-card-grid" style={{ marginTop: 8 }}>
            {activeSkillTest.committedCards.map((entry) => (
              <div
                key={entry.card.id}
                className={`entity-card player-card ${getCardTypeClassName(entry.card)}`}
              >
                <div className="card-topline">
                  <p className="entity-title">{entry.card.name}</p>
                  <span className={`card-type-badge ${getCardTypeClassName(entry.card)}`}>
                    {entry.card.type}
                  </span>
                </div>
                <div className="entity-meta">
                  <span>Matching Icons: +{entry.matchingIcons}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {skillCards.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <strong>Skill Cards in Hand:</strong>
          <div className="horizontal-card-grid" style={{ marginTop: 8 }}>
            {skillCards.map((card) => (
              <div
                key={card.id}
                className={`entity-card player-card ${getCardTypeClassName(card)} ${
                  draggedCardId === card.id ? "dragging-card" : ""
                }`}
                draggable
                onDragStart={(event) => {
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
                  <span className={`card-type-badge ${getCardTypeClassName(card)}`}>
                    {card.type}
                  </span>
                </div>

                <div className="entity-meta">
                  <span>Icons: {(card.icons ?? []).join(", ") || "None"}</span>
                </div>

                {card.text && <p className="entity-text">{card.text}</p>}

                <div className="card-actions">
                  <button onClick={() => commitSkillCard(card.id)}>Commit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="button-row" style={{ marginTop: 14 }}>
        <button onClick={resolveActiveSkillTest}>Resolve Test</button>
        <button onClick={cancelActiveSkillTest}>Cancel Test</button>
      </div>
    </section>
  );
}

