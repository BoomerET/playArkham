import { useGameStore } from "../../store/gameStore";
import LocationCard from "./LocationCard";

export default function LocationRow() {
  const locations = useGameStore((state) => state.locations);

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
        <div className="location-board-grid">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </div>
    </section>
  );
}
