import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useGameStore } from "../../store/gameStore";
import type { EncounterCard } from "../../types/game";

type GroupedCard = {
  name: string;
  count: number;
  type: EncounterCard["type"];
};

function groupCards(cards: EncounterCard[]): GroupedCard[] {
  const map = new Map<string, GroupedCard>();

  for (const card of cards) {
    const existing = map.get(card.name);

    if (existing) {
      existing.count++;
      continue;
    }

    map.set(card.name, {
      name: card.name,
      count: 1,
      type: card.type,
    });
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
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

function slugifyName(value: string) {
  return value
    .toLowerCase()
    .replace(/['".,!?]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const encounterImages = import.meta.glob(
  "../../assets/images/encounters/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

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

export default function EncounterInspector() {
  const encounterDeck = useGameStore((s) => s.encounterDeck);
  const encounterDiscard = useGameStore((s) => s.encounterDiscard);
  const toggle = useGameStore((s) => s.toggleEncounterInspector);
  const show = useGameStore((s) => s.showEncounterInspector);
  const shuffleEncounterDeck = useGameStore((s) => s.shuffleEncounterDeck);
  const zoomHeld = useModifierKey("Shift");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const groupedDeck = useMemo(() => groupCards(encounterDeck), [encounterDeck]);
  const groupedDiscard = useMemo(
    () => groupCards(encounterDiscard),
    [encounterDiscard],
  );

  const previewCard = useMemo(() => {
    if (!zoomHeld || !hoveredCardId) {
      return null;
    }

    const card =
      encounterDeck.find((entry) => entry.id === hoveredCardId) ??
      encounterDiscard.find((entry) => entry.id === hoveredCardId);

    if (!card) {
      return null;
    }

    const imageUrl = getEncounterCardImageUrl(card);

    if (!imageUrl) {
      return null;
    }

    return {
      id: card.id,
      name: card.name,
      imageUrl,
    };
  }, [zoomHeld, hoveredCardId, encounterDeck, encounterDiscard]);

  if (!show) {
    return null;
  }

  return (
    <div className="deck-inspector-overlay" onClick={toggle}>
      <div
        className="deck-inspector-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="deck-inspector-header">
          <h2>Encounter Deck</h2>
          <div className="button-row">
            <button type="button" onClick={shuffleEncounterDeck}>
              Shuffle
            </button>
            <button type="button" onClick={toggle}>
              Close
            </button>
          </div>
        </div>
        <div
  className={`card-zoom-hint ${hoveredCardId ? "visible" : ""} ${
    zoomHeld ? "active"
  }`}
>
  Hold <kbd>Shift</kbd> to zoom
</div>
        <div className="deck-inspector-body">
          <div>
            <h3>Deck Order (Top → Bottom)</h3>
            <ul>
              {encounterDeck.map((card, index) => (
                <li key={card.id}>
                  {index === 0 && <strong>[TOP]</strong>} {card.name}
                </li>
              ))}
            </ul>

            <h3>Deck Summary</h3>
            <ul>
              {groupedDeck.map((c) => (
                <li key={c.name}>
                  {c.name} ({c.count})
                </li>
              ))}
            </ul>
            <h3>Discard Pile</h3>
            <ul>
              {groupedDiscard.map((c) => (
                <li key={c.name}>
                  {c.name} ({c.count}) • {c.type}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {previewCard &&
        createPortal(
          <div
            className="card-preview-overlay encounter-preview-overlay"
            aria-hidden="true"
          >
            <div className="card-preview-frame encounter-preview-frame">
              <img
                src={previewCard.imageUrl}
                alt={previewCard.name}
                className="card-preview-image encounter-preview-image"
                draggable={false}
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
