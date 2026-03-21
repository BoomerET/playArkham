import HomeScreen from "./features/home/HomeScreen";
import GameTable from "./features/game/GameTable";
import { useGameStore } from "./store/gameStore";

export default function App() {
  const screen = useGameStore((state) => state.screen);

  if (screen === "home") {
    return <HomeScreen />;
  }

  return <GameTable />;
}

