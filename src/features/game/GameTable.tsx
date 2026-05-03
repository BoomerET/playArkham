import { useEffect } from "react";
import GameLog from "../../components/GameLog";
import { useGameStore } from "../../store/gameStore";
import ChaosBagPanel from "../chaosBag/ChaosBagPanel";
import DeckInspector from "../deckInspector/DeckInspector";
import EnemyPanel from "../enemies/EnemyPanel";
import InvestigatorPanel from "../investigators/InvestigatorPanel";
import LocationRow from "../locations/LocationRow";
import MulliganOverlay from "../mulligan/MulliganOverlay";
import DeckPanel from "../playerCards/DeckPanel";
import DiscardPanel from "../playerCards/DiscardPanel";
import HandPanel from "../playerCards/HandPanel";
import PlayAreaPanel from "../playerCards/PlayAreaPanel";
import ActiveSkillTestPanel from "./ActiveSkillTestPanel";
import SkillTestPanel from "./SkillTestPanel";
import TurnPanel from "./TurnPanel";
import "./gameTable.css";
import EncounterPanel from "../encounter/EncounterPanel";
import EncounterInspector from "../encounter/EncounterInspector";
import ScenarioCardPanel from "../scenario/ScenarioCardPanel";
import ScenarioIntroDialog from "../scenario/ScenarioIntroDialog";

export default function GameTable() {
  const returnToHome = useGameStore((state) => state.returnToHome);
  const selectedScenarioId = useGameStore((state) => state.selectedScenarioId);
  const availableScenarios = useGameStore((state) => state.availableScenarios);
  const scenarioStatus = useGameStore((state) => state.scenarioStatus);
  const scenarioResolutionTitle = useGameStore(
    (state) => state.scenarioResolutionTitle,
  );
  const scenarioResolutionSubtitle = useGameStore(
    (state) => state.scenarioResolutionSubtitle,
  );
  const scenarioResolutionText = useGameStore(
    (state) => state.scenarioResolutionText,
  );
  const toggleDeckInspector = useGameStore(
    (state) => state.toggleDeckInspector,
  );
  const toggleEncounterInspector = useGameStore(
    (s) => s.toggleEncounterInspector,
  );
  const agenda = useGameStore((state) => state.agenda);
  const act = useGameStore((state) => state.act);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && (event.key === "d" || event.key === "D")) {
        event.preventDefault();
        toggleDeckInspector();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleDeckInspector]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "e" || e.key === "E")) {
        e.preventDefault();
        toggleEncounterInspector();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleEncounterInspector]);

  const selectedScenario =
    availableScenarios.find((scenario) => scenario.id === selectedScenarioId) ??
    null;

  const showResolutionBanner = scenarioStatus !== "inProgress";

  const fallbackTitle =
    scenarioStatus === "won" ? "Scenario Complete" : "Scenario Failed";

  const fallbackSubtitle =
    scenarioStatus === "won" ? "You survived." : "You were defeated.";

  const fallbackText =
    scenarioStatus === "won"
      ? "The investigators achieved their objective."
      : "The investigators failed to complete their objective.";

  return (
    <main className="game-table-shell">
      <ScenarioIntroDialog />
      <header className="game-table-header">
        <div className="game-table-title-wrap">
          <p className="game-table-eyebrow">Arkham Horror: The Card Game</p>
          <h1 className="game-table-title">
            {selectedScenario?.name ?? "Play Arkham"}
          </h1>
          {selectedScenario?.description ? (
            <p className="game-table-subtitle">
              {selectedScenario.description}
            </p>
          ) : null}
        </div>

        <button className="secondary-button" onClick={returnToHome}>
          Back to Home
        </button>
      </header>

      {showResolutionBanner ? (
        <section
          className="table-panel"
          style={{
            marginBottom: 16,
            borderColor:
              scenarioStatus === "won"
                ? "rgba(104, 182, 130, 0.4)"
                : "rgba(197, 84, 84, 0.4)",
            background:
              scenarioStatus === "won"
                ? "rgba(43, 99, 61, 0.22)"
                : "rgba(118, 36, 36, 0.22)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: scenarioStatus === "won" ? "#dcf5e4" : "#ffdada",
            }}
          >
            {scenarioResolutionTitle ?? fallbackTitle}
          </p>
          <h2 style={{ margin: "8px 0 6px", fontSize: "1.35rem" }}>
            {scenarioResolutionSubtitle ?? fallbackSubtitle}
          </h2>
          <p style={{ margin: 0, color: "rgba(243, 239, 228, 0.92)" }}>
            {scenarioResolutionText ?? fallbackText}
          </p>
        </section>
      ) : null}

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
                {/*
                <section className="table-panel game-table-scenario-panel">
                  <AgendaPanel />
                </section>

                <section className="table-panel game-table-scenario-panel">
                  <ActPanel />
                </section>
                */}
                <section className="table-panel game-table-scenario-panel">
                  <ScenarioCardPanel kind="agenda" card={agenda} />
                </section>

                <section className="table-panel game-table-scenario-panel">
                  <ScenarioCardPanel kind="act" card={act} />
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
            <EncounterPanel />
          </section>

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

      <MulliganOverlay />
      <DeckInspector />
      <EncounterInspector />
    </main>
  );
}
