import { useMemo } from "react";
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

    return Array.from(map.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
    );
}

export default function EncounterInspector() {
    const encounterDeck = useGameStore((s) => s.encounterDeck);
    const encounterDiscard = useGameStore((s) => s.encounterDiscard);
    const toggle = useGameStore((s) => s.toggleEncounterInspector);
    const show = useGameStore((s) => s.showEncounterInspector);

    const groupedDeck = useMemo(() => groupCards(encounterDeck), [encounterDeck]);
    const groupedDiscard = useMemo(
        () => groupCards(encounterDiscard),
        [encounterDiscard],
    );

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
                    <button onClick={toggle}>Close</button>
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
        </div>
    );
}
