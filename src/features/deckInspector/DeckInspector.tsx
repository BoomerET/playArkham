import { useMemo } from "react";
import { useGameStore } from "../../store/gameStore";
import type { PlayerCard } from "../../types/game";
import "./deckInspector.css";

type GroupedCard = {
  name: string;
  count: number;
};

function OrderedCardSection({ title, cards }: CardSectionProps) {
  return (
    <section className="deck-inspector__section">
      <div className="deck-inspector__section-header">
        <h3 className="deck-inspector__section-title">{title}</h3>
        <span className="deck-inspector__count">{cards.length}</span>
      </div>

      {cards.length === 0 ? (
        <div className="deck-inspector__empty">Empty</div>
      ) : (
        <ol className="deck-inspector__list">
          {cards.map((card, index) => (
            <li
              key={`${card.instanceId}-${index}`}
              className="deck-inspector__list-item"
            >
              <span>
                {index + 1}. {card.name}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function groupCardsByName(cards: PlayerCard[]): GroupedCard[] {
  const counts = new Map<string, number>();

  for (const card of cards) {
    counts.set(card.name, (counts.get(card.name) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

type CardSectionProps = {
  title: string;
  cards: PlayerCard[];
};

function CardSection({ title, cards }: CardSectionProps) {
  const groupedCards = useMemo(() => groupCardsByName(cards), [cards]);

  return (
    <section className="deck-inspector__section">
      <div className="deck-inspector__section-header">
        <h3 className="deck-inspector__section-title">{title}</h3>
        <span className="deck-inspector__count">{cards.length}</span>
      </div>

      {groupedCards.length === 0 ? (
        <div className="deck-inspector__empty">Empty</div>
      ) : (
        <ul className="deck-inspector__list">
          {groupedCards.map((card) => (
            <li key={card.name} className="deck-inspector__list-item">
              <span>{card.name}</span>
              <span className="deck-inspector__list-count">{card.count}x</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function DeckInspector() {
  const enemyIdsThatAttackedThisRound = useGameStore(
    (state) => state.enemyIdsThatAttackedThisRound,
  );
  const showDeckInspector = useGameStore((state) => state.showDeckInspector);
  const closeDeckInspector = useGameStore((state) => state.closeDeckInspector);
  const deck = useGameStore((state) => state.deck);
  const hand = useGameStore((state) => state.hand);
  const discard = useGameStore((state) => state.discard);

  if (!showDeckInspector) {
    return null;
  }

  return (
    <aside className="deck-inspector" aria-label="Deck Inspector">
      <div className="deck-inspector__header">
        <h2 className="deck-inspector__title">Deck Inspector</h2>
        <button
          type="button"
          className="deck-inspector__close"
          onClick={closeDeckInspector}
        >
          Close
        </button>
      </div>

      <p className="deck-inspector__hint">Hidden shortcut: Shift + D</p>
      <section className="deck-inspector__section">
        <div className="deck-inspector__section-header">
          <h3 className="deck-inspector__section-title">Attacked This Round</h3>
          <span className="deck-inspector__count">
            {enemyIdsThatAttackedThisRound.length}
          </span>
        </div>

        {enemyIdsThatAttackedThisRound.length === 0 ? (
          <div className="deck-inspector__empty">None</div>
        ) : (
          <ul className="deck-inspector__list">
            {enemyIdsThatAttackedThisRound.map((id) => (
              <li key={id} className="deck-inspector__list-item">
                <span>{id}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <OrderedCardSection title="Deck Order" cards={deck} />
      <CardSection title="Hand" cards={hand} />
      <CardSection title="Discard" cards={discard} />
    </aside>
  );
}
