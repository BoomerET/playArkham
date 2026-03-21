import type { ChaosToken } from "../types/game";

export function getChaosTokenModifier(token: ChaosToken): number {
  if (typeof token === "number") {
    return token;
  }

  switch (token) {
    case "elderSign":
      return 2;
    case "autoFail":
      return -999;
    case "skull":
      return -1;
    case "cultist":
      return -2;
    case "tablet":
      return -2;
    case "elderThing":
      return -3;
    default:
      return 0;
  }
}

