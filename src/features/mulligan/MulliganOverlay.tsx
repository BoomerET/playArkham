import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "../../store/gameStore";
import "./mulliganOverlay.css";

const playerCardImages = import.meta.glob(
  "../../assets/images/players/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

function getPlayerCardImageUrl(imageName?: string): string | null {
  if (!imageName) {
    return null;
  }

  const normalized = imageName.toLowerCase();

  const match = Object.entries(playerCardImages).find(([path]) =>
    path.toLowerCase().endsWith(`/${normalized}`),
  );

  return match?.[1] ?? null;
}

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
  id: string;
  name: string;
  frontImageUrl: string;
  backImageUrl: string | null;
};

export default function MulliganOverlay() {
  const isMulliganActive = useGameStore((state) => state.isMulliganActive);
  const hand = useGameStore((state) => state.hand);
  const selectedMulliganCardIds = useGameStore(
    (state) => state.selectedMulliganCardIds,
  );
  const toggleMulliganCardSelection = useGameStore(
    (state) => state.toggleMulliganCardSelection,
  );
  const confirmMulligan = useGameStore((state) => state.confirmMulligan);
  const skipMulligan = useGameStore((state) => state.skipMulligan);

  const zoomHeld = useModifierKey("Shift");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [previewSide, setPreviewSide] = useState<"front" | "back">("front");

  const previewCard = useMemo<PreviewCard | null>(() => {
    if (!zoomHeld || !hoveredCardId) {
      return null;
    }

    const card = hand.find((entry) => entry.id === hoveredCardId);

    if (!card) {
      return null;
    }

    const frontImageUrl = getPlayerCardImageUrl(card.image);

    if (!frontImageUrl) {
      return null;
    }

    return {
      id: card.id,
      name: card.name,
      frontImageUrl,
      backImageUrl: null,
    };
  }, [hand, hoveredCardId, zoomHeld]);

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

  if (!isMulliganActive) {
    return null;
  }

  const effectivePreviewSide = zoomHeld ? previewSide : "front";

  const previewImageUrl =
    effectivePreviewSide === "back" && previewCard?.backImageUrl
      ? previewCard.backImageUrl
      : (previewCard?.frontImageUrl ?? null);

  return (
    <>
      <div className="mulligan-overlay">
        <div className="mulligan-overlay__card">
          <h2 className="mulligan-overlay__title">Opening Hand</h2>
          <p className="mulligan-overlay__text">
            Select any number of cards to redraw.
          </p>

          <div
            className={`mulligan-overlay__zoom-hint ${
              hoveredCardId ? "visible" : ""
            } ${zoomHeld ? "active" : ""}`}
          >
            Hold <kbd>Shift</kbd> to zoom
            {previewCard?.backImageUrl ? (
              <>
                {" "}
                • Press <kbd>F</kbd> to flip
              </>
            ) : null}
          </div>

          <div className="mulligan-overlay__grid">
            {hand.map((card) => {
              const selected = selectedMulliganCardIds.includes(card.id);
              const imageUrl = getPlayerCardImageUrl(card.image);

              return (
                <button
                  key={card.id}
                  type="button"
                  className={`mulligan-card ${
                    selected ? "mulligan-card--selected" : ""
                  }`}
                  onClick={() => toggleMulliganCardSelection(card.id)}
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
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={card.name}
                      className="mulligan-card__image"
                      draggable={false}
                    />
                  ) : (
                    <div className="mulligan-card__fallback">{card.name}</div>
                  )}

                  <div className="mulligan-card__selection-badge">
                    {selected ? "Redraw" : "Keep"}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mulligan-overlay__actions">
            <button
              type="button"
              className="mulligan-overlay__primary"
              onClick={confirmMulligan}
            >
              Redraw Selected
            </button>

            <button
              type="button"
              className="mulligan-overlay__secondary"
              onClick={skipMulligan}
            >
              Keep Hand
            </button>
          </div>
        </div>
      </div>

      {previewCard && previewImageUrl && (
        <div className="mulligan-preview-overlay" aria-hidden="true">
          <div className="mulligan-preview-frame">
            {previewCard.backImageUrl && (
              <button
                type="button"
                className="mulligan-preview-flip-button"
                onClick={() =>
                  setPreviewSide((current) =>
                    current === "front" ? "back" : "front",
                  )
                }
              >
                {previewSide === "front" ? "Show Back" : "Show Front"}
              </button>
            )}

            <img
              src={previewImageUrl}
              alt={`${previewCard.name} ${effectivePreviewSide}`}
              className="mulligan-preview-image"
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
