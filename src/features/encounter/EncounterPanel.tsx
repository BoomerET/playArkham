import { useMemo } from "react";
import { useGameStore } from "../../store/gameStore";
import type { EncounterCard } from "../../types/game";

const encounterImages = import.meta.glob(
  "../../assets/images/encounters/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

type GroupedEncounterCard = {
  name: string;
  count: number;
  type: EncounterCard["type"];
};

function groupEncounterCards(cards: EncounterCard[]): GroupedEncounterCard[] {
  const grouped = new Map<string, GroupedEncounterCard>();

  for (const card of cards) {
    const existing = grouped.get(card.name);

    if (existing) {
      existing.count += 1;
      continue;
    }

    grouped.set(card.name, {
      name: card.name,
      count: 1,
      type: card.type,
    });
  }

  return Array.from(grouped.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

function slugifyName(value: string) {
  return value
    .toLowerCase()
    .replace(/['".,!?]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findEncounterImageUrlByBaseNames(baseNames: string[]): string | null {
  const normalizedBases = baseNames
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);

  const match = Object.entries(encounterImages).find(([path]) => {
    const fileName = path.split("/").pop()?.toLowerCase() ?? "";
    const baseName = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, "");
    return normalizedBases.includes(baseName);
  });

  return match?.[1] ?? null;
}

function getEncounterCardImageUrl(card: EncounterCard): string | null {
  return findEncounterImageUrlByBaseNames([
    card.code ?? "",
    card.id,
    slugifyName(card.name),
  ]);
}

function renderEncounterText(text?: string | string[]) {
  if (!text) {
    return null;
  }

  if (Array.isArray(text)) {
    return text.join(" ");
  }

  return text;
}

export default function EncounterPanel() {
  const encounterDeck = useGameStore((state) => state.encounterDeck);
  const encounterDiscard = useGameStore((state) => state.encounterDiscard);
  const lastEncounterCard = useGameStore((state) => state.lastEncounterCard);

  const groupedDiscard = useMemo(
    () => groupEncounterCards(encounterDiscard),
    [encounterDiscard],
  );

  const lastEncounterImageUrl = lastEncounterCard
    ? getEncounterCardImageUrl(lastEncounterCard)
    : null;

  return (
    <section className="encounter-panel">
      <div className="encounter-panel__header">
        <p className="hand-panel-kicker">Scenario</p>
        <h2 className="hand-panel-title">Encounter</h2>
      </div>

      <div className="encounter-panel__counts">
        <div className="encounter-panel__count-card">
          <span className="encounter-panel__count-label">Deck</span>
          <span className="encounter-panel__count-value">
            {encounterDeck.length}
          </span>
        </div>

        <div className="encounter-panel__count-card">
          <span className="encounter-panel__count-label">Discard</span>
          <span className="encounter-panel__count-value">
            {encounterDiscard.length}
          </span>
        </div>
      </div>

      <div className="encounter-panel__section">
        <h3 className="encounter-panel__section-title">Last Drawn</h3>
        {lastEncounterCard ? (
          <div className="encounter-panel__last-card">
            {lastEncounterImageUrl ? (
              <img
                src={lastEncounterImageUrl}
                alt={lastEncounterCard.name}
                className="encounter-panel__last-image"
                draggable={false}
              />
            ) : null}

            <div className="encounter-panel__last-name">
              {lastEncounterCard.name}
            </div>
            <div className="encounter-panel__last-type">
              {lastEncounterCard.type}
            </div>
            {lastEncounterCard.code ? (
              <div className="encounter-panel__last-type">
                Code: {lastEncounterCard.code}
              </div>
            ) : null}
            {lastEncounterCard.text ? (
              <div className="encounter-panel__last-text">
                {renderEncounterText(lastEncounterCard.text)}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="encounter-panel__empty">No encounter card drawn yet.</div>
        )}
      </div>

      <div className="encounter-panel__section">
        <h3 className="encounter-panel__section-title">Discard</h3>

        {groupedDiscard.length === 0 ? (
          <div className="encounter-panel__empty">
            Encounter discard is empty.
          </div>
        ) : (
          <ul className="encounter-panel__discard-list">
            {groupedDiscard.map((card) => (
              <li
                key={`${card.name}-${card.type}`}
                className="encounter-panel__discard-item"
              >
                <span className="encounter-panel__discard-name">
                  {card.name}
                </span>
                <span className="encounter-panel__discard-meta">
                  {card.count}x • {card.type}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
