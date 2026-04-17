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

const agenda = useGameStore((state) => state.agenda);
const act = useGameStore((state) => state.act);
const investigator = useGameStore((state) => state.investigator);
const advanceActByClues = useGameStore((state) => state.advanceActByClues);

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

    const actProgress = act?.progress ?? 0;
    const actThreshold = act?.threshold ?? 0;
    const agendaProgress = agenda?.progress ?? 0;
    const agendaThreshold = agenda?.threshold ?? 0;

    const actReady = Boolean(act && actProgress >= actThreshold);
    const agendaReady = Boolean(agenda && agendaProgress >= agendaThreshold);

    const cluesNeededForAct = act ? Math.max(0, act.threshold - act.progress) : 0;
    const canAdvanceActByClues =
        Boolean(act) &&
        cluesNeededForAct > 0 &&
        investigator.clues >= cluesNeededForAct;
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
        <section >
            {agenda && (
                <section className="scenario-card-panel scenario-card-panel--agenda">
                    <div className="scenario-card-panel__header">
                        <div>
                            <div className="scenario-card-panel__eyebrow">Agenda {agenda.sequence}</div>
                            <h3 className="scenario-card-panel__title">{agenda.title}</h3>
                        </div>

                        {agendaReady && (
                            <span className="scenario-card-panel__badge">
                                Ready to advance
                            </span>
                        )}
                    </div>

                    <div className="scenario-card-panel__progress">
                        <span className="scenario-card-panel__progress-label">
                            {agenda.thresholdLabel}
                        </span>
                        <span className="scenario-card-panel__progress-value">
                            {agenda.progress} / {agenda.threshold}
                        </span>
                    </div>

                    <div className="scenario-card-panel__text">
                        {(agenda.text ?? []).map((line, index) => (
                            <p key={`agenda-line-${index}`}>{line}</p>
                        ))}
                    </div>
                </section>
            )}
            {act && (
                <section className="scenario-card-panel scenario-card-panel--act">
                    <div className="scenario-card-panel__header">
                        <div>
                            <div className="scenario-card-panel__eyebrow">Act {act.sequence}</div>
                            <h3 className="scenario-card-panel__title">{act.title}</h3>
                        </div>

                        {actReady && (
                            <span className="scenario-card-panel__badge">
                                Ready to advance
                            </span>
                        )}
                    </div>

                    <div className="scenario-card-panel__progress">
                        <span className="scenario-card-panel__progress-label">
                            {act.thresholdLabel}
                        </span>
                        <span className="scenario-card-panel__progress-value">
                            {act.progress} / {act.threshold}
                        </span>
                    </div>

                    <div className="scenario-card-panel__text">
                        {(act.text ?? []).map((line, index) => (
                            <p key={`act-line-${index}`}>{line}</p>
                        ))}
                    </div>

                    {act.threshold > 0 && (
                        <div className="scenario-card-panel__actions">
                            <button
                                type="button"
                                onClick={advanceActByClues}
                                disabled={!canAdvanceActByClues}
                            >
                                {cluesNeededForAct > 0
                                    ? `Advance with ${cluesNeededForAct} clue${cluesNeededForAct === 1 ? "" : "s"}`
                                    : "Advance Act"}
                            </button>
                        </div>
                    )}
                </section>
            )}
        </section>
    );
}
