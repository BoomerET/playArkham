import { useEffect, useMemo, useState } from "react";
import SkillIcon from "../../components/SkillIcon";
import { normalizeSkillIcon } from "../../components/skillIconUtils";
import { useGameStore } from "../../store/gameStore";
import type { PlayerCard } from "../../types/game";

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

  return findImageUrlByBaseNames([card.id, slugifyName(card.name)]);
}

function getCardBackImageUrl(card: PlayerCard): string | null {
  const explicit = findImageUrlByName(getExplicitBackImageName(card));
  if (explicit) {
    return explicit;
  }

  return findImageUrlByBaseNames([
    `${card.id}-back`,
    `${slugifyName(card.name)}-back`,
    `${card.id}_back`,
    `${slugifyName(card.name)}_back`,
  ]);
}

type PreviewCard = {
  id: string;
  name: string;
  frontImageUrl: string;
  backImageUrl: string | null;
};

export default function HandPanel() {
  const hand = useGameStore((state) => state.hand);
  const discardCard = useGameStore((state) => state.discardCard);
  const playCard = useGameStore((state) => state.playCard);
  const setDraggedCardId = useGameStore((state) => state.setDraggedCardId);
  const draggedCardId = useGameStore((state) => state.draggedCardId);
  const activeSkillTest = useGameStore((state) => state.activeSkillTest);

  const zoomHeld = useModifierKey("Shift");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [previewSide, setPreviewSide] = useState<"front" | "back">("front");

  const title = activeSkillTest ? "Hand — Commit Skill Cards" : "Hand";

  const previewCard = useMemo<PreviewCard | null>(() => {
    if (!zoomHeld || !hoveredCardId) {
      return null;
    }

    const card = hand.find((entry) => entry.id === hoveredCardId);
    if (!card) {
      return null;
    }

    const frontImageUrl = getCardImageUrl(card);
    if (!frontImageUrl) {
      return null;
    }

    return {
      id: card.id,
      name: card.name,
      frontImageUrl,
      backImageUrl: getCardBackImageUrl(card),
    };
  }, [hand, hoveredCardId, zoomHeld]);

  useEffect(() => {
    setPreviewSide("front");
  }, [hoveredCardId]);

  useEffect(() => {
    if (!previewCard) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHoveredCardId(null);
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
      : previewCard?.frontImageUrl ?? null;

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
          <div
            className={`card-zoom-hint ${hoveredCardId ? "visible" : ""} ${
              zoomHeld ? "active" : ""
            }`}
          >
            Hold <kbd>Shift</kbd> to zoom • Press <kbd>F</kbd> to flip
          </div>
        </div>
      </div>

      {hand.length === 0 ? (
        <div className="hand-panel-empty">
          <p className="panel-subtitle">No cards in hand.</p>
        </div>
      ) : (
        <div className="hand-card-grid-image">
          {hand.map((card) => {
            const imageUrl = getCardImageUrl(card);
            const isDragging = draggedCardId === card.id;
            const draggable = activeSkillTest
              ? card.type === "skill"
              : card.type !== "skill";

            const cardIcons = (card.icons ?? [])
              .map((icon) => normalizeSkillIcon(icon))
              .filter((icon): icon is NonNullable<typeof icon> => icon !== null);

            return (
              <div
                key={card.id}
                className={`hand-card-image-shell ${
                  isDragging ? "dragging-card" : ""
                } ${draggable ? "hand-card-draggable" : "hand-card-static"}`}
                draggable={draggable}
                onDragStart={(event) => {
                  if (!draggable) {
                    return;
                  }

                  event.dataTransfer.setData("text/plain", card.id);
                  event.dataTransfer.effectAllowed = "move";
                  setDraggedCardId(card.id);
                }}
                onDragEnd={() => {
                  setDraggedCardId(null);
                }}
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() =>
                  setHoveredCardId((current) =>
                    current === card.id ? null : current,
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
                    className={`hand-card-cost-chip ${
                      card.cost === undefined ? "hand-card-cost-chip-empty" : ""
                    }`}
                  >
                    {card.cost ?? "—"}
                  </span>

                  <span className="hand-card-cost-chip hand-card-image-type">
                    {card.type}
                  </span>
                </div>

                {cardIcons.length > 0 && (
                  <div className="hand-card-image-icons" aria-label="Card icons">
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
                          onClick={() => playCard(card.id)}
                        >
                          Play
                        </button>
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => discardCard(card.id)}
                        >
                          Discard
                        </button>
                      </div>
                    ) : (
                      <div className="hand-card-image-commit-status">
                        {card.type === "skill" ? (
                          <span className="token-chip gold">Draggable to commit</span>
                        ) : (
                          <span className="token-chip danger">Not committable</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {previewCard && previewImageUrl && (
        <div
          className="card-preview-overlay"
          aria-hidden="true"
          onMouseLeave={() => setHoveredCardId(null)}
        >
          <div className="card-preview-frame">
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
              className="card-preview-image"
              draggable={false}
            />
          </div>
        </div>
      )}
    </section>
  );
}
