import { useGameStore } from "../../store/gameStore";
import LocationCard from "./LocationCard";

export default function LocationRow() {
  const locations = useGameStore((state) => state.locations);

  const visibleLocations = locations.filter((location) => location.isVisible);

  const allPositioned =
    visibleLocations.length > 0 &&
    visibleLocations.every((location) => location.mapPosition);

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
            {visibleLocations.length}{" "}
            {visibleLocations.length === 1 ? "Location" : "Locations"}
          </span>
        </div>
      </div>

      <div className="location-board-surface">
        {visibleLocations.length === 0 ? (
          <div className="location-board-grid">
            <div className="location-board-cell">
              <div className="entity-card location-card location-card-hidden">
                <div className="location-card-hidden-face">
                  <p className="location-card-hidden-label">No Visible Locations</p>
                  <div className="location-card-hidden-art" aria-hidden="true">
                    <span className="location-card-hidden-glyph">?</span>
                  </div>
                  <p className="location-card-hidden-name">
                    A scenario effect will reveal the next location.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : allPositioned ? (
          <div className="location-map-canvas">
            {visibleLocations.map((location) => (
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
            {visibleLocations.map((location) => (
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
