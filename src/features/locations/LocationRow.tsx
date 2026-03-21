import { useGameStore } from "../../store/gameStore";
import LocationCard from "./LocationCard";

export default function LocationRow() {
  const locations = useGameStore((state) => state.locations);

  return (
    <section className="game-panel">
      <h2>Locations</h2>
      <p className="panel-subtitle">Explore, investigate, and survive.</p>

      <div className="horizontal-card-grid">
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </section>
  );
}

