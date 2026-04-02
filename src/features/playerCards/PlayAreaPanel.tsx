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

export default function PlayAreaPanel() {
  const playArea = useGameStore((state) => state.playArea);
  const playCard = useGameStore((state) => state.playCard);
  const togglePlayAreaCardExhausted = useGameStore(
    (state) => state.togglePlayAreaCardExhausted,
  );
  const draggedCardId = useGameStore((state) => state.draggedCardId);
  const setDraggedCardId = useGameStore((state) => state.setDraggedCardId);

  const [isDragOver, setIsDragOver] = useState(false);
  const zoomHeld = useModifierKey("Shift");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [previewSide, setPreviewSide] = useState<"front" | "back">("front");

  const previewCard = useMemo<PreviewCard | null>(() => {
    if (!zoomHeld || !hoveredCardId) {
      return null;
    }

    const card = playArea.find((entry) => entry.id === hoveredCardId);
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
  }, [hoveredCardId, playArea, zoomHeld]);

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
      <div className="hand-panel-header">
        <div>
          <p className="hand-panel-kicker">In Play</p>
          <h2 className="hand-panel-title">
            Play Area <span className="hand-panel-count">({playArea.length})</span>
          </h2>
          <p className="panel-subtitle">
            Drag cards here from your hand to play them. Double-click a card to
            exhaust or ready it.
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

      {playArea.length === 0 ? (
        <div className="empty-drop-message">Drop an asset or event here</div>
      ) : (
        <div className="play-area-image-grid">
          {playArea.map((card) => {
            const imageUrl = getCardImageUrl(card);
            const cardIcons = (card.icons ?? [])
              .map((icon) => normalizeSkillIcon(icon))
              .filter((icon): icon is NonNullable<typeof icon> => icon !== null);

            return (
              <div
                key={card.id}
                className={`play-area-image-card ${
                  card.exhausted ? "play-area-card-exhausted" : ""
                }`}
                onMouseEnter={() => {
                  setHoveredCardId(card.id);
                  setPreviewSide("front");
                }}
                onMouseLeave={() =>
                  setHoveredCardId((current) =>
                    current === card.id ? null : current,
                  )
                }
              >
                <div
                  className="play-area-card-interactive"
                  onDoubleClick={() => togglePlayAreaCardExhausted(card.id)}
                  title="Double-click to exhaust or ready"
                >
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

                  <div className="play-area-image-topbar">
                    <span
                      className={`play-area-cost-chip ${
                        card.cost === undefined ? "play-area-cost-chip-empty" : ""
                      }`}
                    >
                      {card.cost ?? "—"}
                    </span>

                    <span className="play-area-cost-chip play-area-image-type">
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

      {previewCard && previewImageUrl ? (
        <div
          className="card-preview-overlay"
          aria-hidden="true"
          onMouseLeave={() => setHoveredCardId(null)}
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
        </div>
      ) : null}
    </section>
  );
}
