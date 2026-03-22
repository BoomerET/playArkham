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
            const factionClass = getFactionClassName(investigator.faction);

            return (
              <button
                key={investigator.id}
                className={`investigator-card ${factionClass} ${
                  selected ? "selected" : ""
                }`}
                onClick={() => setSelectedInvestigator(investigator.id)}
              >
                <div className="investigator-card-top">
                  <div className={`portrait-frame large ${factionClass}`}>
                    <img
                      src={investigator.portrait}
                      alt={investigator.name}
                      className="portrait-image"
                    />
                  </div>

                  <div className="investigator-card-body">
                    <div className="investigator-title-block">
                      <span className="investigator-name">
                        {investigator.name}
                      </span>

                      <span className={`faction-label ${factionClass}`}>
                        <FactionIcon
                          faction={investigator.faction}
                          className="faction-icon"
                        />
                        {formatFaction(investigator.faction)}
                      </span>
                    </div>

                    <div className="investigator-stats">
                      WIL {investigator.willpower} · INT{" "}
                      {investigator.intellect} · COM {investigator.combat} · AGI{" "}
                      {investigator.agility}
                    </div>

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
