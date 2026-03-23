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
  const engagedEnemies = enemiesHere.filter(
    (enemy) => enemy.engagedInvestigatorId !== null,
  );
  const exhaustedEnemies = enemiesHere.filter((enemy) => enemy.exhausted);

  function getInvestigatorShortName(id: string): string {
    const fullName =
      availableInvestigators.find((item) => item.id === id)?.name ??
      formatName(id);

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
      className={`entity-card location-card location-card-compact location-card-tight ${locationStateClass} ${
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
              <div className="location-card-badge-row">
                {location.investigatorsHere.map((id) => (
                  <span key={id} className="location-presence-badge">
                    {getInvestigatorShortName(id)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hasEnemies && (
            <div className="location-card-presence-block">
              <p className="location-card-mini-label">Enemies</p>
              <div className="location-card-badge-row">
                <span className="location-presence-badge danger">
                  {enemiesHere.length} present
                </span>
                {engagedEnemies.length > 0 && (
                  <span className="location-presence-badge warning">
                    {engagedEnemies.length} engaged
                  </span>
                )}
                {exhaustedEnemies.length > 0 && (
                  <span className="location-presence-badge">
                    {exhaustedEnemies.length} exhausted
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

