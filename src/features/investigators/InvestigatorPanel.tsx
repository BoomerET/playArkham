import FactionIcon from "../../components/FactionIcon";
import { getFactionClassName } from "../../lib/ui";
import { useGameStore } from "../../store/gameStore";
import "./investigatorPanel.css";

function formatFaction(faction: string): string {
  return faction.charAt(0).toUpperCase() + faction.slice(1);
}

function splitInvestigatorName(
  name: string,
): { firstLine: string; secondLine: string | null } {
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

  const factionClass = getFactionClassName(investigator.faction);
  const { firstLine, secondLine } = splitInvestigatorName(investigator.name);

  return (
    <section className={`game-panel investigator-panel ${factionClass}`}>
      <div className="investigator-header">
        <div className="investigator-portrait-column">
          <div
            className={`portrait-frame investigator-portrait-frame ${factionClass}`}
          >
            <img
              src={investigator.portrait}
              alt={investigator.name}
              className="portrait-image"
            />
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
