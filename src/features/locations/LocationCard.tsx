import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { getFactionClassName } from "../../lib/ui";
import { useGameStore } from "../../store/gameStore";
import type { GameLocation } from "../../types/game";
import "./locationCard.css";

interface Props {
  location: GameLocation;
}

function formatName(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getEnemyTokenLabel(name: string): string {
  const words = name.split(" ").filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

export default function LocationCard({ location }: Props) {
  const moveInvestigator = useGameStore((state) => state.moveInvestigator);
  const investigator = useGameStore((state) => state.investigator);
  const locations = useGameStore((state) => state.locations);
  const enemies = useGameStore((state) => state.enemies);
  const availableInvestigators = useGameStore(
    (state) => state.availableInvestigators,
  );

  const [isRevealAnimating, setIsRevealAnimating] = useState(false);
  const wasRevealedRef = useRef(location.revealed);

  useEffect(() => {
    if (!wasRevealedRef.current && location.revealed) {
      const startTimeout = window.setTimeout(() => {
        setIsRevealAnimating(true);
      }, 0);

      const endTimeout = window.setTimeout(() => {
        setIsRevealAnimating(false);
      }, 500);

      wasRevealedRef.current = true;

      return () => {
        window.clearTimeout(startTimeout);
        window.clearTimeout(endTimeout);
      };
    }

    wasRevealedRef.current = location.revealed;
  }, [location.revealed]);

  const isCurrentLocation = location.investigatorsHere.includes(investigator.id);

  const currentLocation = locations.find((current) =>
    current.investigatorsHere.includes(investigator.id),
  );

  const isLegalMove =
    !!currentLocation &&
    currentLocation.id !== location.id &&
    currentLocation.connections.includes(location.id);

  const isIllegalMove =
    !!currentLocation &&
    currentLocation.id !== location.id &&
    !currentLocation.connections.includes(location.id);

  const enemiesHere = enemies.filter(
    (enemy) =>
      enemy.locationId === location.id && enemy.engagedInvestigatorId === null,
  );

  function getInvestigatorData(id: string) {
    return availableInvestigators.find((item) => item.id === id);
  }

  function getInvestigatorShortName(id: string): string {
    const fullName = getInvestigatorData(id)?.name ?? formatName(id);
    const parts = fullName.split(" ");
    return parts.length > 1 ? parts[0] : fullName;
  }

  function handleClick() {
    if (isLegalMove) {
      moveInvestigator(location.id);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if ((event.key === "Enter" || event.key === " ") && isLegalMove) {
      event.preventDefault();
      moveInvestigator(location.id);
    }
  }

  const locationStateClass = isCurrentLocation
    ? "current-location"
    : isLegalMove
      ? "legal-location"
      : isIllegalMove
        ? "illegal-location"
        : "";

  const isInteractive = isLegalMove;
  const hasInvestigators = location.investigatorsHere.length > 0;
  const hasEnemies = enemiesHere.length > 0;

  return (
    <div
      className={`entity-card location-card location-card-compact location-card-tight ${
        location.revealed ? "location-card-revealed" : "location-card-hidden"
      } ${isRevealAnimating ? "location-card-reveal-animating" : ""} ${locationStateClass} ${
        isInteractive ? "clickable-location" : "static-location"
      }`}
      onClick={isInteractive ? handleClick : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : -1}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      aria-label={isInteractive ? `Move to ${location.name}` : undefined}
    >
      {location.revealed ? (
        <>
          <div className="location-card-header">
            <p className="entity-title location-card-title">{location.name}</p>

            <div className="location-card-stats">
              <span className="token-chip gold">S {location.shroud}</span>
              <span className="token-chip gold">C {location.clues}</span>
            </div>
          </div>

          <div className="location-card-status-row token-row">
            {isCurrentLocation && <span className="token-chip success">Current</span>}
            {isLegalMove && <span className="token-chip">Move</span>}
            {isIllegalMove && <span className="token-chip danger">Blocked</span>}
          </div>

          {(hasInvestigators || hasEnemies) && (
            <div className="location-card-presence">
              {hasInvestigators && (
                <div className="location-card-presence-block">
                  <p className="location-card-mini-label">Investigators</p>
                  <div className="location-investigator-token-row">
                    {location.investigatorsHere.map((id) => {
                      const data = getInvestigatorData(id);
                      const factionClass = data
                        ? getFactionClassName(data.faction)
                        : "faction-neutral";

                      return (
                        <div
                          key={id}
                          className={`location-investigator-token ${factionClass}`}
                          title={data?.name ?? formatName(id)}
                          aria-label={data?.name ?? formatName(id)}
                        >
                          {data?.portrait ? (
                            <img
                              src={data.portrait}
                              alt={data.name}
                              className="location-investigator-token-image"
                            />
                          ) : (
                            <span className="location-investigator-token-fallback">
                              {getInvestigatorShortName(id).slice(0, 2).toUpperCase()}
                            </span>
                          )}

                          {id === investigator.id && (
                            <span
                              className="location-investigator-token-active-ring"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {hasEnemies && (
                <div className="location-card-presence-block">
                  <p className="location-card-mini-label">Enemies</p>
                  <div className="location-enemy-token-row">
                    {enemiesHere.map((enemy) => (
                      <div
                        key={enemy.id}
                        className={`location-enemy-token ${
                          enemy.exhausted ? "location-enemy-token-exhausted" : ""
                        }`}
                        title={`${enemy.name} • ${enemy.damageOnEnemy}/${enemy.health} damage${
                          enemy.exhausted ? " • exhausted" : ""
                        }`}
                        aria-label={enemy.name}
                      >
                        <span className="location-enemy-token-skull" aria-hidden="true">
                          ☠
                        </span>
                        <span className="location-enemy-token-label">
                          {getEnemyTokenLabel(enemy.name)}
                        </span>

                        {enemy.damageOnEnemy > 0 && (
                          <span className="location-enemy-token-damage">
                            {enemy.damageOnEnemy}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="location-card-hidden-face">
          <p className="location-card-hidden-label">Unrevealed</p>
          <div className="location-card-hidden-art" aria-hidden="true">
            <span className="location-card-hidden-glyph">?</span>
          </div>
          <p className="location-card-hidden-name">{location.name}</p>
        </div>
      )}
    </div>
  );
}
