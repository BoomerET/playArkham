import { useGameStore } from "../../store/gameStore";

export default function ActPanel() {
  const act = useGameStore((state) => state.act);

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
        </div>
      </div>
    </section>
  );
}
