import { useGameStore } from "../../store/gameStore";

function formatName(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function EnemyPanel() {
  const enemies = useGameStore((state) => state.enemies);
  const availableInvestigators = useGameStore(
    (state) => state.availableInvestigators,
  );

  function getInvestigatorDisplayName(id: string | null): string {
    if (!id) return "None";

    return (
      availableInvestigators.find((investigator) => investigator.id === id)?.name ??
      formatName(id)
    );
  }

  return (
    <section className="game-panel enemy-panel">
      <div className="enemy-panel-header">
        <div>
          <h2 className="enemy-panel-title">
            Enemies <span className="enemy-panel-count">({enemies.length})</span>
          </h2>
          <p className="panel-subtitle">
            Enemies in play across all locations.
          </p>
        </div>
      </div>

      {enemies.length === 0 ? (
        <div className="enemy-panel-empty">
          <p className="panel-subtitle">No enemies in play.</p>
        </div>
      ) : (
        <div className="enemy-card-grid">
          {enemies.map((enemy) => {
            const engaged = enemy.engagedInvestigatorId !== null;

            return (
              <div
                key={enemy.id}
                className={`entity-card enemy-card ${engaged ? "enemy-engaged" : ""
                  } ${enemy.exhausted ? "enemy-exhausted" : ""}`}
              >
                <div className="enemy-card-header">
                  <p className="entity-title enemy-card-title">
                    {enemy.name}
                  </p>

                  <span className="enemy-health-chip">
                    {enemy.damageOnEnemy}/{enemy.health}
                  </span>
                </div>

                <div className="enemy-stats-row">
                  <span className="token-chip gold">Fight {enemy.fight}</span>
                  <span className="token-chip gold">Evade {enemy.evade}</span>
                  <span className="token-chip gold">Damage {enemy.damage}</span>
                  <span className="token-chip gold">Horror {enemy.horror}</span>
                </div>

                <div className="enemy-card-body">
                  <div className="enemy-card-section">
                    <p className="enemy-section-label">Location</p>
                    <p className="entity-meta">
                      {formatName(enemy.locationId)}
                    </p>
                  </div>

                  <div className="enemy-card-section">
                    <p className="enemy-section-label">Engagement</p>
                    <p className="entity-meta">
                      {getInvestigatorDisplayName(
                        enemy.engagedInvestigatorId,
                      )}
                    </p>
                  </div>
                </div>

                <div className="enemy-card-tags">
                  {engaged && (
                    <span className="token-chip danger">Engaged</span>
                  )}
                  {enemy.exhausted && (
                    <span className="token-chip">Exhausted</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

