import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "../../store/gameStore";
import ScenarioDebugPanel from "./ScenarioDebugPanel";
import type { Investigator, LoadedDeck, ChaosToken } from "../../types/game";
import {
  getDeckSourceFromInput,
  loadArkhamBuildDeckFromShareCode,
  loadArkhamDeck,
} from "../../lib/loadArkhamDeck";
import "./homeScreen.css";


const investigatorImages = import.meta.glob(
  "../../assets/images/investigators/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

function findInvestigatorImageByBaseName(baseName?: string): string | null {
  if (!baseName) {
    return null;
  }

  const normalized = baseName.toLowerCase();

  const match = Object.entries(investigatorImages).find(([path]) => {
    const fileName = path.split("/").pop()?.toLowerCase() ?? "";
    const withoutExtension = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, "");
    return withoutExtension === normalized;
  });

  return match?.[1] ?? null;
}

function getInvestigatorFrontImageUrl(
  investigator: Investigator,
): string | null {
  const investigatorWithCode = investigator as typeof investigator & {
    code?: string;
  };

  return (
    findInvestigatorImageByBaseName(investigatorWithCode.code) ||
    findInvestigatorImageByBaseName(investigator.portrait)
  );
}

function getInvestigatorBackImageUrl(
  investigator: Investigator,
): string | null {
  const investigatorWithCode = investigator as Investigator & {
    code?: string;
  };

  return (
    findInvestigatorImageByBaseName(
      investigatorWithCode.code
        ? `${investigatorWithCode.code}_back`
        : undefined,
    ) ||
    findInvestigatorImageByBaseName(
      investigatorWithCode.code
        ? `${investigatorWithCode.code}-back`
        : undefined,
    ) ||
    findInvestigatorImageByBaseName(investigator.portraitBack)
  );
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

type DeckSummary = {
  sourceLabel: string;
  deckName: string | null;
  investigatorName: string | null;
  investigatorCode: string | null;
  cardCount: number;
  unsupportedCodes: string[];
  randomWeaknesses: string[];
  validationWarnings: string[];
  validationErrors: string[];
};

type PreviewInvestigator = {
  id: string;
  name: string;
  frontImageUrl: string;
  backImageUrl: string | null;
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

  const [deckSummary, setDeckSummary] = useState<DeckSummary | null>(null);

  const availableScenarios = useGameStore((state) => state.availableScenarios);
  const selectedScenarioId = useGameStore((state) => state.selectedScenarioId);
  const setSelectedScenario = useGameStore(
    (state) => state.setSelectedScenario,
  );

  const selectedScenario = availableScenarios.find(
    (scenario) => scenario.id === selectedScenarioId,
  );

  const selectedDeckCode = useGameStore((state) => state.selectedDeckCode);
  const setSelectedDeckCode = useGameStore((state) => state.setSelectedDeckCode);
  const startGame = useGameStore((state) => state.startGame);

  const [deckLookupState, setDeckLookupState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [deckLookupMessage, setDeckLookupMessage] = useState(
    "Enter an ArkhamDB deck ID to begin.",
  );
  const [detectedDeckName, setDetectedDeckName] = useState<string | null>(null);

  const zoomHeld = useModifierKey("Shift");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewSide, setPreviewSide] = useState<"front" | "back">("front");

  const trimmedDeckCode = selectedDeckCode.trim();

  const campaignState = useGameStore((state) => state.campaignState);
  const setPreviousScenarioOutcome = useGameStore(
    (state) => state.setPreviousScenarioOutcome,
  );
  const setCampaignRandomizedSelection = useGameStore(
    (state) => state.setCampaignRandomizedSelection,
  );

  const selectedChaosBag = useGameStore((state) => state.selectedChaosBag);
  const setSelectedChaosBag = useGameStore((state) => state.setSelectedChaosBag);
  const resetSelectedChaosBag = useGameStore((state) => state.resetSelectedChaosBag);

  const chaosTokenOptions: ChaosToken[] = [
    2,
    1,
    0,
    -1,
    -2,
    -3,
    -4,
    -5,
    -6,
    -7,
    -8,
    "skull",
    "cultist",
    "tablet",
    "elderThing",
    "autoFail",
    "elderSign",
  ];

  const visibleScenarios = useMemo(() => {
    const seenCampaignKeys = new Set<string>();

    return availableScenarios.filter((scenario) => {
      if (!scenario.campaignKey) {
        return true;
      }

      if (seenCampaignKeys.has(scenario.campaignKey)) {
        return false;
      }

      seenCampaignKeys.add(scenario.campaignKey);
      return true;
    });
  }, [availableScenarios]);

  const randomizeCampaignSelectionsForScenario = useGameStore(
    (state) => state.randomizeCampaignSelectionsForScenario,
  );

  function formatChaosToken(token: ChaosToken): string {
    if (token === "autoFail") return "Auto-Fail";
    if (token === "elderSign") return "Elder Sign";
    if (typeof token === "number") return token >= 0 ? `+${token}` : `${token}`;
    return token;
  }

  useEffect(() => {
    if (!trimmedDeckCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDeckLookupState("idle");
      setDeckLookupMessage("Enter an ArkhamDB deck ID or Arkham.build share code to begin.");
      setDetectedDeckName(null);
      setDeckSummary(null);
      return;
    }

    let cancelled = false;

    const loadDeckSummary = async () => {
      const deckSource = getDeckSourceFromInput(trimmedDeckCode);

      if (!deckSource) {
        setDeckLookupState("idle");
        setDeckLookupMessage("Enter an ArkhamDB deck ID or Arkham.build share code to begin.");
        setDetectedDeckName(null);
        setDeckSummary(null);
        return;
      }

      setDeckLookupState("loading");
      setDeckLookupMessage(
        deckSource === "arkhamDb"
          ? "Looking up ArkhamDB deck..."
          : "Looking up Arkham.build deck...",
      );
      setDetectedDeckName(null);
      setDeckSummary(null);

      try {
        const loadedDeck: LoadedDeck =
          deckSource === "arkhamDb"
            ? await loadArkhamDeck(trimmedDeckCode)
            : await loadArkhamBuildDeckFromShareCode(trimmedDeckCode);

        if (cancelled) {
          return;
        }

        const investigatorCode = loadedDeck.investigatorCode ?? "";
        const deckName = loadedDeck.deckName;

        setDetectedDeckName(deckName);

        const matchingInvestigator = availableInvestigators.find((item) => {
          const itemWithOptionalCode = item as typeof item & {
            code?: string;
          };

          return (
            Boolean(investigatorCode) &&
            typeof itemWithOptionalCode.code === "string" &&
            itemWithOptionalCode.code === investigatorCode
          );
        });

        if (!matchingInvestigator) {
          setDeckLookupState("error");
          setDeckLookupMessage(
            investigatorCode
              ? `Deck investigator code "${investigatorCode}" is not supported by this app yet.`
              : "This deck's investigator could not be identified.",
          );
          setDeckSummary(null);
          return;
        }

        setSelectedInvestigator(matchingInvestigator.id);

        setDeckSummary({
          sourceLabel: deckSource === "arkhamDb" ? "ArkhamDB" : "Arkham.build",
          deckName,
          investigatorName: loadedDeck.investigatorName,
          investigatorCode: loadedDeck.investigatorCode,
          cardCount: loadedDeck.cards.length,
          unsupportedCodes: loadedDeck.unsupportedCodes,
          randomWeaknesses: loadedDeck.randomWeaknesses,
          validationWarnings: loadedDeck.validationWarnings,
          validationErrors: loadedDeck.validationErrors,
        });

        setDeckLookupState("ready");
        setDeckLookupMessage(
          deckName
            ? `Using ${deckSource === "arkhamDb" ? "ArkhamDB" : "Arkham.build"} deck "${deckName}" with investigator ${matchingInvestigator.name}.`
            : `Using ${deckSource === "arkhamDb" ? "ArkhamDB" : "Arkham.build"} deck with investigator ${matchingInvestigator.name}.`,
        );
      } catch (error) {
        console.error(error);

        if (cancelled) {
          return;
        }

        const deckSource = getDeckSourceFromInput(trimmedDeckCode);

        setDeckLookupState("error");
        setDeckLookupMessage(
          deckSource === "arkhamBuild"
            ? `Could not load Arkham.build deck ${trimmedDeckCode}.`
            : `Could not load ArkhamDB deck ${trimmedDeckCode}.`,
        );
        setDeckSummary(null);
      }
    };

    void loadDeckSummary();

    return () => {
      cancelled = true;
    };
  }, [availableInvestigators, setSelectedInvestigator, trimmedDeckCode]);

  const selectedInvestigator = availableInvestigators.find(
    (item) => item.id === selectedInvestigatorId,
  ) ?? null;

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

    const frontImageUrl = getInvestigatorFrontImageUrl(investigator);
    const backImageUrl = getInvestigatorBackImageUrl(investigator);

    if (!frontImageUrl) {
      return null;
    }

    return {
      id: investigator.id,
      name: investigator.name,
      frontImageUrl,
      backImageUrl,
    };
  }, [availableInvestigators, hoveredId, zoomHeld]);

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

  const canStartGame =
    Boolean(selectedInvestigator) &&
    trimmedDeckCode.length > 0 &&
    deckLookupState === "ready";

  const selectedInvestigatorImageUrl = selectedInvestigator
    ? getInvestigatorFrontImageUrl(selectedInvestigator)
    : null;

  async function copyTextToClipboard(text: string) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    document.execCommand("copy");
    document.body.removeChild(textArea);
  }

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
            <label htmlFor="deck-code" className="home-screen__label">
              Deck Code
            </label>

            <input
              id="deck-code"
              type="text"
              className="home-screen__input"
              value={selectedDeckCode}
              onChange={(event) => {
                setSelectedDeckCode(event.target.value);
                setSelectedInvestigator("");
              }}
              placeholder="ArkhamDB ID, e.g. 5971619, or Arkham.build code, e.g. Sts69Sv8V8mIkZv"
              autoComplete="off"
            />
            {deckSummary ? (
              <div className="home-screen__deck-meta">
                <div>
                  {deckSummary.sourceLabel} deck: {" "}
                  <strong>{deckSummary.deckName ?? "Unnamed Deck"}</strong>
                </div>
                <div>
                  Investigator:{" "}
                  <strong>
                    {deckSummary.investigatorName ??
                      deckSummary.investigatorCode ??
                      "Unknown"}
                  </strong>
                </div>
                <div>Cards listed: {deckSummary.cardCount}</div>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setSelectedDeckCode("");
                    setDeckSummary(null);
                    setDetectedDeckName(null);
                    setDeckLookupState("idle");
                    setDeckLookupMessage("Enter an ArkhamDB deck ID or Arkham.build share code to begin.");
                    setSelectedInvestigator("");
                  }}
                >
                  Clear Deck
                </button>
              </div>
            ) : null}
            <div
              className={`home-screen__deck-status home-screen__deck-status--${deckLookupState}`}
            >
              <div>{deckLookupMessage}</div>

              {detectedDeckName && (
                <div className="home-screen__deck-meta">
                  Deck: <strong>{detectedDeckName}</strong>
                </div>
              )}

              {deckSummary && (
                deckSummary.unsupportedCodes.length > 0 ? (
                  <div className="home-screen__deck-warning">
                    Unsupported card code(s):{" "}
                    <strong>{deckSummary.unsupportedCodes.join(", ")}</strong>
                    {deckSummary.randomWeaknesses.length > 0 ? (
                      <div className="home-screen__deck-meta">
                        Random weakness assigned:{" "}
                        <strong>{deckSummary.randomWeaknesses.join(", ")}</strong>
                      </div>
                    ) : null}

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() =>
                        void copyTextToClipboard(
                          deckSummary.unsupportedCodes.join(", "),
                        )
                      }
                    >
                      Copy Codes
                    </button>
                  </div>
                ) : (
                  <div className="home-screen__deck-meta">
                    All imported card codes are supported.
                  </div>
                )
              )}


              {selectedInvestigator && (
                <div className="home-screen__deck-meta">
                  Investigator: <strong>{selectedInvestigator.name}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="home-screen__deck-investigator-lock">
          <h2 className="section-title">Investigator</h2>

          <div
            className={`investigator-zoom-hint ${hoveredId ? "visible" : ""} ${zoomHeld ? "active" : ""
              }`}
          >
            Hold <kbd>Shift</kbd> to zoom • Press <kbd>F</kbd> to flip
          </div>

          {selectedInvestigator ? (
            <div className="investigator-grid">
              <button
                type="button"
                className="investigator-card selected"
                aria-label={`Detected investigator ${selectedInvestigator.name}`}
                onMouseEnter={() => {
                  setHoveredId(selectedInvestigator.id);
                  setPreviewSide("front");
                }}
                onMouseLeave={() =>
                  setHoveredId((current) =>
                    current === selectedInvestigator.id ? null : current,
                  )
                }
              >
                {selectedInvestigatorImageUrl ? (
                  <>
                    <img
                      src={selectedInvestigatorImageUrl}
                      alt={selectedInvestigator.name}
                      className="investigator-card-image"
                      draggable={false}
                    />
                    <div className="investigator-card-overlay">
                      <div className="investigator-name">
                        {selectedInvestigator.name}
                      </div>
                      <div className="investigator-stats">
                        <span>Will {selectedInvestigator.willpower}</span>
                        <span>Int {selectedInvestigator.intellect}</span>
                        <span>Com {selectedInvestigator.combat}</span>
                        <span>Agi {selectedInvestigator.agility}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="investigator-fallback">
                    {selectedInvestigator.name}
                  </div>
                )}
              </button>
            </div>
          ) : (
            <p>Investigator will be determined from the ArkhamDB deck.</p>
          )}
        </div>

        <div className="scenario-section">
          <h2 className="section-title">Select Scenario</h2>

          <div className="scenario-grid">
            {visibleScenarios.map((scenario) => {
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
        {selectedScenario?.campaignKey && selectedScenario.randomizedSelections?.length ? (
          <div className="home-screen__field-group">
            <label className="home-screen__label" htmlFor="campaign-outcome">
              Previous Scenario Outcome
            </label>
            <select
              id="campaign-outcome"
              className="home-screen__input"
              value={campaignState.previousScenarioOutcome ?? ""}
              onChange={(event) =>
                setPreviousScenarioOutcome(event.target.value || null)
              }
            >
              <option value="">None</option>
              <option value="quiet">Quiet</option>
              <option value="flames">Flames</option>
            </select>
            <div className="home-screen__field-group-header">
              <h3 className="section-title">Randomized Selections</h3>

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  randomizeCampaignSelectionsForScenario(selectedScenario.id)
                }
              >
                Randomize Locations
              </button>
            </div>

            {selectedScenario.randomizedSelections.map((selection) => {
              const storedValue =
                campaignState.randomizedSelectionsByCampaignKey[
                selectedScenario.campaignKey!
                ]?.[selection.slotId] ?? selection.chosenOptionId;

              return (
                <div
                  key={`${selectedScenario.id}-${selection.slotId}`}
                  className="home-screen__field"
                >
                  <label
                    className="home-screen__label"
                    htmlFor={`randomized-${selection.slotId}`}
                  >
                    {selection.slotId}
                  </label>

                  <select
                    id={`randomized-${selection.slotId}`}
                    className="home-screen__input"
                    value={storedValue}
                    onChange={(event) =>
                      setCampaignRandomizedSelection(
                        selectedScenario.campaignKey!,
                        selection.slotId,
                        event.target.value,
                      )
                    }
                  >
                    {selection.optionIds.map((optionId) => (
                      <option key={optionId} value={optionId}>
                        {optionId}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        ) : null}
        <section className="home-screen__field">
          <h2 className="section-title">Chaos Bag</h2>

          <div className="button-row">
            {chaosTokenOptions.map((token) => (
              <button
                key={String(token)}
                type="button"
                className="secondary-button"
                onClick={() => setSelectedChaosBag([...selectedChaosBag, token])}
              >
                Add {formatChaosToken(token)}
              </button>
            ))}
          </div>

          <div className="home-screen__deck-meta">
            Current bag:{" "}
            <strong>
              {selectedChaosBag.map(formatChaosToken).join(", ")}
            </strong>
          </div>

          <div className="button-row">
            {selectedChaosBag.map((token, index) => (
              <button
                key={`${String(token)}-${index}`}
                type="button"
                className="secondary-button"
                onClick={() =>
                  setSelectedChaosBag(
                    selectedChaosBag.filter((_, tokenIndex) => tokenIndex !== index),
                  )
                }
              >
                Remove {formatChaosToken(token)}
              </button>
            ))}

            <button
              type="button"
              className="secondary-button"
              onClick={resetSelectedChaosBag}
            >
              Reset Bag
            </button>
          </div>
        </section>
        {selectedScenario ? (
          <ScenarioDebugPanel scenario={selectedScenario} />
        ) : null}

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
