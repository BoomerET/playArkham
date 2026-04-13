import { spreadingFlamesScenario } from "./spreadingFlames";
import { smokeAndMirrorsQuietScenario } from "./smokeAndMirrorsQuiet";
import { smokeAndMirrorsFlamesScenario } from "./smokeAndMirrorsFlames";
import { fakeSpreadingFlamesScenario } from "./fakeSpread";

export const scenarios = [spreadingFlamesScenario, smokeAndMirrorsQuietScenario, smokeAndMirrorsFlamesScenario, fakeSpreadingFlamesScenario];
export const defaultScenarioId = spreadingFlamesScenario.id;
