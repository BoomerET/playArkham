import { useEffect, useMemo, useRef, useState } from "react";
import type { ChaosToken } from "../../types/game";
import { useGameStore } from "../../store/gameStore";

type RevealState = "idle" | "drawing" | "revealed";

function formatToken(token: ChaosToken | null): string {
  if (token === null) {
    return "None";
  }

  if (token === "autoFail") {
    return "Auto-Fail";
  }

  if (token === "elderSign") {
    return "Elder Sign";
  }

  return String(token);
}

function getTokenModifier(token: ChaosToken | null): string {
  if (token === null) {
    return "";
  }

  if (token === "autoFail") {
    return "FAIL";
  }

  if (token === "elderSign") {
    return "★";
  }

  const numericValue = Number(token);

  if (Number.isNaN(numericValue)) {
    return String(token);
  }

  return numericValue >= 0 ? `+${numericValue}` : String(numericValue);
}

function getTokenClassName(token: ChaosToken | null): string {
  if (token === null) {
    return "chaos-token-neutral";
  }

  if (token === "autoFail") {
    return "chaos-token-autofail";
  }

  if (token === "elderSign") {
    return "chaos-token-eldersign";
  }

  const numericValue = Number(token);

  if (!Number.isNaN(numericValue)) {
    if (numericValue >= 0) {
      return "chaos-token-positive";
    }

    return "chaos-token-negative";
  }

  return "chaos-token-neutral";
}

export default function ChaosBagPanel() {
  const drawChaosToken = useGameStore((state) => state.drawChaosToken);
  const chaosBag = useGameStore((state) => state.chaosBag);
  const lastSkillTest = useGameStore((state) => state.lastSkillTest);

  const [lastDraw, setLastDraw] = useState<ChaosToken | null>(null);
  const [displayToken, setDisplayToken] = useState<ChaosToken | null>(null);
  const [revealState, setRevealState] = useState<RevealState>("idle");
  const [resultPulse, setResultPulse] = useState<"success" | "failure" | null>(
    null,
  );

  const lastAnimatedSkillTestRef = useRef<string | null>(null);

  useEffect(() => {
    if (!lastSkillTest) {
      return;
    }

    const skillTestKey = [
      lastSkillTest.source,
      lastSkillTest.skill,
      lastSkillTest.difficulty,
      lastSkillTest.finalValue,
      lastSkillTest.success,
      lastSkillTest.token,
    ].join("|");

    if (lastAnimatedSkillTestRef.current === skillTestKey) {
      return;
    }

    lastAnimatedSkillTestRef.current = skillTestKey;

    const startTimeout = window.setTimeout(() => {
      setDisplayToken(null);
      setRevealState("drawing");
      setResultPulse(null);
    }, 0);

    const revealTimeout = window.setTimeout(() => {
      setDisplayToken(lastSkillTest.token);
      setLastDraw(lastSkillTest.token);
      setRevealState("revealed");
      setResultPulse(lastSkillTest.success ? "success" : "failure");
    }, 320);

    const pulseTimeout = window.setTimeout(() => {
      setResultPulse(null);
    }, 1200);

    return () => {
      window.clearTimeout(startTimeout);
      window.clearTimeout(revealTimeout);
      window.clearTimeout(pulseTimeout);
    };
  }, [lastSkillTest]);

  function handleDraw() {
    setDisplayToken(null);
    setRevealState("drawing");
    setResultPulse(null);

    const token = drawChaosToken();

    window.setTimeout(() => {
      setLastDraw(token);
      setDisplayToken(token);
      setRevealState("revealed");
    }, 320);
  }

  const shownToken = displayToken ?? lastDraw;

  const tokenLabel = useMemo(() => formatToken(shownToken), [shownToken]);
  const tokenModifierLabel = useMemo(
    () => getTokenModifier(shownToken),
    [shownToken],
  );
  const tokenClassName = useMemo(
    () => getTokenClassName(shownToken),
    [shownToken],
  );

  return (
    <section className="game-panel chaos-bag-panel">
      <div className="chaos-bag-header">
        <div>
          <p className="chaos-bag-kicker">Chaos Bag</p>
          <h2 className="chaos-bag-title">Draw Token</h2>
          <p className="panel-subtitle">
            Pull from the bag and tempt the unknown.
          </p>
        </div>
      </div>

      <div className="chaos-bag-layout">
        <div className="chaos-bag-stats">
          <div className="stat-box">
            <span className="stat-label">Tokens</span>
            <span className="stat-value">{chaosBag.length}</span>
          </div>

          <div className="stat-box">
            <span className="stat-label">Last Draw</span>
            <span className="stat-value">{formatToken(lastDraw)}</span>
          </div>
        </div>

        <div
          className={`chaos-token-display ${tokenClassName} ${
            revealState === "drawing" ? "chaos-token-drawing" : ""
          } ${
            revealState === "revealed" ? "chaos-token-revealed" : ""
          } ${
            resultPulse === "success" ? "chaos-token-success-pulse" : ""
          } ${
            resultPulse === "failure" ? "chaos-token-failure-pulse" : ""
          }`}
          aria-live="polite"
        >
          <div className="chaos-token-face">
            {revealState === "drawing" ? (
              <>
                <span className="chaos-token-question">?</span>
                <span className="chaos-token-caption">Drawing…</span>
              </>
            ) : (
              <>
                <span className="chaos-token-symbol">
                  {tokenModifierLabel || "—"}
                </span>
                <span className="chaos-token-caption">{tokenLabel}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {lastSkillTest && revealState === "revealed" && (
        <div
          className={`chaos-test-result ${
            lastSkillTest.success
              ? "chaos-test-result-success"
              : "chaos-test-result-failure"
          }`}
        >
          <strong>{lastSkillTest.success ? "Success" : "Failure"}</strong>
          <span>
            Final {lastSkillTest.finalValue} vs Difficulty{" "}
            {lastSkillTest.difficulty}
          </span>
        </div>
      )}

      <div className="button-row chaos-bag-actions">
        <button onClick={handleDraw}>Draw Token</button>
      </div>
    </section>
  );
}
