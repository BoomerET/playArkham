import { useMemo } from "react";
import { useGameStore } from "../../store/gameStore";

function getObjectiveText(
  thresholdLabel: string,
  progress: number,
  threshold: number,
): string {
  const remaining = Math.max(threshold - progress, 0);
  const normalizedLabel = thresholdLabel.toLowerCase();

  if (normalizedLabel === "clues") {
    if (remaining === 0) {
      return "Objective complete. Advance the Act.";
    }

    return `Discover ${remaining} more clue${remaining === 1 ? "" : "s"} to advance.`;
  }

  if (remaining === 0) {
    return `Objective complete. Advance the Act.`;
  }

  return `Reach ${threshold} ${thresholdLabel.toLowerCase()} to advance (${remaining} remaining).`;
}

export default function ActPanel() {
  const act = useGameStore((state) => state.act);
  const selectedScenarioId = useGameStore((state) => state.selectedScenarioId);
  const availableScenarios = useGameStore((state) => state.availableScenarios);

  const nextAdvanceHint = useMemo(() => {
    if (!act) {
      return null;
    }

    const scenario = availableScenarios.find(
      (entry) => entry.id === selectedScenarioId,
    );

    const acts = scenario?.acts ?? [];
    const currentIndex = acts.findIndex((entry) => entry.id === act.id);

    if (currentIndex === -1) {
      return null;
    }

    const nextAct = acts[currentIndex + 1];

    if (!nextAct?.onAdvance) {
      return null;
    }

    if (nextAct.onAdvance.winScenario) {
      return {
        kind: "win" as const,
        text: "Next advance will win the scenario.",
      };
    }

    if (nextAct.onAdvance.loseScenario) {
      return {
        kind: "lose" as const,
        text: "Next advance will lose the scenario.",
      };
    }

    return null;
  }, [act, availableScenarios, selectedScenarioId]);

  if (!act) {
    return (
      <section className="scenario-card-panel scenario-card-panel-act">
        <div className="scenario-card-header">
          <p className="scenario-card-kicker">Scenario</p>
          <h3 className="scenario-card-title">Act</h3>
        </div>

        <div className="scenario-card-body">
          <div className="scenario-card-face">
            <p className="scenario-card-text">
              No act is active for this scenario.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const progressText = `${act.thresholdLabel} ${act.progress} / ${act.threshold}`;
  const objectiveText = getObjectiveText(
    act.thresholdLabel,
    act.progress,
    act.threshold,
  );

  return (
    <section className="scenario-card-panel scenario-card-panel-act">
      <div className="scenario-card-header">
        <p className="scenario-card-kicker">Scenario</p>
        <h3 className="scenario-card-title">Act</h3>
      </div>

      <div className="scenario-card-body">
        <div className="scenario-card-face">
          <div className="scenario-card-face-header">
            <span className="scenario-card-badge">{act.sequence}</span>
            <span className="scenario-card-clue-goal">{progressText}</span>
          </div>

          <h4 className="scenario-card-name">{act.title}</h4>

          <p className="scenario-card-text">{act.text}</p>

          <div className="scenario-card-objective">
            <div className="scenario-card-objective-label">Current Objective</div>
            <div className="scenario-card-objective-text">{objectiveText}</div>
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
