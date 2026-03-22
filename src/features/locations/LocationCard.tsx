import type { KeyboardEvent } from "react";
import { useGameStore } from "../../store/gameStore";
import type { Location } from "../../types/game";

interface Props {
  location: Location;
}

function formatName(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function LocationCard({ location }: Props) {
  const moveInvestigator = useGameStore((state) => state.moveInvestigator);
  const investigator = useGameStore((state) => state.investigator);
  const locations = useGameStore((state) => state.locations);
  const enemies = useGameStore((state) => state.enemies);
  const availableInvestigators = useGameStore(
    (state) => state.availableInvestigators,
  );

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

  const enemiesHere = enemies.filter((enemy) => enemy.locationId === location.id);

  function getInvestigatorDisplayName(id: string): string {
    return (
      availableInvestigators.find((item) => item.id === id)?.name ??
      formatName(id)
    );
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

  return (
    <div
      className={`entity-card location-card ${locationStateClass} ${
        isInteractive ? "clickable-location" : "static-location"
      }`}
      onClick={isInteractive ? handleClick : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : -1}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      aria-label={isInteractive ? `Move to ${location.name}` : undefined}
    >
      <div className="location-card-header">
        <p className="entity-title location-card-title">{location.name}</p>

        <div className="location-card-stats">
          <span className="token-chip gold">Shroud {location.shroud}</span>
          <span className="token-chip gold">Clues {location.clues}</span>
        </div>
      </div>

      <div className="token-row location-card-status-row">
        {isCurrentLocation && <span className="token-chip success">Current</span>}
        {isLegalMove && <span className="token-chip">Move Available</span>}
        {isIllegalMove && <span className="token-chip danger">Not Connected</span>}
        {enemiesHere.length > 0 && (
          <span className="token-chip danger">
            Enemies {enemiesHere.length}
          </span>
        )}
      </div>

      <div className="location-card-body">
        <div className="location-card-section">
          <p className="location-card-section-label">Connections</p>
          <p className="entity-meta location-card-section-value">
            {location.connections.length > 0
              ? location.connections.map(formatName).join(", ")
              : "None"}
          </p>
        </div>

        <div className="location-card-section">
          <p className="location-card-section-label">Investigators Here</p>
          <p className="entity-meta location-card-section-value">
            {location.investigatorsHere.length > 0
              ? location.investigatorsHere
                  .map(getInvestigatorDisplayName)
                  .join(", ")
              : "None"}
          </p>
        </div>

        <div className="location-card-section">
          <p className="location-card-section-label">Enemies Here</p>

          {enemiesHere.length === 0 ? (
            <p className="entity-meta location-card-section-value">None</p>
          ) : (
            <div className="location-enemy-list">
              {enemiesHere.map((enemy) => {
                const engagedName = enemy.engagedInvestigatorId
                  ? getInvestigatorDisplayName(enemy.engagedInvestigatorId)
                  : null;

                return (
                  <div
                    key={enemy.id}
                    className={`location-enemy-chip ${
                      enemy.exhausted ? "location-enemy-chip-exhausted" : ""
                    }`}
                  >
                    <div className="location-enemy-chip-top">
                      <strong>{enemy.name}</strong>
                      <span>
                        {enemy.damageOnEnemy}/{enemy.health}
                      </span>
                    </div>

                    <div className="location-enemy-chip-meta">
                      <span>F {enemy.fight}</span>
                      <span>E {enemy.evade}</span>
                      <span>Dmg {enemy.damage}</span>
                      <span>Hor {enemy.horror}</span>
                    </div>

                    <div className="location-enemy-chip-tags">
                      {engagedName && (
                        <span className="token-chip danger">
                          Engaged: {engagedName}
                        </span>
                      )}
                      {enemy.exhausted && (
                        <span className="token-chip">Exhausted</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

