import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import SkillIcon from "../../components/SkillIcon";
import { normalizeSkillIcon } from "../../components/skillIconUtils";
import { useGameStore } from "../../store/gameStore";
import { canActivatePlayAreaCardAbility } from "../../lib/playerCardAbilities";
import { getPlayerCardImageUrl, getPlayerCardBackImageUrl } from "../../lib/playerCardImages";

function useModifierKey(key: "Alt" | "Shift") {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        setActive(true);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === key) {
        setActive(false);
      }
    };

    const onWindowBlur = () => {
      setActive(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onWindowBlur);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, [key]);

  return active;
}

type PreviewCard = {
  instanceId: string;
  name: string;
  frontImageUrl: string;
  backImageUrl: string | null;
};

export default function PlayAreaPanel() {
  const activatePlayerCardAbility = useGameStore(
    (state) => state.activatePlayerCardAbility,
  );
  const playArea = useGameStore((state) => state.playArea);
  const playCard = useGameStore((state) => state.playCard);
  const togglePlayAreaCardExhausted = useGameStore(
    (state) => state.togglePlayAreaCardExhausted,
  );
  const draggedCardId = useGameStore((state) => state.draggedCardId);
  const setDraggedCardId = useGameStore((state) => state.setDraggedCardId);
  const triggerPlayAreaCardAbility = useGameStore(
    (state) => state.triggerPlayAreaCardAbility,
  );

  const [isDragOver, setIsDragOver] = useState(false);
  const zoomHeld = useModifierKey("Shift");
  const [hoveredCardInstanceId, setHoveredCardInstanceId] = useState<string | null>(null);
  const [previewSide, setPreviewSide] = useState<"front" | "back">("front");

  const previewCard = useMemo<PreviewCard | null>(() => {
    if (!zoomHeld || !hoveredCardInstanceId) {
      return null;
    }

    const card = playArea.find(
      (entry) => entry.instanceId === hoveredCardInstanceId,
    );

    if (!card) {
      return null;
    }

    const frontImageUrl = getPlayerCardImageUrl(card);

    if (!frontImageUrl) {
      return null;
    }

    return {
      instanceId: card.instanceId,
      name: card.name,
      frontImageUrl,
      backImageUrl: getPlayerCardBackImageUrl(card),
    };
  }, [hoveredCardInstanceId, playArea, zoomHeld]);

  useEffect(() => {
    if (!previewCard) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHoveredCardInstanceId(null);
        return;
      }

      if (
        (event.key === "f" || event.key === "F") &&
        previewCard.backImageUrl
      ) {
        setPreviewSide((current) => (current === "front" ? "back" : "front"));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewCard]);

  const previewImageUrl =
    previewSide === "back" && previewCard?.backImageUrl
      ? previewCard.backImageUrl
      : (previewCard?.frontImageUrl ?? null);
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

        const cardId =
          event.dataTransfer.getData("text/plain") || draggedCardId;
        setIsDragOver(false);
        setDraggedCardId(null);

        if (cardId) {
          playCard(cardId);
        }
      }}
    >
      <div className="hand-panel-header">
        <div>
          <p className="hand-panel-kicker">In Play</p>
          <h2 className="hand-panel-title">
            Play Area{" "}
            <span className="hand-panel-count">({playArea.length})</span>
          </h2>
          <p className="panel-subtitle">
            Drag cards here from your hand to play them. Double-click a card to
            exhaust or ready it.
          </p>
          <div
            className={`card-zoom-hint ${hoveredCardInstanceId ? "visible" : ""} ${zoomHeld ? "active" : ""
              }`}
          >
            Hold <kbd>Shift</kbd> to zoom • Press <kbd>F</kbd> to flip
          </div>
        </div>
      </div>

      {playArea.length === 0 ? (
        <div className="empty-drop-message">Drop an asset or event here</div>
      ) : (
        <div className="play-area-image-grid">
          {playArea.map((card) => {
            const imageUrl = getPlayerCardImageUrl(card);
            const cardIcons = (card.icons ?? [])
              .map((icon) => normalizeSkillIcon(icon))
              .filter(
                (icon): icon is NonNullable<typeof icon> => icon !== null,
              );
            console.log(card.name, card.abilities);
            return (
              <div
                key={card.instanceId}
                className={`play-area-image-card ${card.exhausted ? "play-area-card-exhausted" : ""
                  }`}
                onMouseEnter={() => {
                  setHoveredCardInstanceId(card.instanceId);
                  setPreviewSide("front");
                }}
                onMouseLeave={() =>
                  setHoveredCardInstanceId((current) =>
                    current === card.instanceId ? null : current,
                  )
                }
              >
                <div
                  className="play-area-card-interactive"
                  onDoubleClick={() => togglePlayAreaCardExhausted(card.instanceId)}
                  title="Double-click to exhaust or ready"
                >{card.type === "asset" &&
                  canActivatePlayAreaCardAbility(card) ? (
                  <div className="play-area-image-actions button-row">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        triggerPlayAreaCardAbility(card.instanceId);
                      }}
                    >
                      Use Ability
                    </button>
                  </div>
                ) : null}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={card.name}
                      className="play-area-card-image"
                      draggable={false}
                    />
                  ) : (
                    <div className="card-image-fallback">
                      <strong>{card.name}</strong>
                      <span>{card.type}</span>
                    </div>
                  )}
                  {card.abilities?.length ? (
                    <div className="play-area-image-actions button-row">
                      {card.abilities.map((ability) => (
                        <button
                          key={ability.id}
                          type="button"
                          className="secondary-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            activatePlayerCardAbility(card.instanceId, ability.id);
                          }}
                        >
                          {ability.label}
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <div className="play-area-image-topbar">
                    <span
                      className={`play-area-cost-chip ${card.cost === undefined
                        ? "play-area-cost-chip-empty"
                        : ""
                        }`}
                    >
                      {card.cost ?? "—"}
                    </span>

                    <span className="play-area-cost-chip play-area-image-type">
                      {card.type}
                    </span>
                  </div>

                  {cardIcons.length > 0 ? (
                    <div
                      className="play-area-image-icons"
                      aria-label="Card icons"
                    >
                      {cardIcons.map((icon, index) => (
                        <span
                          key={`${card.instanceId}-${icon}-${index}`}
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

                  <div className="play-area-card-state-row">
                    {card.exhausted ? (
                      <span className="play-area-state-badge">Exhausted</span>
                    ) : (
                      <span className="play-area-state-badge ready">Ready</span>
                    )}
                  </div>

                  <div className="play-area-image-footer">
                    <p className="play-area-image-title">{card.name}</p>
                    {card.text ? (
                      <p className="play-area-image-text">{card.text}</p>
                    ) : null}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {previewCard &&
        previewImageUrl &&
        createPortal(
          <div
            className="card-preview-overlay play-area-preview-overlay"
            aria-hidden="true"
            onMouseLeave={() => setHoveredCardInstanceId(null)}
          >
            <div className="card-preview-frame play-area-preview-frame">
              {previewCard.backImageUrl ? (
                <button
                  type="button"
                  className="card-preview-flip-button"
                  onClick={() =>
                    setPreviewSide((current) =>
                      current === "front" ? "back" : "front",
                    )
                  }
                >
                  {previewSide === "front" ? "Show Back" : "Show Front"}
                </button>
              ) : null}

              <img
                src={previewImageUrl}
                alt={`${previewCard.name} ${previewSide}`}
                className="card-preview-image play-area-preview-image"
                draggable={false}
              />
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
