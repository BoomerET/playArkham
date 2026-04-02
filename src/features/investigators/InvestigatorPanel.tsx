import FactionIcon from "../../components/FactionIcon";
import { getFactionClassName } from "../../lib/ui";
import { useGameStore } from "../../store/gameStore";
import "./investigatorPanel.css";

function formatFaction(faction: string): string {
  return faction.charAt(0).toUpperCase() + faction.slice(1);
}

function splitInvestigatorName(name: string): {
  firstLine: string;
  secondLine: string | null;
} {
  const parts = name.trim().split(/\s+/);

  if (parts.length <= 1) {
    return { firstLine: name, secondLine: null };
  }

  if (parts.length === 2) {
    return { firstLine: parts[0], secondLine: parts[1] };
  }

  const midpoint = Math.ceil(parts.length / 2);

  return {
    firstLine: parts.slice(0, midpoint).join(" "),
    secondLine: parts.slice(midpoint).join(" "),
  };
}

const investigatorImages = import.meta.glob(
  "../../assets/images/investigators/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

const investigatorHeadImages = import.meta.glob(
  "../../assets/images/investigatorHeads/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

function getInvestigatorHeadUrl(imageName?: string): string | null {
  if (!imageName) {
    return null;
  }

  const normalized = imageName.toLowerCase();

  const match = Object.entries(investigatorHeadImages).find(([path]) =>
    path.toLowerCase().endsWith(`/${normalized}`),
  );

  return match?.[1] ?? null;
}

function getInvestigatorImageUrl(imageName?: string): string | null {
  if (!imageName) {
    return null;
  }

  const normalized = imageName.toLowerCase();

  const match = Object.entries(investigatorImages).find(([path]) =>
    path.toLowerCase().endsWith(`/${normalized}`),
  );

  return match?.[1] ?? null;
}

export default function InvestigatorPanel() {
  const investigator = useGameStore((state) => state.investigator);
  const enemies = useGameStore((state) => state.enemies);
  const turn = useGameStore((state) => state.turn);
  const selectedEnemyTargetId = useGameStore(
    (state) => state.selectedEnemyTargetId,
  );
  const setSelectedEnemyTarget = useGameStore(
    (state) => state.setSelectedEnemyTarget,
  );

  const spendResource = useGameStore((state) => state.spendResource);
  const gainClue = useGameStore((state) => state.gainClue);
  const takeDamage = useGameStore((state) => state.takeDamage);
  const takeHorror = useGameStore((state) => state.takeHorror);

  const takeResourceAction = useGameStore((state) => state.takeResourceAction);
  const takeDrawAction = useGameStore((state) => state.takeDrawAction);
  const investigateAction = useGameStore((state) => state.investigateAction);
  const fightAction = useGameStore((state) => state.fightAction);
  const evadeAction = useGameStore((state) => state.evadeAction);

  const canTakeAction =
    turn.phase === "investigation" && turn.actionsRemaining > 0;

  const factionClass = getFactionClassName(investigator.faction);
  const { firstLine, secondLine } = splitInvestigatorName(investigator.name);
  const portraitUrl = getInvestigatorHeadUrl(
    (investigator as any).portraitHead ?? investigator.portrait,
  );

  const engagedEnemies = enemies.filter(
    (enemy) => enemy.engagedInvestigatorId === investigator.id,
  );

  const activeTargetId = engagedEnemies.some(
    (enemy) => enemy.id === selectedEnemyTargetId,
  )
    ? selectedEnemyTargetId
    : (engagedEnemies[0]?.id ?? null);

  const activeTargetEnemy =
    engagedEnemies.find((enemy) => enemy.id === activeTargetId) ?? null;

  const fightLabel = activeTargetEnemy
    ? `Fight ${activeTargetEnemy.name}`
    : "Fight";

  const evadeLabel = activeTargetEnemy
    ? `Evade ${activeTargetEnemy.name}`
    : "Evade";

  return (
    <section className={`game-panel investigator-panel ${factionClass}`}>
      <div className="investigator-header">
        <div className="investigator-portrait-column">
          <div
            className={`portrait-frame investigator-portrait-frame ${factionClass}`}
          >
            {portraitUrl ? (
              <img
                src={portraitUrl}
                alt={investigator.name}
                className="portrait-image"
                draggable={false}
              />
            ) : (
              <div className="investigator-portrait-fallback">
                {investigator.name}
              </div>
            )}
          </div>
        </div>

        <div className="investigator-header-text">
          <h2 className="investigator-name">
            <span className="investigator-name-line">{firstLine}</span>
            {secondLine && (
              <span className="investigator-name-line">{secondLine}</span>
            )}
          </h2>

          <div className="investigator-faction-row">
            <span className={`faction-label ${factionClass}`}>
              <FactionIcon
                faction={investigator.faction}
                className="faction-icon"
              />
              {formatFaction(investigator.faction)}
            </span>
          </div>

          <div className="investigator-skill-row">
            <span className="token-chip gold">
              WIL {investigator.willpower}
            </span>
            <span className="token-chip gold">
              INT {investigator.intellect}
            </span>
            <span className="token-chip gold">COM {investigator.combat}</span>
            <span className="token-chip gold">AGI {investigator.agility}</span>
          </div>
        </div>
      </div>

      <hr />

      <div className="stat-grid">
        <div className="stat-box">
          <span className="stat-label">Health: </span>
          <span className="stat-value">{investigator.health}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Sanity: </span>
          <span className="stat-value">{investigator.sanity}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Damage: </span>
          <span className="stat-value">{investigator.damage}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Horror: </span>
          <span className="stat-value">{investigator.horror}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Resources: </span>
          <span className="stat-value">{investigator.resources}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Clues: </span>
          <span className="stat-value">{investigator.clues}</span>
        </div>
      </div>

      {engagedEnemies.length > 0 && (
        <>
          <hr />

          <div className="engaged-enemies-section">
            <div className="engaged-enemies-header">Engaged Enemies</div>

            {engagedEnemies.length > 1 && activeTargetEnemy && (
              <p className="engaged-enemies-targeting-note">
                Click an enemy to choose the current target. Fight and Evade
                will target <strong>{activeTargetEnemy.name}</strong>.
              </p>
            )}

            <div className="engaged-enemies-list">
              {engagedEnemies.map((enemy) => {
                const remainingHealth = Math.max(
                  enemy.health - enemy.damageOnEnemy,
                  0,
                );
                const isSelectedTarget = enemy.id === activeTargetId;
                const isSelectable = engagedEnemies.length > 1;

                return (
                  <button
                    key={enemy.id}
                    type="button"
                    className={`engaged-enemy-card ${
                      isSelectedTarget ? "engaged-enemy-card-primary" : ""
                    } ${isSelectable ? "engaged-enemy-card-selectable" : ""}`}
                    onClick={() => setSelectedEnemyTarget(enemy.id)}
                    disabled={!isSelectable}
                    aria-pressed={isSelectedTarget}
                    title={
                      isSelectable
                        ? `Select ${enemy.name} as the current target`
                        : undefined
                    }
                  >
                    <div className="engaged-enemy-main">
                      <div className="engaged-enemy-name-row">
                        <div className="engaged-enemy-name-stack">
                          <span className="engaged-enemy-name">
                            {enemy.name}
                          </span>

                          <div className="engaged-enemy-badges">
                            {isSelectedTarget && (
                              <span className="engaged-enemy-tag engaged-enemy-tag-primary">
                                Current Target
                              </span>
                            )}

                            {enemy.exhausted && (
                              <span className="engaged-enemy-tag">
                                Exhausted
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="engaged-enemy-meta">
                        <span className="token-chip danger">
                          Damage {enemy.damageOnEnemy}/{enemy.health}
                        </span>
                        <span className="token-chip">
                          HP Left {remainingHealth}
                        </span>
                        <span className="token-chip">Fight {enemy.fight}</span>
                        <span className="token-chip">Evade {enemy.evade}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      <hr />

      <div className="button-row">
        <button onClick={takeResourceAction} disabled={!canTakeAction}>
          Resource
        </button>
        <button onClick={takeDrawAction} disabled={!canTakeAction}>
          Draw
        </button>
        <button onClick={investigateAction} disabled={!canTakeAction}>
          Investigate
        </button>
        <button onClick={fightAction} disabled={!canTakeAction}>
          {fightLabel}
        </button>
        <button onClick={evadeAction} disabled={!canTakeAction}>
          {evadeLabel}
        </button>
      </div>

      <hr />

      <div className="button-row">
        <button onClick={() => spendResource(1)}>-1 Resource</button>
        <button onClick={() => gainClue(1)}>+1 Clue</button>
        <button onClick={() => takeDamage(1)}>+1 Damage</button>
        <button onClick={() => takeHorror(1)}>+1 Horror</button>
      </div>
    </section>
  );
}
