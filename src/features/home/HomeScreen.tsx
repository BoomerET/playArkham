import { useGameStore } from "../../store/gameStore";
import { getFactionClassName } from "../../lib/ui";

export default function HomeScreen() {
  const availableInvestigators = useGameStore(
    (state) => state.availableInvestigators,
  );
  const selectedInvestigatorId = useGameStore(
    (state) => state.selectedInvestigatorId,
  );
  const setSelectedInvestigator = useGameStore(
    (state) => state.setSelectedInvestigator,
  );
  const startGame = useGameStore((state) => state.startGame);

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Arkham Horror: The Card Game</p>
        <h1 className="hero-title">Play Arkham</h1>
        <p className="hero-subtitle">
          Choose your investigator and enter the mythos.
        </p>
      </section>

      <section className="panel">
        <h2 className="section-title">Select Investigator</h2>

        <div className="investigator-grid">
          {availableInvestigators.map((investigator) => {
            const selected = investigator.id === selectedInvestigatorId;

            return (
              <button
                key={investigator.id}
                className={`investigator-card ${getFactionClassName(
                  investigator.faction,
                )} ${selected ? "selected" : ""}`}
                onClick={() => setSelectedInvestigator(investigator.id)}
              >
                <div className="investigator-card-top">
                  <div className="portrait-frame large">
                    <img
                      src={investigator.portrait}
                      alt={investigator.name}
                      className="portrait-image"
                    />
                  </div>

                  <div className="investigator-card-body">
                    <span className="investigator-name">{investigator.name}</span>
                    <span className="faction-badge">
                      {investigator.faction}
                    </span>
                    <span className="investigator-stats">
                      WIL {investigator.willpower} · INT {investigator.intellect} · COM {investigator.combat} · AGI {investigator.agility}
                    </span>
                    <span className="investigator-health">
                      Health {investigator.health} · Sanity {investigator.sanity}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="home-actions">
          <button className="primary-button" onClick={startGame}>
            Start Game
          </button>
        </div>
      </section>
    </main>
  );
}

