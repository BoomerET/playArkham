import { useGameStore } from "../../store/gameStore";
import LocationCard from "./LocationCard";

export default function LocationRow() {
  const locations = useGameStore((state) => state.locations);

  const allPositioned = locations.every((location) => location.mapPosition);

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