import { beforeEach, describe, expect, test } from "vitest";
import { useGameStore } from "./gameStore";

describe("gameStore setup", () => {
  beforeEach(() => {
    useGameStore.setState({
      screen: "home",
      selectedInvestigatorId: "roland-banks",
      deck: [],
      hand: [],
      discard: [],
      playArea: [],
      log: [],
      lastSkillTest: null,
      draggedCardId: null,
      turn: {
        round: 1,
        phase: "setup",
        actionsRemaining: 3,
      },
    });
  });

  test("startGame sets round 1 to investigation and skips mythos", () => {
    const store = useGameStore.getState();

    store.startGame();

    const state = useGameStore.getState();

    expect(state.screen).toBe("game");
    expect(state.turn.round).toBe(1);
    expect(state.turn.phase).toBe("investigation");
    expect(state.turn.actionsRemaining).toBe(3);
    expect(state.hand.length).toBe(5);
    expect(state.log).toContain("First round: Mythos phase is skipped.");
  });
});

