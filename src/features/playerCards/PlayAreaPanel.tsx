import { useState } from "react";
import SkillIcon from "../../components/SkillIcon";
import { normalizeSkillIcon } from "../../components/skillIconUtils";
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
        <div className="play-area-image-grid">
          {playArea.map((card) => {
            const imageUrl = getCardImageUrl(card.image);
            const cardIcons = (card.icons ?? [])
              .map((icon) => normalizeSkillIcon(icon))
              .filter((icon): icon is NonNullable<typeof icon> => icon !== null);

            if (!imageUrl) {
              return (
                <div
                  key={card.id}
                  className={`entity-card player-card highlight ${getCardTypeClassName(card)}`}
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
                  </div>

                  {card.text && <p className="entity-text">{card.text}</p>}
                </div>
              );
            }

            return (
              <div
                key={card.id}
                className={`play-area-image-card ${getCardTypeClassName(card)}`}
              >
                <img
                  src={imageUrl}
                  alt={card.name}
                  className="play-area-card-image"
                  loading="lazy"
                />

                <div className="play-area-image-topbar">
                  {card.cost !== undefined ? (
                    <span className="play-area-cost-chip">{card.cost}</span>
                  ) : (
                    <span className="play-area-cost-chip play-area-cost-chip-empty">
                      —
                    </span>
                  )}

                  <span
                    className={`card-type-badge play-area-image-type ${getCardTypeClassName(card)}`}
                  >
                    {card.type}
                  </span>
                </div>

                {cardIcons.length > 0 ? (
                  <div className="play-area-image-icons" aria-label="Card icons">
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

                <div className="play-area-image-footer">
                  <p className="play-area-image-title">{card.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
