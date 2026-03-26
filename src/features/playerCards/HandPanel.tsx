import SkillIcon from "../../components/SkillIcon";
import { normalizeSkillIcon } from "../../components/skillIconUtils";
import { renderCardText } from "../../lib/renderCardText";
import { getCardTypeClassName } from "../../lib/ui";
import { useGameStore } from "../../store/gameStore";

const cardImages = import.meta.glob("../../assets/images/players/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function getCardImageUrl(imageName?: string): string | null {
  if (!imageName) {
    return null;
  }

  const match = Object.entries(cardImages).find(([path]) =>
    path.endsWith(`/${imageName}`),
  );

  return match?.[1] ?? null;
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
        <div className="hand-card-grid hand-card-grid-image">
          {hand.map((card) => {
            const isDragging = draggedCardId === card.id;
            const draggable = activeSkillTest
              ? card.type === "skill"
              : card.type !== "skill";

            const cardIcons = (card.icons ?? [])
              .map((icon) => normalizeSkillIcon(icon))
              .filter((icon): icon is NonNullable<typeof icon> => icon !== null);

            const imageUrl = getCardImageUrl(card.image);

            return (
              <div
                key={card.id}
                className={`hand-card-image-shell ${getCardTypeClassName(card)} ${
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
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={card.name}
                      className="hand-card-image"
                      loading="lazy"
                    />

                    <div className="hand-card-image-topbar">
                      {card.cost !== undefined ? (
                        <span className="hand-card-cost-chip">{card.cost}</span>
                      ) : (
                        <span className="hand-card-cost-chip hand-card-cost-chip-empty">
                          —
                        </span>
                      )}

                      <span
                        className={`card-type-badge hand-card-image-type ${getCardTypeClassName(card)}`}
                      >
                        {card.type}
                      </span>
                    </div>

                    {cardIcons.length > 0 ? (
                      <div
                        className="hand-card-image-icons"
                        aria-label="Card icons"
                      >
                        {cardIcons.map((icon, index) => (
                          <span
                            key={`${card.id}-${icon}-${index}`}
                            className={`skill-icon-badge skill-${icon}`}
                            title={icon}
                            aria-label={icon}
                          >
                            <SkillIcon
                              skill={icon}
                              className="skill-icon-svg"
                              viewBox="0 0 24 24"
                            />
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="hand-card-image-overlay">
                      <div className="hand-card-image-overlay-inner">
                        <p className="hand-card-image-title">{card.name}</p>

                        {card.text ? (
                          <div className="hand-card-image-text-preview">
                            {renderCardText(card.text)}
                          </div>
                        ) : null}

                        {!activeSkillTest ? (
                          <div className="card-actions hand-card-image-actions">
                            <button onClick={() => playCard(card.id)}>Play</button>
                            <button onClick={() => discardCard(card.id)}>
                              Discard
                            </button>
                          </div>
                        ) : (
                          <div className="hand-card-image-commit-status">
                            {card.type === "skill" ? (
                              <span className="token-chip">Drag to Commit</span>
                            ) : (
                              <span className="token-chip danger">
                                Not commitable
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className={`entity-card player-card hand-card ${getCardTypeClassName(card)}`}
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
                              className={`skill-icon-badge skill-${icon}`}
                              title={icon}
                              aria-label={icon}
                            >
                              <SkillIcon
                                skill={icon}
                                className="skill-icon-svg"
                                viewBox="0 0 24 24"
                              />
                            </span>
                          ))}
                        </div>
                      )}

                      {activeSkillTest && card.type !== "skill" && (
                        <span className="token-chip danger">Not commitable</span>
                      )}
                    </div>

                    {card.text && (
                      <div className="entity-text hand-card-text">
                        {renderCardText(card.text)}
                      </div>
                    )}

                    {!activeSkillTest && (
                      <div className="card-actions hand-card-actions">
                        <button onClick={() => playCard(card.id)}>Play</button>
                        <button onClick={() => discardCard(card.id)}>
                          Discard
                        </button>
                      </div>
                    )}
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
