import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "../../store/gameStore";
import ScenarioDebugPanel from "./ScenarioDebugPanel";
import type { Investigator } from "../../types/game";
import { buildDeckCardsFromSlots } from "../../lib/loadArkhamDeck";
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

type ArkhamDeckSummary = {
  investigator_code?: string;
  investigator_name?: string;
  name?: string;
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

  const [importedDeckSummary, setImportedDeckSummary] = useState<{
    deckName: string | null;
    investigatorName: string | null;
    investigatorCode: string | null;
    cardCount: number;
    unsupportedCodes: string[];
    randomWeaknesses: string[];
  } | null>(null);

  const availableScenarios = useGameStore((state) => state.availableScenarios);
  const selectedScenarioId = useGameStore((state) => state.selectedScenarioId);
  const setSelectedScenario = useGameStore(
    (state) => state.setSelectedScenario,
  );

  const selectedScenario = availableScenarios.find(
    (scenario) => scenario.id === selectedScenarioId,
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

  const zoomHeld = useModifierKey("Shift");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewSide, setPreviewSide] = useState<"front" | "back">("front");

  const trimmedDeckId = selectedDeckId.trim();

  const campaignState = useGameStore((state) => state.campaignState);
  const setPreviousScenarioOutcome = useGameStore(
    (state) => state.setPreviousScenarioOutcome,
  );
  const setCampaignRandomizedSelection = useGameStore(
    (state) => state.setCampaignRandomizedSelection,
  );

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

  const importedArkhamBuildDeckJson = useGameStore(
    (state) => state.importedArkhamBuildDeckJson,
  );

  const setImportedArkhamBuildDeckJson = useGameStore(
    (state) => state.setImportedArkhamBuildDeckJson,
  );

  useEffect(() => {
    if (!trimmedDeckId) {
      setDeckLookupState("idle");
      setDeckLookupMessage("Enter an ArkhamDB deck ID to begin.");
      setDetectedDeckName(null);
      return;
    }

    let cancelled = false;

    const loadDeckSummary = async () => {
      setDeckLookupState("loading");
      setDeckLookupMessage("Looking up ArkhamDB deck...");
      setDetectedDeckName(null);

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

        const investigatorCode = data.investigator_code?.trim() ?? "";
        const deckName = data.name?.trim() ?? null;

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
  }, [availableInvestigators, setSelectedInvestigator, trimmedDeckId]);

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
    (
      (trimmedDeckId.length > 0 && deckLookupState === "ready") ||
      importedArkhamBuildDeckJson != null
    );

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
            <label htmlFor="arkhamdb-deck-id" className="home-screen__label">
              ArkhamDB Deck ID
            </label>

            <input
              id="arkhamdb-deck-id"
              type="text"
              className="home-screen__input"
              value={selectedDeckId}

              onChange={(event) => {
                setImportedArkhamBuildDeckJson(null);
                setImportedDeckSummary(null);
                setSelectedDeckId(event.target.value);
                setSelectedInvestigator("");
              }}

              placeholder="Required, e.g. 5841936"
              autoComplete="off"
              inputMode="numeric"
            />

            <p className="home-screen__help">
              This app requires an ArkhamDB deck. Investigator selection is
              automatically derived from the selected deck.
            </p>
            <label>
              Import Arkham.build JSON
              <input
                type="file"
                accept="application/json,.json"
                onChange={async (event) => {
                  const file = event.target.files?.[0];

                  if (!file) {
                    return;
                  }

                  const text = await file.text();
                  const parsed = JSON.parse(text);

                  const slots = (parsed.slots ?? {}) as Record<string, number>;
                  const buildResult = buildDeckCardsFromSlots(slots);

                  const cardCount = Object.values(slots).reduce<number>(
                    (total, count) => total + Number(count ?? 0),
                    0,
                  );

                  setImportedDeckSummary({
                    deckName: parsed.name?.trim() ?? null,
                    investigatorName: parsed.investigator_name?.trim() ?? null,
                    investigatorCode: parsed.investigator_code?.trim() ?? null,
                    cardCount,
                    unsupportedCodes: buildResult.unsupportedCodes,
                    randomWeaknesses: buildResult.randomWeaknesses,
                  });

                  setImportedArkhamBuildDeckJson(parsed);
                  setSelectedDeckId("");
                  setSelectedInvestigator("");

                  const investigatorCode = parsed.investigator_code?.trim() ?? "";
                  const matchingInvestigator = availableInvestigators.find((item) => {
                    const itemWithOptionalCode = item as typeof item & { code?: string };

                    return itemWithOptionalCode.code === investigatorCode;
                  });

                  if (matchingInvestigator) {
                    setSelectedInvestigator(matchingInvestigator.id);
                    setDetectedDeckName(parsed.name?.trim() ?? null);
                    setDeckLookupState("ready");
                    setDeckLookupMessage(
                      parsed.name
                        ? `Using Arkham.build deck "${parsed.name}" with investigator ${matchingInvestigator.name}.`
                        : `Using Arkham.build import with investigator ${matchingInvestigator.name}.`,
                    );
                  } else {
                    setDeckLookupState("error");
                    setSelectedInvestigator("");
                    setDeckLookupMessage(
                      investigatorCode
                        ? `Arkham.build investigator code "${investigatorCode}" is not supported by this app yet.`
                        : "The imported Arkham.build deck did not include an investigator code.",
                    );
                  }

                }}
              />
            </label>
            {importedDeckSummary ? (
              <div className="home-screen__deck-meta">
                <div>
                  Imported Arkham.build deck:{" "}
                  <strong>{importedDeckSummary.deckName ?? "Unnamed Deck"}</strong>
                </div>
                <div>
                  Investigator:{" "}
                  <strong>
                    {importedDeckSummary.investigatorName ??
                      importedDeckSummary.investigatorCode ??
                      "Unknown"}
                  </strong>
                </div>
                <div>Cards listed: {importedDeckSummary.cardCount}</div>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setImportedArkhamBuildDeckJson(null);
                    setImportedDeckSummary(null);
                    setDetectedDeckName(null);
                    setDeckLookupState("idle");
                    setDeckLookupMessage("Enter an ArkhamDB deck ID to begin.");
                    setSelectedInvestigator("");
                  }}
                >
                  Clear Imported Deck
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
              {importedDeckSummary && (
                importedDeckSummary.unsupportedCodes.length > 0 ? (
                  <div className="home-screen__deck-warning">
                    Unsupported card code(s):{" "}
                    <strong>{importedDeckSummary.unsupportedCodes.join(", ")}</strong>
                    {importedDeckSummary.randomWeaknesses.length > 0 ? (
                      <div className="home-screen__deck-meta">
                        Random weakness assigned:{" "}
                        <strong>{importedDeckSummary.randomWeaknesses.join(", ")}</strong>
                      </div>
                    ) : null}

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() =>
                        void copyTextToClipboard(
                          importedDeckSummary.unsupportedCodes.join(", "),
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
