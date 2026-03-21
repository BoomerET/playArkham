import type { Location } from "../../types/game";
import { useGameStore } from "../../store/gameStore";

function useInvestigatorNameLookup() {
  const investigators = useGameStore((state) => state.availableInvestigators);

  return (id: string) => {
    return investigators.find((i) => i.id === id)?.name ?? id;
  };
}

function formatLocationId(id: string): string {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

interface Props {
  location: Location;
}

export default function LocationCard({ location }: Props) {
  const moveInvestigator = useGameStore((state) => state.moveInvestigator);
  const investigatorId = useGameStore((state) => state.investigator.id);

  const isCurrentLocation = location.investigatorsHere.includes(investigatorId);

  const getName = useInvestigatorNameLookup();

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
        <div>
          <strong>Connections:</strong>{" "}
          {location.connections.length > 0
            ? location.connections.map(formatLocationId).join(", ")
            : "None"}
        </div>

        <div>
          <strong>Investigators Here:</strong>{" "}
          {location.investigatorsHere.length > 0
            ? location.investigatorsHere.map(getName).join(", ")
            : "None"}
        </div>
      </div>

      <div className="location-actions">
        <button onClick={() => moveInvestigator(location.id)}>Move Here</button>
      </div>
    </div>
  );
}
