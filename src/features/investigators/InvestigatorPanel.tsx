// Updated InvestigatorPanel with dropdown actions and collapsible adjustments
import { useState } from "react";
import FactionIcon from "../../components/FactionIcon";
import { getFactionClassName } from "../../lib/ui";
import { useGameStore } from "../../store/gameStore";
import { getSlotCapacity, getUsedSlots } from "../playerCards/slots";
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

type ActionOption = "" | "resource" | "draw" | "investigate" | "fight" | "evade";
type AdjustmentOption = "" | "spendResource" | "gainClue" | "takeDamage" | "takeHorror";

export default function InvestigatorPanel() {
  const [selectedAction, setSelectedAction] = useState<ActionOption>("");
  const [selectedAdjustment, setSelectedAdjustment] = useState<AdjustmentOption>("");
  const [adjustmentsOpen, setAdjustmentsOpen] = useState(false);

  const investigator = useGameStore((state) => state.investigator);
  const enemies = useGameStore((state) => state.enemies);
  const turn = useGameStore((state) => state.turn);

  const takeResourceAction = useGameStore((state) => state.takeResourceAction);
  const takeDrawAction = useGameStore((state) => state.takeDrawAction);
  const investigateAction = useGameStore((state) => state.investigateAction);
  const fightAction = useGameStore((state) => state.fightAction);
  const evadeAction = useGameStore((state) => state.evadeAction);

  const spendResource = useGameStore((state) => state.spendResource);
  const gainClue = useGameStore((state) => state.gainClue);
  const takeDamage = useGameStore((state) => state.takeDamage);
  const takeHorror = useGameStore((state) => state.takeHorror);

  const canTakeAction = turn.phase === "investigation" && turn.actionsRemaining > 0;

  const engagedEnemies = enemies.filter(
    (enemy) => enemy.engagedInvestigatorId === investigator.id,
  );

  const activeEnemy = engagedEnemies[0];

  const fightLabel = activeEnemy ? `Fight ${activeEnemy.name}` : "Fight";
  const evadeLabel = activeEnemy ? `Evade ${activeEnemy.name}` : "Evade";

  function handleActionExecute() {
    switch (selectedAction) {
      case "resource": takeResourceAction(); break;
      case "draw": takeDrawAction(); break;
      case "investigate": investigateAction(); break;
      case "fight": fightAction(); break;
      case "evade": evadeAction(); break;
    }
    setSelectedAction("");
  }

  function handleAdjustmentExecute() {
    switch (selectedAdjustment) {
      case "spendResource": spendResource(1); break;
      case "gainClue": gainClue(1); break;
      case "takeDamage": takeDamage(1); break;
      case "takeHorror": takeHorror(1); break;
    }
    setSelectedAdjustment("");
  }

  return (
    <section className="game-panel investigator-panel">

      <div className="button-row">
        <select
          className="investigator-action-select"
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value as ActionOption)}
          disabled={!canTakeAction}
        >
          <option value="">Select Action</option>
          <option value="resource">Resource</option>
          <option value="draw">Draw</option>
          <option value="investigate">Investigate</option>
          <option value="fight">{fightLabel}</option>
          <option value="evade">{evadeLabel}</option>
        </select>

        <button
          className="investigator-action-go"
          onClick={handleActionExecute}
          disabled={!selectedAction || !canTakeAction}
        >
          Go
        </button>
      </div>

      <hr />

      <section className="investigator-collapsible">
        <button
          className="investigator-collapsible__toggle"
          onClick={() => setAdjustmentsOpen(!adjustmentsOpen)}
        >
          Manual Adjustments {adjustmentsOpen ? "▾" : "▸"}
        </button>

        {adjustmentsOpen && (
          <div className="investigator-collapsible__content">
            <div className="button-row">
              <select
                className="investigator-action-select"
                value={selectedAdjustment}
                onChange={(e) => setSelectedAdjustment(e.target.value as AdjustmentOption)}
              >
                <option value="">Adjust Stats</option>
                <option value="spendResource">-1 Resource</option>
                <option value="gainClue">+1 Clue</option>
                <option value="takeDamage">+1 Damage</option>
                <option value="takeHorror">+1 Horror</option>
              </select>

              <button
                className="investigator-action-go"
                onClick={handleAdjustmentExecute}
                disabled={!selectedAdjustment}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </section>

    </section>
  );
}
