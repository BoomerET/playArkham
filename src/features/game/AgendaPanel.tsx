import { useGameStore } from "../../store/gameStore";

export default function AgendaPanel() {
  const agenda = useGameStore((state) => state.agenda);

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
        </div>
      </div>
    </section>
  );
}
