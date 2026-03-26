import FactionIcon from "../../components/FactionIcon";
import { getFactionClassName } from "../../lib/ui";
import { useGameStore } from "../../store/gameStore";

function formatFaction(faction: string): string {
  return faction.charAt(0).toUpperCase() + faction.slice(1);
}

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

  // ✅ NEW: scenario state
  const availableScenarios = useGameStore((state) => state.availableScenarios);
  const selectedScenarioId = useGameStore((state) => state.selectedScenarioId);
  const setSelectedScenario = useGameStore(
    (state) => state.setSelectedScenario,
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
            const imageUrl = getInvestigatorImageUrl(investigator.portrait);

            return (
              <div
                key={investigator.id}
                className="investigator-card"
                onClick={() => selectInvestigator(investigator.id)}
              >
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={investigator.name}
                      className="investigator-card-image"
                    />

                    <div className="investigator-card-overlay">
                      <h3 className="investigator-name">{investigator.name}</h3>

                      <div className="investigator-stats">
                        <span>🧠 {investigator.willpower}</span>
                        <span>📚 {investigator.intellect}</span>
                        <span>💪 {investigator.combat}</span>
                        <span>🏃 {investigator.agility}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  // fallback (your current card UI)
                  <div className="investigator-fallback">
                    {investigator.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ✅ NEW: Scenario Selection */}
        <div className="scenario-section">
          <h2 className="section-title">Select Scenario</h2>

          <div className="scenario-grid">
            {availableScenarios.map((scenario) => {
              const selected = scenario.id === selectedScenarioId;

              return (
                <button
                  key={scenario.id}
                  className={`scenario-card ${selected ? "selected" : ""}`}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <div className="scenario-card-body">
                    <span className="scenario-name">{scenario.name}</span>
                    <p className="scenario-description">
                      {scenario.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
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
