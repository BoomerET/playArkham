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
  const availableInvestigators = useGameStore(
    (state) => state.availableInvestigators,
  );

  const isCurrentLocation = location.investigatorsHere.includes(investigator.id);

  const currentLocation = locations.find((current) =>
    current.investigatorsHere.includes(investigator.id),
  );

  const isConnected =
    !!currentLocation &&
    (currentLocation.id === location.id ||
      currentLocation.connections.includes(location.id));

  function getInvestigatorDisplayName(id: string): string {
    return availableInvestigators.find((item) => item.id === id)?.name ?? formatName(id);
  }

  function handleClick() {
    if (!isCurrentLocation) {
      moveInvestigator(location.id);
    }
  }

  return (
    <div
      className={`entity-card location-card ${
        isCurrentLocation ? "current-location highlight" : ""
      } ${isConnected ? "clickable-location" : "unclickable-location"}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClick();
        }
      }}
    >
      <p className="entity-title">{location.name}</p>

      <div className="token-row">
        <span className="token-chip gold">Shroud {location.shroud}</span>
        <span className="token-chip gold">Clues {location.clues}</span>
        {isCurrentLocation && <span className="token-chip success">Current</span>}
      </div>

      <div className="entity-meta" style={{ marginTop: 10 }}>
        <div>
          <strong>Connections:</strong>{" "}
          {location.connections.length > 0
            ? location.connections.map(formatName).join(", ")
            : "None"}
        </div>

        <div>
          <strong>Investigators Here:</strong>{" "}
          {location.investigatorsHere.length > 0
            ? location.investigatorsHere.map(getInvestigatorDisplayName).join(", ")
            : "None"}
        </div>
      </div>
    </div>
  );
}
