import { useMemo, useState } from "react";
import { useGameStore } from "../../store/gameStore";
import "./scenarioCard.css";
import type { ScenarioCardState } from "../../types/game";

const scenarioCardImages = import.meta.glob(
    "../../assets/images/act_agenda/*.{png,jpg,jpeg,webp}",
    {
        eager: true,
        import: "default",
    },
) as Record<string, string>;

type Props = {
    kind: "agenda" | "act";
    card: ScenarioCardState | null;
};

function getProgressLabel(card: ScenarioCardState) {
    return `${card.thresholdLabel} ${card.progress} / ${card.threshold}`;
}

function getScenarioCardImage(
    card: ScenarioCardState | null,
    flipped = false,
): string | null {
    if (!card?.code) {
        return null;
    }

    const isBackFromSequence = card.sequence.endsWith("b");
    const showBack = flipped ? !isBackFromSequence : isBackFromSequence;
    const side = showBack ? "back" : "front";
    const fileName = `${card.code}_${side}`;

    const match = Object.entries(scenarioCardImages).find(([path]) =>
        path.includes(fileName),
    );

    return match?.[1] ?? null;
}

export default function ScenarioCardPanel({ kind, card }: Props) {
    const advanceAgenda = useGameStore((state) => state.advanceAgenda);
    const advanceAct = useGameStore((state) => state.advanceAct);
    const [flippedCardKey, setFlippedCardKey] = useState<string | null>(null);

    const cardKey = card ? `${card.id}-${card.sequence}` : null;
    const previewFlipped = cardKey !== null && flippedCardKey === cardKey;

    const canAdvance = useMemo(() => {
        if (!card) {
            return false;
        }

        return card.progress >= card.threshold;
    }, [card]);

    const imageUrl = useMemo(
        () => getScenarioCardImage(card, previewFlipped),
        [card, previewFlipped],
    );

    if (!card) {
        return (
            <section className="scenario-card-panel scenario-card-panel-empty">
                <p className="scenario-card-panel__kicker">
                    {kind === "agenda" ? "Agenda" : "Act"}
                </p>
                <p className="scenario-card-panel__empty">No card in play.</p>
            </section>
        );
    }

    const advanceActByClues = useGameStore((state) => state.advanceActByClues);

    return (
        <section className={`scenario-card-panel scenario-card-panel-${kind}`}>
            <div className="scenario-card-panel__header">
                <p className="scenario-card-panel__kicker">
                    {kind === "agenda" ? "Agenda" : "Act"}
                </p>
                <span className="scenario-card-panel__sequence">{card.sequence}</span>
            </div>

            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={`${card.title}${previewFlipped ? " (flipped preview)" : ""}`}
                    className="scenario-card-panel__image"
                    draggable={false}
                />
            ) : (
                <>
                    <h3 className="scenario-card-panel__title">{card.title}</h3>

                    <div className="scenario-card-panel__text">{card.text}</div>
                </>
            )}

            <div className="scenario-card-panel__footer">
                <span className="scenario-card-panel__progress">
                    {getProgressLabel(card)}
                </span>

                <div className="button-row">
                    {card.code ? (
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                setFlippedCardKey((current) =>
                                    current === cardKey ? null : cardKey,
                                )
                            }
                        >
                            {previewFlipped ? "Show Current Side" : "Flip"}
                        </button>
                    ) : null}

                    {canAdvance ? (
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={kind === "agenda" ? advanceAgenda : advanceAct}
                        >
                            Advance
                        </button>
                    ) : null}
                    {kind === "act" ? (
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={advanceActByClues}>
                            Advance Act with Clues
                        </button>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
