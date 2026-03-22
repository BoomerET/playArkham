import { useGameStore } from "../../store/gameStore";
import { getCardTypeClassName } from "../../lib/ui";

type SkillType = "willpower" | "intellect" | "combat" | "agility";

const skillMeta: Record<
  SkillType,
  {
    label: string;
    short: string;
    className: string;
  }
> = {
  willpower: {
    label: "Willpower",
    short: "W",
    className: "skill-pill-willpower",
  },
  intellect: {
    label: "Intellect",
    short: "I",
    className: "skill-pill-intellect",
  },
  combat: {
    label: "Combat",
    short: "C",
    className: "skill-pill-combat",
  },
  agility: {
    label: "Agility",
    short: "A",
    className: "skill-pill-agility",
  },
};

function normalizeSkillName(value: string): SkillType | null {
  const normalized = value.trim().toLowerCase();

  if (
    normalized === "willpower" ||
    normalized === "intellect" ||
    normalized === "combat" ||
    normalized === "agility"
  ) {
    return normalized;
  }

  return null;
}

function formatSkillList(icons: string[] | undefined) {
  if (!icons || icons.length === 0) {
    return [];
  }

  return icons
    .map((icon) => normalizeSkillName(icon))
    .filter((icon): icon is SkillType => icon !== null);
}

export default function HandPanel() {
  const hand = useGameStore((state) => state.hand);
  const discardCard = useGameStore((state) => state.discardCard);
  const playCard = useGameStore((state) => state.playCard);
  const setDraggedCardId = useGameStore((state) => state.setDraggedCardId);
  const draggedCardId = useGameStore((state) => state.draggedCardId);
  const activeSkillTest = useGameStore((state) => state.activeSkillTest);

  const title = activeSkillTest ? "Hand — Commit Skill Cards" : "Hand";

  return (
    <section className="game-panel hand-panel">
      <div className="hand-panel-header">
        <div>
          <p className="hand-panel-kicker">Player Cards</p>
          <h2 className="hand-panel-title">
            {title} <span className="hand-panel-count">({hand.length})</span>
          </h2>
          <p className="panel-subtitle hand-panel-subtitle">
            {activeSkillTest
              ? "Only skill cards can be dragged and committed during an active skill test."
              : "Play or discard cards from your hand."}
          </p>
        </div>
      </div>

      {hand.length === 0 ? (
        <div className="hand-panel-empty">
          <p className="panel-subtitle">No cards in hand.</p>
        </div>
      ) : (
        <div className="hand-card-grid">
          {hand.map((card) => {
            const isDragging = draggedCardId === card.id;
            const draggable = activeSkillTest
              ? card.type === "skill"
              : card.type !== "skill";
            const cardIcons = formatSkillList(card.icons);

            return (
              <div
                key={card.id}
                className={`entity-card player-card hand-card ${getCardTypeClassName(card)} ${
                  isDragging ? "dragging-card" : ""
                } ${draggable ? "hand-card-draggable" : "hand-card-static"}`}
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
                  <p className="entity-title hand-card-title">{card.name}</p>
                  <span
                    className={`card-type-badge ${getCardTypeClassName(card)}`}
                  >
                    {card.type}
                  </span>
                </div>

                <div className="hand-card-meta">
                  {card.cost !== undefined && (
                    <span className="token-chip">Cost {card.cost}</span>
                  )}

                  {cardIcons.length > 0 && (
                    <div className="hand-card-icon-row" aria-label="Card icons">
                      {cardIcons.map((icon, index) => (
                        <span
                          key={`${card.id}-${icon}-${index}`}
                          className={`skill-pill skill-pill-small ${skillMeta[icon].className}`}
                          title={skillMeta[icon].label}
                        >
                          <span className="skill-pill-icon">
                            {skillMeta[icon].short}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}

                  {activeSkillTest && card.type !== "skill" && (
                    <span className="token-chip danger">Not commitable</span>
                  )}
                </div>

                {card.text && <p className="entity-text hand-card-text">{card.text}</p>}

                {!activeSkillTest && (
                  <div className="card-actions hand-card-actions">
                    <button onClick={() => playCard(card.id)}>Play</button>
                    <button onClick={() => discardCard(card.id)}>Discard</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
