import { useGameStore } from "../../store/gameStore";
import { getFactionClassName } from "../../lib/ui";

export default function InvestigatorPanel() {
  const investigator = useGameStore((state) => state.investigator);
  const turn = useGameStore((state) => state.turn);
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

  return (
    <section className={`game-panel investigator-panel ${getFactionClassName(investigator.faction)}`}>
      <div className="investigator-header">
        <div className="portrait-frame">
          <img
            src={investigator.portrait}
            alt={investigator.name}
            className="portrait-image"
          />
        </div>

        <div className="investigator-header-text">
          <h2>{investigator.name}</h2>
          <div className="token-row">
            <span className="faction-badge">{investigator.faction}</span>
            <span className="token-chip gold">WIL {investigator.willpower}</span>
            <span className="token-chip gold">INT {investigator.intellect}</span>
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
          Fight
        </button>
        <button onClick={evadeAction} disabled={!canTakeAction}>
          Evade
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

