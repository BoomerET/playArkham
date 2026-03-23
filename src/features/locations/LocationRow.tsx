import { useMemo } from "react";
import { useGameStore } from "../../store/gameStore";
import LocationCard from "./LocationCard";

type ConnectionLine = {
  key: string;
  fromId: string;
  toId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export default function LocationRow() {
  const locations = useGameStore((state) => state.locations);

  const allPositioned = locations.every((location) => location.mapPosition);

  const connectionLines = useMemo<ConnectionLine[]>(() => {
    if (!allPositioned) {
      return [];
    }

    const locationById = new Map(locations.map((location) => [location.id, location]));
    const seen = new Set<string>();
    const lines: ConnectionLine[] = [];

    locations.forEach((location) => {
      location.connections.forEach((connectedId) => {
        const connectedLocation = locationById.get(connectedId);

        if (!connectedLocation?.mapPosition || !location.mapPosition) {
          return;
        }

        const a = location.id < connectedId ? location.id : connectedId;
        const b = location.id < connectedId ? connectedId : location.id;
        const key = `${a}-${b}`;

        if (seen.has(key)) {
          return;
        }

        seen.add(key);

        lines.push({
          key,
          fromId: location.id,
          toId: connectedId,
          x1: location.mapPosition.x,
          y1: location.mapPosition.y,
          x2: connectedLocation.mapPosition.x,
          y2: connectedLocation.mapPosition.y,
        });
      });
    });

    return lines;
  }, [locations, allPositioned]);

  return (
    <section className="location-row-panel">
      <div className="location-row-header">
        <div>
          <p className="location-row-kicker">Scenario Map</p>
          <h2 className="location-row-title">Locations</h2>
          <p className="panel-subtitle location-row-subtitle">
            Explore, investigate, and survive.
          </p>
        </div>

        <div className="location-row-summary">
          <span className="token-chip gold">
            {locations.length} {locations.length === 1 ? "Location" : "Locations"}
          </span>
        </div>
      </div>

      <div className="location-board-surface">
        {allPositioned ? (
          <div className="location-map-canvas">
            <svg
              className="location-connection-layer"
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {connectionLines.map((line) => (
                <line
                  key={line.key}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  className="location-connection-line"
                />
              ))}
            </svg>

            {locations.map((location) => (
              <div
                key={location.id}
                className="location-map-node"
                style={{
                  left: `${location.mapPosition!.x}%`,
                  top: `${location.mapPosition!.y}%`,
                }}
              >
                <LocationCard location={location} />
              </div>
            ))}
          </div>
        ) : (
          <div className="location-board-grid">
            {locations.map((location) => (
              <div key={location.id} className="location-board-cell">
                <LocationCard location={location} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

