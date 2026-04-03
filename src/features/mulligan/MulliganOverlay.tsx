import { useGameStore } from "../../store/gameStore";
import "./mulliganOverlay.css";

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

            return (
              <button
                key={card.id}
                type="button"
                className={`mulligan-overlay__item ${
                  selected ? "mulligan-overlay__item--selected" : ""
                }`}
                onClick={() => toggleMulliganCardSelection(card.id)}
              >
                <span className="mulligan-overlay__item-name">{card.name}</span>
                <span className="mulligan-overlay__item-meta">
                  {card.type}
                  {card.slot ? ` • ${card.slot}` : ""}
                </span>
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
