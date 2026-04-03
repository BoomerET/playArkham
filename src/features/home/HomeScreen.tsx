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

  const normalized = imageName.toLowerCase();

  const match = Object.entries(investigatorImages).find(([path]) =>
    path.toLowerCase().endsWith(`/${normalized}`),
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
  frontImageUrl: string;
  backImageUrl: string | null;
};

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

  const zoomHeld = useModifierKey("Shift");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewSide, setPreviewSide] = useState<"front" | "back">("front");

  const [deckLookupState, setDeckLookupState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [deckLookupMessage, setDeckLookupMessage] = useState("");
  const [detectedDeckName, setDetectedDeckName] = useState<string | null>(null);
  const [detectedInvestigatorName, setDetectedInvestigatorName] = useState<
    string | null
  >(null);

  const trimmedDeckId = selectedDeckId.trim();
  const hasSelectedDeck = trimmedDeckId.length > 0;

  useEffect(() => {
    if (!hasSelectedDeck) {
      setDeckLookupState("idle");
      setDeckLookupMessage("");
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
              ? `Loaded deck investigator "${investigatorName}", but no matching local investigator was found.`
              : "Deck loaded, but its investigator could not be identified.",
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
        setDeckLookupMessage(`Could not load ArkhamDB deck ${trimmedDeckId}.`);
      }
    };

    void loadDeckSummary();

    return () => {
      cancelled = true;
    };
  }, [
    availableInvestigators,
    hasSelectedDeck,
    setSelectedInvestigator,
    trimmedDeckId,
  ]);

  const previewInvestigator = useMemo<PreviewInvestigator | null>(() => {
    if (!zoomHeld || !hoveredId || hasSelectedDeck) {
      return null;
    }

    const investigator = availableInvestigators.find(
      (item) => item.id === hoveredId,
    );

    if (!investigator) {
      return null;
    }

    const frontImageUrl = getInvestigatorImageUrl(investigator.portrait);
    const backImageUrl = getInvestigatorImageUrl(investigator.portraitBack);

    if (!frontImageUrl) {
      return null;
    }

    return {
      id: investigator.id,
      name: investigator.name,
      frontImageUrl,
      backImageUrl,
    };
  }, [availableInvestigators, hasSelectedDeck, hoveredId, zoomHeld]);

  useEffect(() => {
    if (!previewInvestigator) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHoveredId(null);
        return;
      }

      if (
        (event.key === "f" || event.key === "F") &&
        previewInvestigator.backImageUrl
      ) {
        setPreviewSide((current) => (current === "front" ? "back" : "front"));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewInvestigator]);

  const previewImageUrl =
    previewSide === "back" && previewInvestigator?.backImageUrl
      ? previewInvestigator.backImageUrl
      : (previewInvestigator?.frontImageUrl ?? null);

  const selectedInvestigator = availableInvestigators.find(
    (item) => item.id === selectedInvestigatorId,
  );

  const canStartGame =
    !hasSelectedDeck ||
    (deckLookupState === "ready" && Boolean(selectedInvestigator));

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Arkham Horror: The Card Game</p>
        <h1 className="hero-title">Play Arkham</h1>
        <p className="hero-subtitle">
          Choose your scenario and enter the mythos.
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
              placeholder="Optional, e.g. 5841936"
              autoComplete="off"
              inputMode="numeric"
            />
            <p className="home-screen__help">
              Leave blank to choose an investigator manually and use the local
              deck. Enter a deck ID to load an ArkhamDB deck and automatically
              select its investigator.
            </p>

            {hasSelectedDeck && (
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
            )}
          </div>
        </div>

        {!hasSelectedDeck ? (
          <>
            <h2 className="section-title">Select Investigator</h2>

            <div
              className={`investigator-zoom-hint ${hoveredId ? "visible" : ""} ${
                zoomHeld ? "active" : ""
              }`}
            >
              Hold <kbd>Shift</kbd> to zoom • Press <kbd>F</kbd> to flip
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
                    onMouseEnter={() => {
                      setHoveredId(investigator.id);
                      setPreviewSide("front");
                    }}
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
          </>
        ) : (
          <div className="home-screen__deck-investigator-lock">
            <h2 className="section-title">Investigator</h2>
            <p>
              Investigator selection is locked to the chosen deck.
              {selectedInvestigator
                ? ` Current investigator: ${selectedInvestigator.name}.`
                : ""}
            </p>
          </div>
        )}

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

      {previewInvestigator && previewImageUrl && (
        <div
          className="investigator-preview-overlay"
          aria-hidden="true"
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="investigator-preview-frame">
            {previewInvestigator.backImageUrl && (
              <button
                type="button"
                className="investigator-preview-flip-button"
                onClick={() =>
                  setPreviewSide((current) =>
                    current === "front" ? "back" : "front",
                  )
                }
              >
                {previewSide === "front" ? "Show Back" : "Show Front"}
              </button>
            )}

            <img
              src={previewImageUrl}
              alt={`${previewInvestigator.name} ${previewSide}`}
              className="investigator-preview-image"
              draggable={false}
            />
          </div>
        </div>
      )}
    </main>
  );
}
