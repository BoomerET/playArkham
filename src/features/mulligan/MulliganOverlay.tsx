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

  if (!isMulliganActive) {
    return null;
  }

  return (
    <div className="mulligan-overlay">
      <div className="mulligan-overlay__card">
        <h2 className="mulligan-overlay__title">Opening Hand</h2>
        <p className="mulligan-overlay__text">
          Select any number of cards to redraw.
        </p>

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

                <div className="mulligan-card__overlay">
                  <div className="mulligan-card__name">{card.name}</div>
                  <div className="mulligan-card__meta">
                    {card.type}
                    {card.slot ? ` • ${card.slot}` : ""}
                  </div>
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
  );
}
