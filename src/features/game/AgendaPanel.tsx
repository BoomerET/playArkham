import { useMemo } from "react";
import { useGameStore } from "../../store/gameStore";

function getThreatText(
  thresholdLabel: string,
  progress: number,
  threshold: number,
): string {
  const remaining = Math.max(threshold - progress, 0);
  const normalizedLabel = thresholdLabel.toLowerCase();

  if (normalizedLabel === "doom") {
    if (remaining === 0) {
      return "The agenda is ready to advance.";
    }

    return `${remaining} more doom will advance the agenda.`;
  }

  if (remaining === 0) {
    return "The agenda is ready to advance.";
  }

  return `The agenda advances at ${threshold} ${thresholdLabel.toLowerCase()} (${remaining} remaining).`;
}

export default function AgendaPanel() {
  const agenda = useGameStore((state) => state.agenda);
  const selectedScenarioId = useGameStore((state) => state.selectedScenarioId);
  const availableScenarios = useGameStore((state) => state.availableScenarios);

  const nextAdvanceHint = useMemo(() => {
    if (!agenda) {
      return null;
    }

    const scenario = availableScenarios.find(
      (entry) => entry.id === selectedScenarioId,
    );

    const agendas = scenario?.agendas ?? [];
    const currentIndex = agendas.findIndex((entry) => entry.id === agenda.id);

    if (currentIndex === -1) {
      return null;
    }

    const nextAgenda = agendas[currentIndex + 1];

    if (!nextAgenda?.onAdvance) {
      return null;
    }

    if (nextAgenda.onAdvance.loseScenario) {
      return {
        kind: "lose" as const,
        text: "Next advance will lose the scenario.",
      };
    }

    if (nextAgenda.onAdvance.winScenario) {
      return {
        kind: "win" as const,
        text: "Next advance will win the scenario.",
      };
    }

    return null;
  }, [agenda, availableScenarios, selectedScenarioId]);

  if (!agenda) {
    return (
      <section className="scenario-card-panel scenario-card-panel-agenda">
        <div className="scenario-card-header">
          <p className="scenario-card-kicker">Scenario</p>
          <h3 className="scenario-card-title">Agenda</h3>
        </div>

        <div className="scenario-card-body">
          <div className="scenario-card-face">
            <p className="scenario-card-text">
              No agenda is active for this scenario.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const progressText = `${agenda.thresholdLabel} ${agenda.progress} / ${agenda.threshold}`;
  const threatText = getThreatText(
    agenda.thresholdLabel,
    agenda.progress,
    agenda.threshold,
  );

  return (
    <section className="scenario-card-panel scenario-card-panel-agenda">
      <div className="scenario-card-header">
        <p className="scenario-card-kicker">Scenario</p>
        <h3 className="scenario-card-title">Agenda</h3>
      </div>

      <div className="scenario-card-body">
        <div className="scenario-card-face">
          <div className="scenario-card-face-header">
            <span className="scenario-card-badge">{agenda.sequence}</span>
            <span className="scenario-card-doom">{progressText}</span>
          </div>

          <h4 className="scenario-card-name">{agenda.title}</h4>

          <p className="scenario-card-text">{agenda.text}</p>

          <div className="scenario-card-objective">
            <div className="scenario-card-objective-label">Current Threat</div>
            <div className="scenario-card-objective-text">{threatText}</div>
          </div>

          {nextAdvanceHint ? (
            <div
              className={`scenario-card-hint scenario-card-hint-${nextAdvanceHint.kind}`}
            >
              {nextAdvanceHint.text}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
