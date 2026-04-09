import { useGameStore } from "../../store/gameStore";
import "./encounterChoicePrompt.css";

export default function EncounterChoicePrompt() {
    const pendingChoice = useGameStore((state) => state.pendingChoice);
    const resolvePendingChoice = useGameStore(
        (state) => state.resolvePendingChoice,
    );

    if (!pendingChoice) {
        return null;
    }

    return (
        <div className="encounter-choice-prompt">
            <div className="encounter-choice-prompt__panel">
                <h3 className="encounter-choice-prompt__title">
                    {pendingChoice.sourceCard.name}
                </h3>

                <p className="encounter-choice-prompt__text">Choose one:</p>

                <div className="encounter-choice-prompt__options">
                    {pendingChoice.options.map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            className="encounter-choice-prompt__button"
                            onClick={() => resolvePendingChoice(option.id)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
