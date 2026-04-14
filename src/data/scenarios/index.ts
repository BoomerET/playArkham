import { spreadingFlamesScenario } from "./spreadingFlames";
import { smokeAndMirrorsQuietScenario } from "./smokeAndMirrorsQuiet";
import { smokeAndMirrorsFlamesScenario } from "./smokeAndMirrorsFlames";
import { fakeSpreadingFlamesScenario } from "./fakeSpread";
import { queenOfAshScenario } from "./queenOfAsh";

export const scenarios = [spreadingFlamesScenario, smokeAndMirrorsQuietScenario, smokeAndMirrorsFlamesScenario, fakeSpreadingFlamesScenario, queenOfAshScenario];
export const defaultScenarioId = spreadingFlamesScenario.id;
