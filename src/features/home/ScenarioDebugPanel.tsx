import type { ScenarioDefinition } from "../../data/scenarios/scenarioTypes";
import { useGameStore } from "../../store/gameStore";

type Props = {
    scenario: ScenarioDefinition;
};

export default function ScenarioDebugPanel({ scenario }: Props) {
    const setupNotes = scenario.setupNotes;
    const randomizedSelections = scenario.randomizedSelections ?? [];
    const debugMode = useGameStore((state) => state.debugMode);
    const setDebugMode = useGameStore((state) => state.setDebugMode);

    return (
        <section className="panel scenario-debug-panel">
            <div className="scenario-debug-panel__header">
                <p className="eyebrow">
                    Debug&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <label>
                        <input
                            type="checkbox"
                            checked={debugMode}
                            onChange={(event) => setDebugMode(event.target.checked)}
                        />
                        Debug Mode
                    </label>
                </p>
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
