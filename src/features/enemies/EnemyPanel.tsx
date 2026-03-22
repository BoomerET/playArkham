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
    if (!id) return "No";

    return (
      availableInvestigators.find((investigator) => investigator.id === id)?.name ??
      formatName(id)
    );
  }

  return (
    <section className="game-panel">
      <h2>Enemies</h2>

      {enemies.length === 0 ? (
        <p className="panel-subtitle">No enemies in play.</p>
      ) : (
        <div className="horizontal-card-grid">
          {enemies.map((enemy) => {
            const engaged = enemy.engagedInvestigatorId !== null;

            return (
              <div
                key={enemy.id}
                className={`entity-card enemy-card ${engaged ? "engaged" : ""} ${
                  enemy.exhausted ? "exhausted" : ""
                }`}
              >
                <p className="entity-title">{enemy.name}</p>

                <div className="token-row">
                  <span className="token-chip gold">Fight {enemy.fight}</span>
                  <span className="token-chip gold">Evade {enemy.evade}</span>
                  <span className="token-chip gold">Health {enemy.health}</span>
                </div>

                <div className="entity-meta" style={{ marginTop: 10 }}>
                  <div>
                    <strong>Damage/Horror:</strong> {enemy.damage}/{enemy.horror}
                  </div>

                  <div>
                    <strong>Location:</strong> {formatName(enemy.locationId)}
                  </div>

                  <div>
                    <strong>Engaged:</strong>{" "}
                    {getInvestigatorDisplayName(enemy.engagedInvestigatorId)}
                  </div>

                  <div>
                    <strong>Exhausted:</strong> {enemy.exhausted ? "Yes" : "No"}
                  </div>

                  <div>
                    <strong>Damage on Enemy:</strong> {enemy.damageOnEnemy}/{enemy.health}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
