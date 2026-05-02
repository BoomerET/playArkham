import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import SkillIcon from "../../components/SkillIcon";
import { normalizeSkillIcon } from "../../components/skillIconUtils";
import { useGameStore } from "../../store/gameStore";
import type { PlayerCard } from "../../types/game";
import { getPlayerCardImageUrl } from "../../lib/playerCardImages";
import { countMatchingIcons } from "../../lib/skillTestHelpers";
import "./handPanel.css";

const playerCardImages = import.meta.glob(
  [
    "../../assets/images/players/*.{jpg,jpeg,png,webp}",
    "../../assets/images/playerCards/*.{jpg,jpeg,png,webp}",
    "../../assets/images/playercards/*.{jpg,jpeg,png,webp}",
    "../../assets/images/cards/*.{jpg,jpeg,png,webp}",
  ],
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

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

function slugifyName(value: string) {
  return value
    .toLowerCase()
    .replace(/['".,!?]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getExplicitImageName(card: PlayerCard): string | undefined {
  const maybeCard = card as PlayerCard & {
    image?: string;
    imageFront?: string;
    portrait?: string;
  };

  return maybeCard.image ?? maybeCard.imageFront ?? maybeCard.portrait;
}

function getExplicitBackImageName(card: PlayerCard): string | undefined {
  const maybeCard = card as PlayerCard & {
    imageBack?: string;
    backImage?: string;
    portraitBack?: string;
  };

  return maybeCard.imageBack ?? maybeCard.backImage ?? maybeCard.portraitBack;
}

function findImageUrlByName(imageName?: string): string | null {
  if (!imageName) {
    return null;
  }

  const normalized = imageName.toLowerCase();

  const match = Object.entries(playerCardImages).find(([path]) =>
    path.toLowerCase().endsWith(`/${normalized}`),
  );

  return match?.[1] ?? null;
}

function findImageUrlByBaseNames(baseNames: string[]): string | null {
  const normalizedBases = baseNames.map((name) => name.toLowerCase());

  const match = Object.entries(playerCardImages).find(([path]) => {
    const fileName = path.split("/").pop()?.toLowerCase() ?? "";
    const baseName = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, "");
    return normalizedBases.includes(baseName);
  });

  return match?.[1] ?? null;
}

function getCardImageUrl(card: PlayerCard): string | null {
  const explicit = findImageUrlByName(getExplicitImageName(card));
  if (explicit) {
    return explicit;
  }

  return findImageUrlByBaseNames([
    card.code ?? "",
    slugifyName(card.name),
  ]);
}

function getCardBackImageUrl(card: PlayerCard): string | null {
  const explicit = findImageUrlByName(getExplicitBackImageName(card));
  if (explicit) {
    return explicit;
  }

  return findImageUrlByBaseNames([
    `${card.code}-back`,
    `${slugifyName(card.name)}-back`,
    `${card.code}_back`,
    `${slugifyName(card.name)}_back`,
  ]);
}

type PreviewCard = {
  instanceId: string;
  name: string;
  frontImageUrl: string;
  backImageUrl: string | null;
};

export default function HandPanel() {
  const hand = useGameStore((state) => state.hand);
  const discardCard = useGameStore((state) => state.discardCard);
  const playCard = useGameStore((state) => state.playCard);
  const shuffleDeck = useGameStore((state) => state.shuffleDeck);
  const setDraggedCardId = useGameStore((state) => state.setDraggedCardId);
  const commitSkillCard = useGameStore((state) => state.commitSkillCard);
  const draggedCardId = useGameStore((state) => state.draggedCardId);
  const activeSkillTest = useGameStore((state) => state.activeSkillTest);
  const deckCount = useGameStore((state) => state.deck.length);

  const zoomHeld = useModifierKey("Shift");
  const [hoveredCardInstanceId, setHoveredCardInstanceId] = useState<string | null>(null);
  const [previewSide, setPreviewSide] = useState<"front" | "back">("front");

  const title = activeSkillTest ? "Hand — Commit Skill Cards" : "Hand";

  const previewCard = useMemo<PreviewCard | null>(() => {
    if (!zoomHeld || !hoveredCardInstanceId) {
      return null;
    }
    const card = hand.find((entry) => entry.instanceId === hoveredCardInstanceId);
    if (!card) {
      return null;
    }

    const frontImageUrl = getCardImageUrl(card);
    if (!frontImageUrl) {
      return null;
    }

    return {
      instanceId: card.instanceId,
      name: card.name,
      frontImageUrl,
      backImageUrl: getCardBackImageUrl(card),
    };
  }, [hand, hoveredCardInstanceId, zoomHeld]);

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
    <section className="game-panel hand-panel">
      <div className="hand-panel-header">
        <div>
          <p className="hand-panel-kicker">Player Cards</p>
          <h2 className="hand-panel-title">
            {title} <span className="hand-panel-count">({hand.length})</span>
          </h2>
          <p className="panel-subtitle hand-panel-subtitle">
            {activeSkillTest ? (
              "Cards with matching icons can be dragged and committed during an active skill test."
            ) : (
              <>
                Play cards normally • <kbd>Shift</kbd>+Click to
                discard • Hold <kbd>Shift</kbd> to zoom
              </>
            )}
          </p>
          <div
            className={`card-zoom-hint ${hoveredCardInstanceId ? "visible" : ""} ${zoomHeld ? "active" : ""
              }`}
          >
            Hold <kbd>Shift</kbd> to zoom • Press <kbd>F</kbd> to flip
          </div>
        </div>

        {!activeSkillTest && (
          <div className="hand-panel-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={shuffleDeck}
            >
              Shuffle Deck ({deckCount})
            </button>
          </div>
        )}
      </div>

      {hand.length === 0 ? (
        <div className="hand-panel-empty">
          <p className="panel-subtitle">No cards in hand.</p>
        </div>
      ) : (
        <div className="hand-card-grid-image">
          {hand.map((card) => {
            const imageUrl = getPlayerCardImageUrl(card);
            const isDragging = draggedCardId === card.instanceId;

            const matchingIcons = activeSkillTest
              ? countMatchingIcons(card, activeSkillTest.skill)
              : 0;

            const cardIcons = (card.icons ?? [])
              .map((icon) => normalizeSkillIcon(icon))
              .filter(
                (icon): icon is NonNullable<typeof icon> => icon !== null,
              );

            const draggable = activeSkillTest
              ? matchingIcons > 0
              : card.type !== "skill";

            return (
              <div
                key={card.instanceId}
                className={`hand-card-image-shell ${isDragging ? "dragging-card" : ""
                  } ${draggable ? "hand-card-draggable" : "hand-card-static"} ${activeSkillTest && canCommit ? "hand-card-committable" : ""
                  }`}
                draggable={draggable}
                onClick={(event) => {
                  if (activeSkillTest) {
                    return;
                  }

                  if (event.shiftKey) {
                    event.preventDefault();
                    event.stopPropagation();
                    discardCard(card.instanceId);
                  }
                }}
                onContextMenu={(event) => {
                  if (activeSkillTest) {
                    return;
                  }

                  if (event.shiftKey) {
                    event.preventDefault();
                    discardCard(card.instanceId);
                  }
                }}
                onDragStart={(event) => {
                  if (!draggable) {
                    return;
                  }

                  event.dataTransfer.setData("text/plain", card.instanceId);
                  event.dataTransfer.effectAllowed = "move";
                  setDraggedCardId(card.instanceId);
                }}
                onDragEnd={() => {
                  setDraggedCardId(null);
                }}
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
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={card.name}
                    className="hand-card-image"
                    draggable={false}
                  />
                ) : (
                  <div className="card-image-fallback">
                    <strong>{card.name}</strong>
                    <span>{card.type}</span>
                  </div>
                )}

                <div className="hand-card-image-topbar">
                  <span
                    className={`hand-card-cost-chip ${card.cost === undefined ? "hand-card-cost-chip-empty" : ""
                      }`}
                  >
                    {card.cost ?? "—"}
                  </span>

                  <span className="hand-card-cost-chip hand-card-image-type">
                    {card.type}
                  </span>
                </div>

                {cardIcons.length > 0 && (
                  <div
                    className="hand-card-image-icons"
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
                )}

                <div className="hand-card-image-overlay">
                  <div className="hand-card-image-overlay-inner">
                    <h3 className="hand-card-image-title">{card.name}</h3>

                    {card.text ? (
                      <div className="hand-card-image-text-preview">
                        {card.text}
                      </div>
                    ) : null}

                    {!activeSkillTest ? (
                      <div className="hand-card-image-actions button-row">
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => playCard(card.instanceId)}
                        >
                          Play
                        </button>
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => discardCard(card.instanceId)}
                        >
                          Discard
                        </button>
                      </div>
                    ) : (
                      <div className="hand-card-image-actions button-row">
                        {(() => {
                          const matchingIcons = activeSkillTest
                            ? countMatchingIcons(card, activeSkillTest.skill)
                            : 0;

                          const canCommit = matchingIcons > 0;

                          return (
                            <button
                              type="button"
                              className="secondary-button"
                              disabled={!canCommit}
                              onClick={() => commitSkillCard(card.instanceId)}
                            >
                              {canCommit ? `Commit +${matchingIcons}` : "No Match"}
                            </button>
                          );
                        })()}
                      </div>
                    )}
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
            className="card-preview-overlay hand-preview-overlay"
            aria-hidden="true"
            onMouseLeave={() => setHoveredCardInstanceId(null)}
          >
            <div className="card-preview-frame hand-preview-frame">
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
                className="card-preview-image hand-preview-image"
                draggable={false}
              />
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
