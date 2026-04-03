import { useEffect, useState } from "react";
import { useGameStore } from "../../store/gameStore";

type ArkhamDeckSummary = {
  investigator_code?: string;
  investigator_name?: string;
  name?: string;
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

  const selectedDeckId = useGameStore((state) => state.selectedDeckId);
  const setSelectedDeckId = useGameStore((state) => state.setSelectedDeckId);
  const startGame = useGameStore((state) => state.startGame);

  const [deckLookupState, setDeckLookupState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [deckLookupMessage, setDeckLookupMessage] = useState(
    "Enter an ArkhamDB deck ID to begin.",
  );
  const [detectedDeckName, setDetectedDeckName] = useState<string | null>(null);
  const [detectedInvestigatorName, setDetectedInvestigatorName] = useState<
    string | null
  >(null);

  const trimmedDeckId = selectedDeckId.trim();

  useEffect(() => {
    if (!trimmedDeckId) {
      setDeckLookupState("idle");
      setDeckLookupMessage("Enter an ArkhamDB deck ID to begin.");
      setDetectedDeckName(null);
      setDetectedInvestigatorName(null);
      return;
    }

    let cancelled = false;

    const loadDeckSummary = async () => {
      setDeckLookupState("loading");
      setDeckLookupMessage("Looking up ArkhamDB deck...");
      setDetectedDeckName(null);
      setDetectedInvestigatorName(null);

      try {
        const response = await fetch(
          `https://arkhamdb.com/api/public/deck/${trimmedDeckId}.json`,
        );

        if (!response.ok) {
          throw new Error(`Could not load ArkhamDB deck ${trimmedDeckId}.`);
        }

        const data = (await response.json()) as ArkhamDeckSummary;

        if (cancelled) {
          return;
        }

        const investigatorName = data.investigator_name?.trim() ?? "";
        const investigatorCode = data.investigator_code?.trim() ?? "";
        const deckName = data.name?.trim() ?? null;

        setDetectedDeckName(deckName);
        setDetectedInvestigatorName(investigatorName || null);

        const matchingInvestigator = availableInvestigators.find((item) => {
          const itemWithOptionalCode = item as typeof item & {
            code?: string;
          };

          const codeMatches =
            Boolean(investigatorCode) &&
            typeof itemWithOptionalCode.code === "string" &&
            itemWithOptionalCode.code === investigatorCode;

          const nameMatches =
            Boolean(investigatorName) && item.name === investigatorName;

          return codeMatches || nameMatches;
        });

        if (!matchingInvestigator) {
          setDeckLookupState("error");
          setDeckLookupMessage(
            investigatorName
              ? `Deck investigator "${investigatorName}" is not supported by this app yet.`
              : "This deck's investigator could not be identified.",
          );
          return;
        }

        setSelectedInvestigator(matchingInvestigator.id);
        setDeckLookupState("ready");
        setDeckLookupMessage(
          deckName
            ? `Using deck "${deckName}" with investigator ${matchingInvestigator.name}.`
            : `Using ArkhamDB deck with investigator ${matchingInvestigator.name}.`,
        );
      } catch (error) {
        console.error(error);

        if (cancelled) {
          return;
        }

        setDeckLookupState("error");
        setDeckLookupMessage(
          `Could not load ArkhamDB deck ${trimmedDeckId}.`,
        );
      }
    };

    void loadDeckSummary();

    return () => {
      cancelled = true;
    };
  }, [availableInvestigators, setSelectedInvestigator, trimmedDeckId]);

  const selectedInvestigator = availableInvestigators.find(
    (item) => item.id === selectedInvestigatorId,
  );

  const canStartGame =
    trimmedDeckId.length > 0 &&
    deckLookupState === "ready" &&
    Boolean(selectedInvestigator);

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Arkham Horror: The Card Game</p>
        <h1 className="hero-title">Play Arkham</h1>
        <p className="hero-subtitle">
          Enter an ArkhamDB deck ID, choose a scenario, and enter the mythos.
        </p>
      </section>

      <section className="panel">
        <div className="scenario-section">
          <h2 className="section-title">Deck</h2>

          <div className="home-screen__field">
            <label htmlFor="arkhamdb-deck-id" className="home-screen__label">
              ArkhamDB Deck ID
            </label>

            <input
              id="arkhamdb-deck-id"
              type="text"
              className="home-screen__input"
              value={selectedDeckId}
              onChange={(event) => setSelectedDeckId(event.target.value)}
              placeholder="Required, e.g. 5841936"
              autoComplete="off"
              inputMode="numeric"
            />

            <p className="home-screen__help">
              This app requires an ArkhamDB deck. Investigator selection is
              automatically derived from the selected deck.
            </p>

            <div
              className={`home-screen__deck-status home-screen__deck-status--${deckLookupState}`}
            >
              <div>{deckLookupMessage}</div>

              {detectedDeckName && (
                <div className="home-screen__deck-meta">
                  Deck: <strong>{detectedDeckName}</strong>
                </div>
              )}

              {detectedInvestigatorName && (
                <div className="home-screen__deck-meta">
                  Investigator: <strong>{detectedInvestigatorName}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="home-screen__deck-investigator-lock">
          <h2 className="section-title">Investigator</h2>
          <p>
            {selectedInvestigator
              ? `Detected investigator: ${selectedInvestigator.name}.`
              : "Investigator will be determined from the ArkhamDB deck."}
          </p>
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
          <button
            type="button"
            className="primary-button"
            onClick={() => void startGame()}
            disabled={!canStartGame}
          >
            {deckLookupState === "loading" ? "Loading Deck..." : "Start Game"}
          </button>
        </div>
      </section>
    </main>
  );
}
