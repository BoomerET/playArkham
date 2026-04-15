import type { Investigator } from "../../types/game";
import FactionIcon from "../../components/FactionIcon";
import { getFactionClassName } from "../../lib/ui";
import { useGameStore } from "../../store/gameStore";
import { getSlotCapacity, getUsedSlots } from "../playerCards/slots";
import "./investigatorPanel.css";
import { useState } from "react";
import { findCurrentLocation } from "../../lib/gameStateHelpers";

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
  const pendingInteractiveTargetSelection = useGameStore(
    (state) => state.pendingInteractiveTargetSelection,
  );
  const chooseInteractiveEnemyTarget = useGameStore(
    (state) => state.chooseInteractiveEnemyTarget,
  );
  const cancelInteractiveTargetSelection = useGameStore(
    (state) => state.cancelInteractiveTargetSelection,
  );

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
  const resignAction = useGameStore((state) => state.resignAction);
  const parleyAction = useGameStore((state) => state.parleyAction);

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

  const locations = useGameStore((state) => state.locations);
  //const locationAction = useGameStore((state) => state.locationAction);
  const locationAbility = useGameStore((state) => state.locationAbility);
  const currentLocation = findCurrentLocation(locations, investigator.id);
  const campaignState = useGameStore((state) => state.campaignState);
  //const availableLocationActions = (currentLocation?.actions ?? []).filter(
  //  (action) =>
  //    !action.requiresFlag ||
  //    campaignState.scenarioFlags[action.requiresFlag.key] ===
  //    action.requiresFlag.equals,
  //);
  const availableLocationAbilities = (currentLocation?.abilities ?? []).filter(
    (ability) =>
      (ability.trigger === "action" || ability.trigger === "doubleAction") &&
      (!ability.requiresFlag ||
        campaignState.scenarioFlags[ability.requiresFlag.key] ===
        ability.requiresFlag.equals),
  );
  const engageableEnemies = currentLocation
    ? enemies.filter(
      (enemy) =>
        enemy.locationId === currentLocation.id &&
        enemy.engagedInvestigatorId === null,
    )
    : [];
  const activeEngageTarget = engageableEnemies[0] ?? null;

  const parleyEnemies = currentLocation
    ? enemies.filter(
      (enemy) =>
        enemy.locationId === currentLocation.id &&
        enemy.parley,
    )
    : [];

  const hasLocationParley = Boolean(currentLocation?.parley);

  const resignLabel = "Resign";
  const engageLabel = activeEngageTarget
    ? `Engage ${activeEngageTarget.name}`
    : "Engage";

  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showAdjustmentsMenu, setShowAdjustmentsMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedAdjustment, setSelectedAdjustment] = useState("");
  const engageEnemy = useGameStore((state) => state.engageEnemy);

  const interactiveTargetEnemies = pendingInteractiveTargetSelection
    ? enemies.filter((enemy) =>
      pendingInteractiveTargetSelection.validEnemyIds.includes(enemy.id),
    )
    : [];

  function handleExecuteAction() {
    switch (selectedAction) {
      case "resource":
        takeResourceAction();
        break;
      case "draw":
        takeDrawAction();
        break;
      case "investigate":
        investigateAction();
        break;
      case "fight":
        fightAction();
        break;
      case "evade":
        evadeAction();
        break;
      case "engage":
        if (activeEngageTarget) {
          engageEnemy(activeEngageTarget.id);
        }
        break;
      case "parley-location":
        parleyAction();
        break;
      case "resign":
        resignAction();
        break;
      default:
        if (selectedAction.startsWith("parley-enemy:")) {
          const enemyId = selectedAction.slice("parley-enemy:".length);
          parleyAction(enemyId);
        } else if (selectedAction.startsWith("location-ability:")) {
          const indexText = selectedAction.slice("location-ability:".length);
          const index = Number(indexText);

          if (!Number.isNaN(index)) {
            locationAbility(index);
          }
        }
        break;
    }

    setSelectedAction("");
  }

  function handleExecuteAdjustment() {
    switch (selectedAdjustment) {
      case "spend-resource":
        spendResource(1);
        break;
      case "gain-clue":
        gainClue(1);
        break;
      case "take-damage":
        takeDamage(1);
        break;
      case "take-horror":
        takeHorror(1);
        break;
      default:
        break;
    }
    setSelectedAdjustment("");
  }

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

          <div className="investigator-skill-grid">
            <div className="investigator-skill-stat investigator-skill-stat--will">
              <span className="investigator-skill-stat__label">WIL</span>
              <span className="investigator-skill-stat__value">
                {investigator.willpower}
              </span>
            </div>
            <div className="investigator-skill-stat investigator-skill-stat--int">
              <span className="investigator-skill-stat__label">INT</span>
              <span className="investigator-skill-stat__value">
                {investigator.intellect}
              </span>
            </div>
            <div className="investigator-skill-stat investigator-skill-stat--com">
              <span className="investigator-skill-stat__label">COM</span>
              <span className="investigator-skill-stat__value">
                {investigator.combat}
              </span>
            </div>
            <div className="investigator-skill-stat investigator-skill-stat--agi">
              <span className="investigator-skill-stat__label">AGI</span>
              <span className="investigator-skill-stat__value">
                {investigator.agility}
              </span>
            </div>
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

      {pendingInteractiveTargetSelection && (
        <>
          <hr />

          <div className="engaged-enemies-section">
            <div className="engaged-enemies-header">Choose Target</div>

            <p className="engaged-enemies-targeting-note">
              Select an enemy for {pendingInteractiveTargetSelection.sourceName}.
            </p>

            <div className="engaged-enemies-list">
              {interactiveTargetEnemies.map((enemy) => (
                <button
                  key={enemy.id}
                  type="button"
                  className="engaged-enemy-card engaged-enemy-card-selectable"
                  onClick={() => chooseInteractiveEnemyTarget(enemy.id)}
                >
                  <div className="engaged-enemy-main">
                    <div className="engaged-enemy-name-row">
                      <div className="engaged-enemy-name-stack">
                        <span className="engaged-enemy-name">{enemy.name}</span>
                      </div>
                    </div>

                    <div className="engaged-enemy-meta">
                      <span className="token-chip">Fight {enemy.fight}</span>
                      <span className="token-chip">Evade {enemy.evade}</span>
                      <span className="token-chip">
                        Damage {enemy.damageOnEnemy}/{enemy.health}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="button-row">
              <button type="button" onClick={cancelInteractiveTargetSelection}>
                Cancel
              </button>
            </div>
          </div>
        </>
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
            <select
              className="investigator-action-select"
              value={selectedAction}
              onChange={(event) => setSelectedAction(event.target.value)}
              disabled={!canTakeAction}
              aria-label="Choose an action"
            >
              <option value="">Choose action…</option>
              <option value="resource">Resource</option>
              <option value="draw">Draw</option>
              <option value="investigate">Investigate</option>
              <option value="fight">{fightLabel}</option>
              <option value="evade">{evadeLabel}</option>
              {parleyEnemies.map((enemy) => (
                <option key={`parley-enemy-${enemy.id}`} value={`parley-enemy:${enemy.id}`}>
                  Parley {enemy.name}
                </option>
              ))}

              {hasLocationParley && currentLocation && (
                <option value="parley-location">
                  {currentLocation.parley?.label ?? `Parley at ${currentLocation.name}`}
                </option>
              )}
              <option value="resign">{resignLabel}</option>
              <option value="engage" disabled={!activeEngageTarget}>
                {engageLabel}
              </option>
              {/*}
              {availableLocationActions.map((action, index) => (
                <option key={`location-action-${index}`} value={`location-action:${index}`}>
                  {action.label}
                </option>
              ))}
              */}
              {availableLocationAbilities.map((ability, index) => (
                <option key={`location-ability-${index}`} value={`location-ability:${index}`}>
                  {ability.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="investigator-action-go"
              onClick={handleExecuteAction}
              disabled={!canTakeAction || !selectedAction}
            >
              Go
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
            <select
              className="investigator-action-select"
              value={selectedAdjustment}
              onChange={(event) => setSelectedAdjustment(event.target.value)}
              aria-label="Choose an adjustment"
            >
              <option value="">Choose adjustment…</option>
              <option value="spend-resource">-1 Resource</option>
              <option value="gain-clue">+1 Clue</option>
              <option value="take-damage">+1 Damage</option>
              <option value="take-horror">+1 Horror</option>
            </select>

            <button
              type="button"
              className="investigator-action-go"
              onClick={handleExecuteAdjustment}
              disabled={!selectedAdjustment}
            >
              Go
            </button>
          </div>
        )}
      </section>
    </section>
  );
}
