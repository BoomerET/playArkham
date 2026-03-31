import { useGameStore } from "../../store/gameStore";
import { useEffect, useState } from "react";

const investigatorImages = import.meta.glob(
  "../../assets/images/investigators/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

const zoomHeld = useModifierKey("Shift");
const [hoveredId, setHoveredId] = useState<string | null>(null);

function getInvestigatorImageUrl(imageName?: string): string | null {
  if (!imageName) {
    return null;
  }

  const match = Object.entries(investigatorImages).find(([path]) =>
    path.endsWith(`/${imageName}`),
  );

  return match?.[1] ?? null;
}

export function useModifierKey(key: "Alt" | "Shift") {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === key) setActive(true);
    };

    const up = (e: KeyboardEvent) => {
      if (e.key === key) setActive(false);
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [key]);

  return active;
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
            const selected = investigator.id === selectedInvestigatorId;

            return (
              <button
                key={investigator.id}
                type="button"
                
                <div
  className={cn(
    "investigator-card",
    hoveredId === investigator.id && "hovered",
    hoveredId === investigator.id && zoomHeld && "zoomed"
  )}
  onMouseEnter={() => setHoveredId(investigator.id)}
  onMouseLeave={() => setHoveredId(null)}
></div>
                {/*className={`investigator-card ${selected ? "selected" : ""}`} */}
                onClick={() => setSelectedInvestigator(investigator.id)}
              >
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={investigator.name}
                      className="investigator-card-image"
                    />

                  </>
                ) : (
                  <div className="investigator-fallback">
                    {investigator.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>

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
