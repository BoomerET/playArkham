import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "../../store/gameStore";

const investigatorImages = import.meta.glob(
  "../../assets/images/investigators/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

function getInvestigatorImageUrl(imageName?: string): string | null {
  if (!imageName) {
    return null;
  }

  const match = Object.entries(investigatorImages).find(([path]) =>
    path.endsWith(`/${imageName}`),
  );

  return match?.[1] ?? null;
}

function useModifierKey(key: "Alt" | "Shift") {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        setActive(true);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === key) {
        setActive(false);
      }
    };

    const onWindowBlur = () => {
      setActive(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onWindowBlur);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, [key]);

  return active;
}

type PreviewInvestigator = {
  id: string;
  name: string;
  imageUrl: string;
};

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

  const zoomHeld = useModifierKey("Shift");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const previewInvestigator = useMemo<PreviewInvestigator | null>(() => {
    if (!zoomHeld || !hoveredId) {
      return null;
    }

    const investigator = availableInvestigators.find(
      (item) => item.id === hoveredId,
    );

    if (!investigator) {
      return null;
    }

    const imageUrl = getInvestigatorImageUrl(investigator.portrait);

    if (!imageUrl) {
      return null;
    }

    return {
      id: investigator.id,
      name: investigator.name,
      imageUrl,
    };
  }, [availableInvestigators, hoveredId, zoomHeld]);

  useEffect(() => {
    if (!zoomHeld) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHoveredId(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomHeld]);

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
        <div
          className={`investigator-zoom-hint ${
            hoveredId ? "visible" : ""
          } ${zoomHeld ? "active" : ""}`}
        >
          Hold <kbd>Shift</kbd> to zoom
        </div>
        <div className="investigator-grid">
          {availableInvestigators.map((investigator) => {
            const imageUrl = getInvestigatorImageUrl(investigator.portrait);
            const selected = investigator.id === selectedInvestigatorId;

            return (
              <button
                key={investigator.id}
                type="button"
                className={`investigator-card ${selected ? "selected" : ""}`}
                onClick={() => setSelectedInvestigator(investigator.id)}
                onMouseEnter={() => setHoveredId(investigator.id)}
                onMouseLeave={() =>
                  setHoveredId((current) =>
                    current === investigator.id ? null : current,
                  )
                }
                aria-pressed={selected}
                aria-label={`Select investigator ${investigator.name}`}
              >
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={investigator.name}
                      className="investigator-card-image"
                      draggable={false}
                    />
                    <div className="investigator-card-overlay">
                      <div className="investigator-name">
                        {investigator.name}
                      </div>
                      <div className="investigator-stats">
                        <span>Will {investigator.willpower}</span>
                        <span>Int {investigator.intellect}</span>
                        <span>Com {investigator.combat}</span>
                        <span>Agi {investigator.agility}</span>
                      </div>
                    </div>
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
                  type="button"
                  className={`scenario-card ${selected ? "selected" : ""}`}
                  onClick={() => setSelectedScenario(scenario.id)}
                  aria-pressed={selected}
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
          <button type="button" className="primary-button" onClick={startGame}>
            Start Game
          </button>
        </div>
      </section>

      {previewInvestigator && (
        <div
          className="investigator-preview-overlay"
          aria-hidden="true"
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="investigator-preview-frame">
            <img
              src={previewInvestigator.imageUrl}
              alt={previewInvestigator.name}
              className="investigator-preview-image"
              draggable={false}
            />
          </div>
        </div>
      )}
    </main>
  );
}
