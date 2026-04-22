import type { ScenarioDefinition } from "../../data/scenarios/scenarioTypes";
import { useGameStore } from "../../store/gameStore";
import "./scenarioDebugPanel.css";

type Props = {
    scenario: ScenarioDefinition;
};

type DebugPreset = "none" | "threatAreaDiscard" | "enemyFollowAndFight";

export default function ScenarioDebugPanel({ scenario }: Props) {
    const setupNotes = scenario.setupNotes;
    const randomizedSelections = scenario.randomizedSelections ?? [];
    const debugMode = useGameStore((state) => state.debugMode);
    const debugPreset = useGameStore((state) => state.debugPreset);
    const setDebugMode = useGameStore((state) => state.setDebugMode);
    const setDebugPreset = useGameStore((state) => state.setDebugPreset);

    return (
        <section className="panel scenario-debug-panel">
            <div className="scenario-debug-panel__header">
                <p className="eyebrow">
                    Debug
                </p>
                <div className="scenario-debug-toolbar">
                    <label className="scenario-debug-control">
                        <span className="scenario-debug-control-label">Debug Preset</span>
                        <select
                            className="scenario-debug-select"
                            value={debugMode ? debugPreset : "none"}
                            onChange={(event) => {
                                const value = event.target.value as DebugPreset;

                                if (value === "none") {
                                    setDebugMode(false);
                                    setDebugPreset("none");
                                } else {
                                    setDebugMode(true);
                                    setDebugPreset(value);
                                }
                            }}
                        >
                            <option value="none">None</option>
                            <option value="threatAreaDiscard">Threat Area Discard</option>
                            <option value="enemyFollowAndFight">Enemy Follow and Fight</option>
                        </select>
                    </label>
                </div>
                <h2 className="section-title">Scenario Setup</h2>
            </div>

            <div className="scenario-debug-panel__section">
                <div className="scenario-debug-panel__row">
                    <span className="scenario-debug-panel__label">Scenario ID</span>
                    <span className="scenario-debug-panel__value">{scenario.id}</span>
                </div>

                <div className="scenario-debug-panel__row">
                    <span className="scenario-debug-panel__label">Scenario Name</span>
                    <span className="scenario-debug-panel__value">{scenario.name}</span>
                </div>

                {setupNotes?.previousScenarioOutcome ? (
                    <div className="scenario-debug-panel__row">
                        <span className="scenario-debug-panel__label">Previous Outcome</span>
                        <span className="scenario-debug-panel__value">
                            {setupNotes.previousScenarioOutcome}
                        </span>
                    </div>
                ) : null}
            </div>

            {setupNotes?.notes?.length ? (
                <div className="scenario-debug-panel__section">
                    <h3 className="scenario-debug-panel__subheading">Setup Notes</h3>
                    <ul className="scenario-debug-panel__list">
                        {setupNotes.notes.map((note, index) => (
                            <li key={`${scenario.id}-note-${index}`}>{note}</li>
                        ))}
                    </ul>
                </div>
            ) : null}

            <div className="scenario-debug-panel__section">
                <h3 className="scenario-debug-panel__subheading">
                    Randomized Selections
                </h3>

                {randomizedSelections.length === 0 ? (
                    <p className="scenario-debug-panel__empty">
                        No randomized selections recorded.
                    </p>
                ) : (
                    <ul className="scenario-debug-panel__list">
                        {randomizedSelections.map((selection) => (
                            <li key={`${scenario.id}-${selection.slotId}`}>
                                <strong>{selection.slotId}</strong>: {selection.chosenOptionId}
                                <div className="scenario-debug-panel__meta">
                                    Options: {selection.optionIds.join(", ")}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
