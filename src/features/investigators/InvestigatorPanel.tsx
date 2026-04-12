import type { Investigator } from "../../types/game";
import FactionIcon from "../../components/FactionIcon";
import { getFactionClassName } from "../../lib/ui";
import { useGameStore } from "../../store/gameStore";
import { getSlotCapacity, getUsedSlots } from "../playerCards/slots";
import "./investigatorPanel.css";
import { useMemo, useState } from "react";


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

type SlotRowProps = {
  label: string;
  used: number;
  max: number;
};

function SlotRow({ label, used, max }: SlotRowProps) {
  const full = used >= max;

  return (
    <div className="investigator-panel__slot-row">
      <span className="investigator-panel__slot-label">{label}</span>
      <span
        className={
          full
            ? "investigator-panel__slot-value investigator-panel__slot-value--full"
            : "investigator-panel__slot-value"
        }
      >
        {used}/{max}
      </span>
    </div>
  );
}

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

  const match = Object.entries(investigatorHeadImages).find(([path]) => {
    const fileName = path.split("/").pop()?.toLowerCase() ?? "";
    const baseName = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, "");

    return (
      fileName === normalized ||
      path.toLowerCase().endsWith(`/${normalized}`) ||
      baseName === normalized
    );
  });

  return match?.[1] ?? null;
}

function getInvestigatorPortraitUrl(investigator: Investigator): string | null {
  return getInvestigatorHeadUrl(
    investigator.code ?? investigator.portraitHead ?? investigator.portrait,
  );
}

export default function InvestigatorPanel() {
  const pendingAssetPlay = useGameStore((state) => state.pendingAssetPlay);
  const togglePendingAssetReplacementChoice = useGameStore(
    (state) => state.togglePendingAssetReplacementChoice,
  );
  const confirmAssetReplacement = useGameStore(
    (state) => state.confirmAssetReplacement,
  );
  const cancelPendingAssetPlay = useGameStore(
    (state) => state.cancelPendingAssetPlay,
  );
  const investigator = useGameStore((state) => state.investigator);
  const playArea = useGameStore((state) => state.playArea);
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

  const usedSlots = getUsedSlots(playArea);
  const slotCapacity = getSlotCapacity(investigator);

  const canTakeAction =
    turn.phase === "investigation" && turn.actionsRemaining > 0;

  const factionClass = getFactionClassName(investigator.faction);
  const { firstLine, secondLine } = splitInvestigatorName(investigator.name);
  const portraitUrl = getInvestigatorPortraitUrl(investigator);

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

  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showAdjustmentsMenu, setShowAdjustmentsMenu] = useState(false);
  const [showLocationsMenu, setShowLocationsMenu] = useState(false);
  const [showScenarioMenu, setShowScenarioMenu] = useState(false);

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

      <section className="investigator-panel__section">
        <h3 className="investigator-panel__section-title">Equipment Slots</h3>

        <div className="investigator-panel__slots">
          <SlotRow label="Hand" used={usedSlots.Hand} max={slotCapacity.Hand} />
          <SlotRow
            label="Arcane"
            used={usedSlots.Arcane}
            max={slotCapacity.Arcane}
          />
          <SlotRow label="Ally" used={usedSlots.Ally} max={slotCapacity.Ally} />
          <SlotRow
            label="Accessory"
            used={usedSlots.Accessory}
            max={slotCapacity.Accessory}
          />
          <SlotRow label="Head" used={usedSlots.Head} max={slotCapacity.Head} />
          <SlotRow label="Body" used={usedSlots.Body} max={slotCapacity.Body} />
        </div>
      </section>

      {pendingAssetPlay && (
        <section className="asset-replacement-modal">
          <div className="asset-replacement-modal__card">
            <h3 className="asset-replacement-modal__title">
              Replace {pendingAssetPlay.replacedSlot} Asset
            </h3>

            <p className="asset-replacement-modal__text">
              {pendingAssetPlay.requiredHandSlotsToFree
                ? `Choose replacements that free ${pendingAssetPlay.requiredHandSlotsToFree} hand slot${pendingAssetPlay.requiredHandSlotsToFree === 1 ? "" : "s"}.`
                : "Choose one in-play asset to discard."}
            </p>

            <div className="asset-replacement-modal__choices">
              {pendingAssetPlay.replacementChoices.map((card) => {
                const selected =
                  pendingAssetPlay.selectedReplacementIds.includes(
                    card.instanceId,
                  );

                return (
                  <button
                    key={card.instanceId}
                    type="button"
                    className={`asset-replacement-modal__choice ${selected
                      ? "asset-replacement-modal__choice--selected"
                      : ""
                      }`}
                    onClick={() =>
                      togglePendingAssetReplacementChoice(card.instanceId)
                    }
                  >
                    {card.name}
                    {card.slot ? ` (${card.slot})` : ""}
                  </button>
                );
              })}
            </div>

            <div className="asset-replacement-modal__actions">
              <button
                type="button"
                className="asset-replacement-modal__confirm"
                onClick={confirmAssetReplacement}
              >
                Confirm Replacement
              </button>

              <button
                type="button"
                className="asset-replacement-modal__cancel"
                onClick={cancelPendingAssetPlay}
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      )}

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
                    className={`engaged-enemy-card ${isSelectedTarget ? "engaged-enemy-card-primary" : ""
                      } ${isSelectable ? "engaged-enemy-card-selectable" : ""
                      }`}
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

      <section className="investigator-control-group">
        <button
          type="button"
          className="investigator-control-toggle"
          onClick={() => setShowActionsMenu((current) => !current)}
        >
          Actions {showActionsMenu ? "▴" : "▾"}
        </button>

        {showActionsMenu && (
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
        )}
      </section>

      <hr />

      <section className="investigator-control-group">
        <button
          type="button"
          className="investigator-control-toggle"
          onClick={() => setShowAdjustmentsMenu((current) => !current)}
        >
          Adjustments {showAdjustmentsMenu ? "▴" : "▾"}
        </button>

        {showAdjustmentsMenu && (
          <div className="button-row">
            <button onClick={() => spendResource(1)}>-1 Resource</button>
            <button onClick={() => gainClue(1)}>+1 Clue</button>
            <button onClick={() => takeDamage(1)}>+1 Damage</button>
            <button onClick={() => takeHorror(1)}>+1 Horror</button>
          </div>
        )}
      </section>
    </section>
  );
}
