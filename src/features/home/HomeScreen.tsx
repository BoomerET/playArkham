import { useGameStore } from "../../store/gameStore";
import { getFactionClassName } from "../../lib/ui";

function formatFaction(faction: string): string {
  return faction.charAt(0).toUpperCase() + faction.slice(1);
}

function getFactionIcon(faction: string): string {
  switch (faction) {
    case "guardian":
      return "🛡️";
    case "seeker":
      return "📚";
    case "mystic":
      return "🔮";
    case "rogue":
      return "🗡️";
    case "survivor":
      return "🔥";
    default:
      return "•";
  }
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
                    {/* Faction + Name */}
                    <div className="investigator-title-row">
                      <span className="investigator-name">
                        {investigator.name}:
                      </span>

                      <span
                        className={`faction-label ${getFactionClassName(
                          investigator.faction,
                        )}`}
                      >
                        <span className="faction-icon">
                          {getFactionIcon(investigator.faction)}
                        </span>
                        {formatFaction(investigator.faction)}
                      </span>
                    </div>

                    {/* Stats (separate line) */}
                    <div className="investigator-stats">
                      WIL {investigator.willpower} · INT{" "}
                      {investigator.intellect} · COM {investigator.combat} · AGI{" "}
                      {investigator.agility}
                    </div>

                    {/* Health/Sanity */}
                    <div className="investigator-health">
                      Health {investigator.health} · Sanity{" "}
                      {investigator.sanity}
                    </div>
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
