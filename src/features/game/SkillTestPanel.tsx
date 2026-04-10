import { useGameStore } from "../../store/gameStore";

export default function SkillTestPanel() {
  const lastSkillTest = useGameStore((state) => state.lastSkillTest);

  return (
    <section className="game-panel">
      <h2>Last Skill Test</h2>

      {!lastSkillTest ? (
        <p className="panel-subtitle">No skill test has been resolved yet.</p>
      ) : (
        <div className="panel-grid">
          <div className="token-row">
            <span className="token-chip gold">{lastSkillTest.skill}</span>
            <span
              className={`token-chip ${lastSkillTest.success ? "success" : "danger"
                }`}
            >
              {lastSkillTest.success ? "Success" : "Failure"}
            </span>
          </div>

          <div className="entity-card">
            <p className="entity-meta">Source: {lastSkillTest.source}</p>
            <p className="entity-meta">Base Value: {lastSkillTest.baseValue}</p>
            <p className="entity-meta">Asset Modifier: {lastSkillTest.assetModifier}</p>
            <p className="entity-meta">Committed Modifier: {lastSkillTest.committedModifier}</p>
            <p className="entity-meta">
              Modifier Sources:{" "}
              {lastSkillTest.modifierDetails.length > 0
                ? lastSkillTest.modifierDetails
                  .map((modifier) => `${modifier.source} (+${modifier.amount})`)
                  .join(", ")
                : "None"}
            </p>
            <p className="entity-meta">Difficulty: {lastSkillTest.difficulty}</p>
            <p className="entity-meta">Token: {String(lastSkillTest.token)}</p>

            <p>
              Token:{" "}
              {lastSkillTest.token === "autoFail"
                ? "Auto-fail"
                : lastSkillTest.token}
            </p>

            <p>
              Modifier:{" "}
              {lastSkillTest.token === "autoFail"
                ? "—"
                : lastSkillTest.tokenModifier}
            </p>

            <p className="entity-meta">
              Final Value:{" "}
              {lastSkillTest.token === "autoFail"
                ? "Auto-fail"
                : lastSkillTest.finalValue}
            </p>
            <p
              className={
                lastSkillTest.success
                  ? "skill-result-success"
                  : "skill-result-failure"
              }
            >
              {lastSkillTest.success ? "Success" : "Failure"}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
