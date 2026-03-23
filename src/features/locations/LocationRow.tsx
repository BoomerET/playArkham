import { useMemo } from "react";
import { useGameStore } from "../../store/gameStore";
import LocationCard from "./LocationCard";

type ConnectionLine = {
  key: string;
  fromIndex: number;
  toIndex: number;
};

export default function LocationRow() {
  const locations = useGameStore((state) => state.locations);

  const connectionLines = useMemo<ConnectionLine[]>(() => {
    const locationIndexById = new Map(
      locations.map((location, index) => [location.id, index]),
    );

    const seen = new Set<string>();
    const lines: ConnectionLine[] = [];

    locations.forEach((location, fromIndex) => {
      location.connections.forEach((connectedId) => {
        const toIndex = locationIndexById.get(connectedId);

        if (toIndex === undefined) {
          return;
        }

        const low = Math.min(fromIndex, toIndex);
        const high = Math.max(fromIndex, toIndex);
        const key = `${low}-${high}`;

        if (seen.has(key)) {
          return;
        }

        seen.add(key);
        lines.push({
          key,
          fromIndex,
          toIndex,
        });
      });
    });

    return lines;
  }, [locations]);

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
        <div className="location-map-shell">
          <svg
            className="location-connection-layer"
            aria-hidden="true"
            viewBox={`0 0 ${Math.max(locations.length - 1, 1) * 100} 100`}
            preserveAspectRatio="none"
          >
            {connectionLines.map((line) => {
              const maxIndex = Math.max(locations.length - 1, 1);
              const x1 = (line.fromIndex / maxIndex) * 100;
              const x2 = (line.toIndex / maxIndex) * 100;

              return (
                <line
                  key={line.key}
                  x1={`${x1}%`}
                  y1="50%"
                  x2={`${x2}%`}
                  y2="50%"
                  className="location-connection-line"
                />
              );
            })}
          </svg>

          <div className="location-board-grid">
            {locations.map((location) => (
              <div key={location.id} className="location-board-cell">
                <LocationCard location={location} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
