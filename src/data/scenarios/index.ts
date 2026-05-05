import { spreadingFlamesScenario } from "./spreadingFlames";
import { smokeAndMirrorsQuietScenario } from "./smokeAndMirrorsQuiet";
import { smokeAndMirrorsFlamesScenario } from "./smokeAndMirrorsFlames";
import { fakeSpreadingFlamesScenario } from "./fakeSpread";
import { queenOfAshScenario } from "./queenOfAsh";

export const scenarios = [fakeSpreadingFlamesScenario, spreadingFlamesScenario, smokeAndMirrorsQuietScenario, smokeAndMirrorsFlamesScenario, queenOfAshScenario];
export const defaultScenarioId = fakeSpreadingFlamesScenario.id;
