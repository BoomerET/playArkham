import GameLog from "../../components/GameLog";
import { useGameStore } from "../../store/gameStore";
import ChaosBagPanel from "../chaosBag/ChaosBagPanel";
import EnemyPanel from "../enemies/EnemyPanel";
import TurnPanel from "./TurnPanel";
import SkillTestPanel from "./SkillTestPanel";
import InvestigatorPanel from "../investigators/InvestigatorPanel";
import LocationRow from "../locations/LocationRow";
import DeckPanel from "../playerCards/DeckPanel";
import DiscardPanel from "../playerCards/DiscardPanel";
import HandPanel from "../playerCards/HandPanel";
import PlayAreaPanel from "../playerCards/PlayAreaPanel";
import ActiveSkillTestPanel from "./ActiveSkillTestPanel";

export default function GameTable() {
  const returnToHome = useGameStore((state) => state.returnToHome);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Arkham Horror: The Card Game</p>
          <h1 className="hero-title small">Play Arkham</h1>
        </div>

        <button className="secondary-button" onClick={returnToHome}>
          Back to Home
        </button>
      </header>

      <TurnPanel />
      <InvestigatorPanel />
      <ActiveSkillTestPanel />

      <div className="dashboard-grid">
        <DeckPanel />
        <DiscardPanel />
        <ChaosBagPanel />
        <SkillTestPanel />
      </div>

      <PlayAreaPanel />
      <EnemyPanel />
      <HandPanel />
      <LocationRow />
      <GameLog />
    </main>
  );
}

