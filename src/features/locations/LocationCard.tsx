import type { Location } from "../../types/game";
import { useGameStore } from "../../store/gameStore";

interface Props {
  location: Location;
}

export default function LocationCard({ location }: Props) {
  const moveInvestigator = useGameStore((state) => state.moveInvestigator);
  const investigatorId = useGameStore((state) => state.investigator.id);

  const isCurrentLocation = location.investigatorsHere.includes(investigatorId);

  return (
    <div
      className={`entity-card location-card ${
        isCurrentLocation ? "current-location highlight" : ""
      }`}
    >
      <p className="entity-title">{location.name}</p>

      <div className="token-row">
        <span className="token-chip gold">Shroud {location.shroud}</span>
        <span className="token-chip gold">Clues {location.clues}</span>
      </div>

      <div className="entity-meta" style={{ marginTop: 10 }}>
        <span>
          Connections: {location.connections.length > 0 ? location.connections.join(", ") : "None"}
        </span>
        <span>
          Investigators Here:{" "}
          {location.investigatorsHere.length > 0
            ? location.investigatorsHere.join(", ")
            : "None"}
        </span>
      </div>

      <div className="location-actions">
        <button onClick={() => moveInvestigator(location.id)}>Move Here</button>
      </div>
    </div>
  );
}

