import { useGameStore } from "../../store/gameStore";

export default function DeckPanel() {
  const deck = useGameStore((state) => state.deck);

  return (
    <section className="game-panel">
      <h2>Deck</h2>
      <div className="stat-grid">
        <div className="stat-box">
          <span className="stat-label">Cards Remaining</span>
          <span className="stat-value">{deck.length}</span>
        </div>
      </div>
    </section>
  );
}

