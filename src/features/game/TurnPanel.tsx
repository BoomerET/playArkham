import { useMemo, useState } from "react";
import { useGameStore } from "../../store/gameStore";
import "./game.css";

function prettyPhase(phase: string): string {
  return phase.charAt(0).toUpperCase() + phase.slice(1);
}

export default function TurnPanel() {
  const turn = useGameStore((state) => state.turn);
  const locations = useGameStore((state) => state.locations);
  const agenda = useGameStore((state) => state.agenda);
  const act = useGameStore((state) => state.act);

  const [showLocationsMenu, setShowLocationsMenu] = useState(false);
  const [showScenarioMenu, setShowScenarioMenu] = useState(false);

  const advancePhase = useGameStore((state) => state.advancePhase);
  const setLocationVisible = useGameStore((state) => state.setLocationVisible);
  const revealLocation = useGameStore((state) => state.revealLocation);
  const setAgendaProgress = useGameStore((state) => state.setAgendaProgress);
  const setActProgress = useGameStore((state) => state.setActProgress);
  const advanceAgenda = useGameStore((state) => state.advanceAgenda);
  const advanceAct = useGameStore((state) => state.advanceAct);

  const hiddenLocations = useMemo(
    () => locations.filter((location) => !location.isVisible),
    [locations],
  );

  const visibleUnrevealedLocations = useMemo(
    () => locations.filter((location) => location.isVisible && !location.revealed),
    [locations],
  );

  return (
    <section className="game-panel">
      <h2>Turn</h2>

      <div className="stat-grid">
        <div className="stat-box">
          <span className="stat-label">Round: </span>
          <span className="stat-value">{turn.round}</span>
        </div>

        <div className="stat-box">
          <span className="stat-label">Phase: </span>
          <span className="stat-value">{prettyPhase(turn.phase)}</span>
        </div>

        <div className="stat-box">
          <span className="stat-label">Actions Remaining: </span>
          <span className="stat-value">
            {turn.phase === "investigation" ? turn.actionsRemaining : "N/A"}
          </span>
        </div>
      </div>

      <div className="button-row" style={{ marginTop: 14 }}>
        <button onClick={advancePhase}>
          {turn.phase === "upkeep" ? "Start Next Round" : "Advance Phase"}
        </button>
      </div>

      <hr />

      <section className="investigator-control-group">
        <button
          type="button"
          className="investigator-control-toggle"
          onClick={() => setShowScenarioMenu((current) => !current)}
        >
          Scenario Progress {showScenarioMenu ? "▴" : "▾"}
        </button>

        {showScenarioMenu && (
          <div className="investigator-admin-list">
            <div className="investigator-admin-row">
              <span>Agenda</span>
              <div className="button-row">
                <button onClick={() => setAgendaProgress((agenda?.progress ?? 0) + 1)}>
                  +1 Doom
                </button>
                <button onClick={advanceAgenda}>Advance Agenda</button>
              </div>
            </div>

            <div className="investigator-admin-row">
              <span>Act</span>
              <div className="button-row">
                <button onClick={() => setActProgress((act?.progress ?? 0) + 1)}>
                  +1 Clue
                </button>
                <button onClick={advanceAct}>Advance Act</button>
              </div>
            </div>
          </div>
        )}
      </section>

      <hr />

      <div>
        <h3 style={{ margin: "0 0 10px" }}>Scenario Controls</h3>

        {hiddenLocations.length === 0 && visibleUnrevealedLocations.length === 0 ? (
          <p className="panel-subtitle" style={{ margin: 0 }}>
            No hidden or unrevealed locations right now.
          </p>
        ) : (
          <section className="investigator-control-group">
            <button
              type="button"
              className="investigator-control-toggle"
              onClick={() => setShowLocationsMenu((current) => !current)}
            >
              Locations {showLocationsMenu ? "▴" : "▾"}
            </button>

            {showLocationsMenu && (
              <div className="investigator-admin-list">
                {locations.map((location) => (
                  <div key={location.id} className="investigator-admin-row">
                    <span>{location.name}</span>
                    <div className="button-row">
                      <button onClick={() => setLocationVisible(location.id, true)}>
                        Show
                      </button>
                      <button onClick={() => revealLocation(location.id)}>
                        Reveal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </section>
  );
}
