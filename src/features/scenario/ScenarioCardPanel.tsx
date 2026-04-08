import { useMemo } from "react";
import { useGameStore } from "../../store/gameStore";
import type { ScenarioCardState } from "../../types/game";

type Props = {
    kind: "agenda" | "act";
    card: ScenarioCardState | null;
};

function getProgressLabel(card: ScenarioCardState) {
    return `${card.thresholdLabel} ${card.progress} / ${card.threshold}`;
}

export default function ScenarioCardPanel({ kind, card }: Props) {
    const advanceAgenda = useGameStore((state) => state.advanceAgenda);
    const advanceAct = useGameStore((state) => state.advanceAct);

    const canAdvance = useMemo(() => {
        if (!card) {
            return false;
        }

        return card.progress >= card.threshold;
    }, [card]);

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

    return (
        <section className={`scenario-card-panel scenario-card-panel-${kind}`}>
            <div className="scenario-card-panel__header">
                <p className="scenario-card-panel__kicker">
                    {kind === "agenda" ? "Agenda" : "Act"}
                </p>
                <span className="scenario-card-panel__sequence">{card.sequence}</span>
            </div>

            <h3 className="scenario-card-panel__title">{card.title}</h3>

            <div className="scenario-card-panel__text">
                {card.text}
            </div>

            <div className="scenario-card-panel__footer">
                <span className="scenario-card-panel__progress">
                    {getProgressLabel(card)}
                </span>

                {kind === "agenda" && canAdvance ? (
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={advanceAgenda}
                    >
                        Advance
                    </button>
                ) : null}

                {kind === "act" && canAdvance ? (
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={advanceAct}
                    >
                        Advance
                    </button>
                ) : null}
            </div>
        </section>
    );
}
