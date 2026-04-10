import { useMemo, useState } from "react";
import SkillIcon from "../../components/SkillIcon";
import {
  normalizeSkillIcon,
  type SkillIconType,
} from "../../components/skillIconUtils";
import { useGameStore } from "../../store/gameStore";
import { getCardTypeClassName } from "../../lib/ui";

const skillMeta: Record<
  SkillIconType,
  {
    label: string;
    className: string;
  }
> = {
  willpower: {
    label: "Willpower",
    className: "skill-willpower",
  },
  intellect: {
    label: "Intellect",
    className: "skill-intellect",
  },
  combat: {
    label: "Combat",
    className: "skill-combat",
  },
  agility: {
    label: "Agility",
    className: "skill-agility",
  },
  wild: {
    label: "Wild",
    className: "skill-wild",
  },
};

function formatSkillList(icons: string[] | undefined) {
  if (!icons || icons.length === 0) {
    return [];
  }

  return icons
    .map((icon) => normalizeSkillIcon(icon))
    .filter((icon): icon is SkillIconType => icon !== null);
}

export default function ActiveSkillTestPanel() {
  const activeSkillTest = useGameStore((state) => state.activeSkillTest);
  const hand = useGameStore((state) => state.hand);
  const commitSkillCard = useGameStore((state) => state.commitSkillCard);
  const resolveActiveSkillTest = useGameStore(
    (state) => state.resolveActiveSkillTest,
  );
  const cancelActiveSkillTest = useGameStore(
    (state) => state.cancelActiveSkillTest,
  );
  const setDraggedCardId = useGameStore((state) => state.setDraggedCardId);
  const draggedCardId = useGameStore((state) => state.draggedCardId);

  const [isDragOver, setIsDragOver] = useState(false);

  const activeSkill = normalizeSkillIcon(activeSkillTest?.skill ?? "");

  const committableCards = useMemo(() => {
    if (!activeSkill) {
      return hand;
    }

    return hand.filter((card) => {
      const cardIcons = formatSkillList(card.icons);
      return (
        cardIcons.includes(activeSkill) || cardIcons.includes("wild")
      );
    });
  }, [hand, activeSkill]);

  const committedBonus = useMemo(() => {
    if (!activeSkillTest) {
      return 0;
    }

    return activeSkillTest.committedCards.reduce(
      (total, entry) => total + entry.matchingIcons,
      0,
    );
  }, [activeSkillTest]);

  if (!activeSkillTest) {
    return null;
  }

  const skillLabel = activeSkill
    ? skillMeta[activeSkill].label
    : activeSkillTest.skill;

  return (
    <section
      className={`game-panel active-skill-test-panel drop-zone ${isDragOver ? "drop-zone-active" : ""
        }`}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
      }}
      onDragLeave={() => {
        setIsDragOver(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        const cardId =
          event.dataTransfer.getData("text/plain") || draggedCardId;
        setIsDragOver(false);
        setDraggedCardId(null);

        if (cardId) {
          commitSkillCard(cardId);
        }
      }}
    >
      <div className="active-skill-test-header">
        <div>
          <p className="active-skill-test-kicker">Active Skill Test</p>
          <h2 className="active-skill-test-title">{activeSkillTest.source}</h2>
          <p className="panel-subtitle">Commit cards, then resolve the test.</p>
        </div>

        <div className="active-skill-test-summary">
          <div className="skill-value-card">
            <span className="skill-value-label">Skill</span>
            <div className="skill-value-main">
              {activeSkill ? (
                <span
                  className={`skill-icon-badge skill-icon-badge-large ${skillMeta[activeSkill].className}`}
                  title={skillMeta[activeSkill].label}
                  aria-label={skillMeta[activeSkill].label}
                >
                  <SkillIcon
                    skill={activeSkill}
                    className="skill-icon-svg"
                    viewBox="0 0 24 24"
                  />
                </span>
              ) : (
                <strong>{activeSkillTest.skill}</strong>
              )}
            </div>
          </div>

          <div className="skill-value-card">
            <span className="skill-value-label">Difficulty</span>
            <strong className="skill-value-number">
              {activeSkillTest.difficulty}
            </strong>
          </div>

          <div className="skill-value-card">
            <span className="skill-value-label">Committed</span>
            <strong className="skill-value-number">+{committedBonus}</strong>
          </div>
        </div>
      </div>

      <div className="active-skill-test-body">
        <div className="active-skill-test-drop-area">
          <div className="active-skill-test-section-heading">
            <strong>Committed Cards</strong>
            <span>{activeSkillTest.committedCards.length} committed</span>
          </div>

          {activeSkillTest.committedCards.length === 0 ? (
            <div className="empty-drop-message active-skill-empty-state">
              <div className="active-skill-empty-icon">+</div>
              <div>
                <strong>Drag cards here</strong>
                <p>Or use the Commit button on a card below.</p>
              </div>
            </div>
          ) : (
            <div className="horizontal-card-grid active-skill-committed-grid">
              {activeSkillTest.committedCards.map((entry) => {
                const committedIcons = formatSkillList(entry.card.icons);

                return (
                  <div
                    key={entry.card.instanceId}
                    className={`entity-card player-card active-skill-mini-card ${getCardTypeClassName(
                      entry.card,
                    )}`}
                  >
                    <div className="card-topline">
                      <p className="entity-title">{entry.card.name}</p>
                      <span
                        className={`card-type-badge ${getCardTypeClassName(
                          entry.card,
                        )}`}
                      >
                        {entry.card.type}
                      </span>
                    </div>

                    <div className="active-skill-icon-row">
                      {committedIcons.length > 0 ? (
                        committedIcons.map((icon, index) => (
                          <span
                            key={`${entry.card.instanceId}-${icon}-${index}`}
                            className={`skill-icon-badge ${skillMeta[icon].className}`}
                            title={skillMeta[icon].label}
                            aria-label={skillMeta[icon].label}
                          >
                            <SkillIcon
                              skill={icon}
                              className="skill-icon-svg"
                              viewBox="0 0 24 24"
                            />
                          </span>
                        ))
                      ) : (
                        <span className="entity-meta">No icons</span>
                      )}
                    </div>

                    <div className="entity-meta active-skill-match-row">
                      <span>Matching Icons</span>
                      <strong>+{entry.matchingIcons}</strong>
                    </div>

                    {entry.card.text && (
                      <p className="entity-text">{entry.card.text}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {committableCards.length > 0 && (
          <div className="active-skill-test-hand-area">
            <div className="active-skill-test-section-heading">
              <strong>Cards in Hand</strong>
              <span>{committableCards.length} available</span>
            </div>

            <div className="horizontal-card-grid active-skill-hand-grid">
              {committableCards.map((card) => {
                const cardIcons = formatSkillList(card.icons);

                return (
                  <div
                    key={card.instanceId}
                    className={`entity-card player-card active-skill-hand-card ${getCardTypeClassName(
                      card,
                    )} ${draggedCardId === card.instanceId ? "dragging-card" : ""
                      }`}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", card.instanceId);
                      event.dataTransfer.effectAllowed = "move";
                      setDraggedCardId(card.instanceId);
                    }}
                    onDragEnd={() => {
                      setDraggedCardId(null);
                    }}
                  >
                    <div className="card-topline">
                      <p className="entity-title">{card.name}</p>
                      <span
                        className={`card-type-badge ${getCardTypeClassName(
                          card,
                        )}`}
                      >
                        {card.type}
                      </span>
                    </div>

                    <div className="active-skill-icon-row">
                      {cardIcons.length > 0 ? (
                        cardIcons.map((icon, index) => (
                          <span
                            key={`${card.instanceId}-${icon}-${index}`}
                            className={`skill-icon-badge ${skillMeta[icon].className}`}
                            title={skillMeta[icon].label}
                            aria-label={skillMeta[icon].label}
                          >
                            <SkillIcon
                              skill={icon}
                              className="skill-icon-svg"
                              viewBox="0 0 24 24"
                            />
                          </span>
                        ))
                      ) : (
                        <span className="entity-meta">No icons</span>
                      )}
                    </div>

                    {activeSkill && (
                      <div className="entity-meta active-skill-match-row">
                        <span>Matches {skillLabel}</span>
                        <strong>
                          +
                          {
                            cardIcons.filter(
                              (icon) =>
                                icon === activeSkill || icon === "wild",
                            ).length
                          }
                        </strong>
                      </div>
                    )}

                    {card.text && <p className="entity-text">{card.text}</p>}

                    <div className="card-actions">
                      <button onClick={() => commitSkillCard(card.instanceId)}>
                        Commit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="button-row active-skill-test-actions">
        <button onClick={resolveActiveSkillTest}>Resolve Test</button>
        <button onClick={cancelActiveSkillTest}>Cancel Test</button>
      </div>
    </section>
  );
}
