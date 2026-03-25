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
import "./gameTable.css";

export default function GameTable() {
  const returnToHome = useGameStore((state) => state.returnToHome);
  const selectedScenarioId = useGameStore((state) => state.selectedScenarioId);
  const availableScenarios = useGameStore((state) => state.availableScenarios);

  const selectedScenario =
    availableScenarios.find((scenario) => scenario.id === selectedScenarioId) ??
    null;

  return (
    <main className="game-table-shell">
      <header className="game-table-header">
        <div className="game-table-title-wrap">
          <p className="game-table-eyebrow">Arkham Horror: The Card Game</p>
          <h1 className="game-table-title">
            {selectedScenario?.name ?? "Play Arkham"}
          </h1>
          {selectedScenario?.description ? (
            <p className="game-table-subtitle">{selectedScenario.description}</p>
          ) : null}
        </div>

        <button className="secondary-button" onClick={returnToHome}>
          Back to Home
        </button>
      </header>

      <div className="game-table-layout">
        <aside className="game-table-sidebar game-table-sidebar-left">
          <section className="table-panel table-panel-compact">
            <TurnPanel />
          </section>

          <section className="table-panel">
            <InvestigatorPanel />
          </section>

          <section className="table-panel">
            <DeckPanel />
          </section>

          <section className="table-panel">
            <DiscardPanel />
          </section>
        </aside>

        <section className="game-table-center">
          <div className="game-table-board">
            <div className="game-table-board-inner">
              <section className="table-panel table-panel-board">
                <LocationRow />
              </section>

              <div className="game-table-board-lower">
                <section className="table-panel game-table-play-area">
                  <PlayAreaPanel />
                </section>

                <section className="table-panel game-table-enemies">
                  <EnemyPanel />
                </section>
              </div>
            </div>

            <div className="game-table-skill-overlay">
              <section className="table-panel table-panel-overlay">
                <ActiveSkillTestPanel />
              </section>
            </div>
          </div>

          <section className="table-panel game-table-hand-dock">
            <HandPanel />
          </section>
        </section>

        <aside className="game-table-sidebar game-table-sidebar-right">
          <section className="table-panel">
            <ChaosBagPanel />
          </section>

          <section className="table-panel">
            <SkillTestPanel />
          </section>

          <section className="table-panel game-table-log-panel">
            <GameLog />
          </section>
        </aside>
      </div>
    </main>
  );
}
import GameLog from "../../components/GameLog";
import { useGameStore } from "../../store/gameStore";
import ChaosBagPanel from "../chaosBag/ChaosBagPanel";
import EnemyPanel from "../enemies/EnemyPanel";
import InvestigatorPanel from "../investigators/InvestigatorPanel";
import LocationRow from "../locations/LocationRow";
import DeckPanel from "../playerCards/DeckPanel";
import DiscardPanel from "../playerCards/DiscardPanel";
import HandPanel from "../playerCards/HandPanel";
import PlayAreaPanel from "../playerCards/PlayAreaPanel";
import ActPanel from "./ActPanel";
import ActiveSkillTestPanel from "./ActiveSkillTestPanel";
import AgendaPanel from "./AgendaPanel";
import SkillTestPanel from "./SkillTestPanel";
import TurnPanel from "./TurnPanel";
import "./gameTable.css";

export default function GameTable() {
  const returnToHome = useGameStore((state) => state.returnToHome);
  const selectedScenarioId = useGameStore((state) => state.selectedScenarioId);
  const availableScenarios = useGameStore((state) => state.availableScenarios);

  const selectedScenario =
    availableScenarios.find((scenario) => scenario.id === selectedScenarioId) ??
    null;

  return (
    <main className="game-table-shell">
      <header className="game-table-header">
        <div className="game-table-title-wrap">
          <p className="game-table-eyebrow">Arkham Horror: The Card Game</p>
          <h1 className="game-table-title">
            {selectedScenario?.name ?? "Play Arkham"}
          </h1>
          {selectedScenario?.description ? (
            <p className="game-table-subtitle">{selectedScenario.description}</p>
          ) : null}
        </div>

        <button className="secondary-button" onClick={returnToHome}>
          Back to Home
        </button>
      </header>

      <div className="game-table-layout">
        <aside className="game-table-sidebar game-table-sidebar-left">
          <section className="table-panel table-panel-compact">
            <TurnPanel />
          </section>

          <section className="table-panel">
            <InvestigatorPanel />
          </section>

          <section className="table-panel">
            <DeckPanel />
          </section>

          <section className="table-panel">
            <DiscardPanel />
          </section>
        </aside>

        <section className="game-table-center">
          <div className="game-table-board">
            <div className="game-table-board-inner">
              <div className="game-table-scenario-rail">
                <section className="table-panel game-table-scenario-panel">
                  <AgendaPanel />
                </section>

                <section className="table-panel game-table-scenario-panel">
                  <ActPanel />
                </section>
              </div>

              <section className="table-panel table-panel-board">
                <LocationRow />
              </section>

              <div className="game-table-board-lower">
                <section className="table-panel game-table-play-area">
                  <PlayAreaPanel />
                </section>

                <section className="table-panel game-table-enemies">
                  <EnemyPanel />
                </section>
              </div>
            </div>

            <div className="game-table-skill-overlay">
              <section className="table-panel table-panel-overlay">
                <ActiveSkillTestPanel />
              </section>
            </div>
          </div>

          <section className="table-panel game-table-hand-dock">
            <HandPanel />
          </section>
        </section>

        <aside className="game-table-sidebar game-table-sidebar-right">
          <section className="table-panel">
            <ChaosBagPanel />
          </section>

          <section className="table-panel">
            <SkillTestPanel />
          </section>

          <section className="table-panel game-table-log-panel">
            <GameLog />
          </section>
        </aside>
      </div>
    </main>
  );
}
