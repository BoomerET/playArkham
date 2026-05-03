import { useGameStore } from "../../store/gameStore";
import "./scenarioIntroDialog.css";

export default function ScenarioIntroDialog() {
    const showScenarioIntro = useGameStore((state) => state.showScenarioIntro);
    const dismissScenarioIntro = useGameStore((state) => state.dismissScenarioIntro);
    const selectedScenarioId = useGameStore((state) => state.selectedScenarioId);
    const scenario = useGameStore((state) =>
        state.availableScenarios.find((entry) => entry.id === selectedScenarioId),
    );

    if (!showScenarioIntro || !scenario?.introText?.length) {
        return null;
    }

    return (
        <div className="scenario-intro-backdrop" role="dialog" aria-modal="true">
            <section className="scenario-intro-dialog">
                <p className="scenario-intro-kicker">Scenario Introduction</p>
                <h2 className="scenario-intro-title">{scenario.name}</h2>

                <div className="scenario-intro-text">
                    {scenario.introText.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>

                <button
                    type="button"
                    className="primary-button scenario-intro-button"
                    onClick={dismissScenarioIntro}
                >
                    Begin Scenario
                </button>
            </section>
        </div>
    );
}
