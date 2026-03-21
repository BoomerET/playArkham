import { useGameStore } from "../../store/gameStore";

export default function EnemyPanel() {
  const enemies = useGameStore((state) => state.enemies);

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
                  <span>Damage/Horror: {enemy.damage}/{enemy.horror}</span>
                  <span>Location: {enemy.locationId}</span>
                  <span>Engaged: {enemy.engagedInvestigatorId ?? "No"}</span>
                  <span>Exhausted: {enemy.exhausted ? "Yes" : "No"}</span>
                  <span>
                    Damage on Enemy: {enemy.damageOnEnemy}/{enemy.health}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

