import type { ReactNode } from "react";
import actionIcon from "../assets/icons/arkham/action.svg";
import doubleActionIcon from "../assets/icons/arkham/double-action.svg";
import reactionIcon from "../assets/icons/arkham/reaction.svg";
import freeIcon from "../assets/icons/arkham/free.svg";
import "./renderCardText.css";

function renderInlineFormatting(text: string): ReactNode[] {
  const parts = text.split(/(<i>.*?<\/i>)/gi);

  return parts.map((part, index) => {
    const italicMatch = part.match(/^<i>(.*?)<\/i>$/i);

    if (italicMatch) {
      return (
        <em key={`italic-${index}`} className="card-text-emphasis">
          {italicMatch[1]}
        </em>
      );
    }

    return <span key={`text-${index}`}>{part}</span>;
  });
}

function getAbilityPrefix(line: string):
  | { kind: "action"; rest: string }
  | { kind: "double-action"; rest: string }
  | { kind: "reaction"; rest: string }
  | { kind: "free"; rest: string }
  | null {
  if (line.startsWith("Action::")) {
    return {
      kind: "double-action",
      rest: line.slice("Action::".length).trim(),
    };
  }

  if (line.startsWith("Action:")) {
    return {
      kind: "action",
      rest: line.slice("Action:".length).trim(),
    };
  }

  if (line.startsWith("Reaction:")) {
    return {
      kind: "reaction",
      rest: line.slice("Reaction:".length).trim(),
    };
  }

  if (line.startsWith("Free:")) {
    return {
      kind: "free",
      rest: line.slice("Free:".length).trim(),
    };
  }

  return null;
}

function getAbilityIcon(kind: "action" | "double-action" | "reaction" | "free") {
  switch (kind) {
    case "double-action":
      return doubleActionIcon;
    case "reaction":
      return reactionIcon;
    case "free":
      return freeIcon;
    case "action":
    default:
      return actionIcon;
  }
}

function getAbilityLabel(kind: "action" | "double-action" | "reaction" | "free") {
  switch (kind) {
    case "double-action":
      return "Double Action";
    case "reaction":
      return "Reaction";
    case "free":
      return "Free Trigger";
    case "action":
    default:
      return "Action";
  }
}

export function renderCardText(text: string): ReactNode {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="card-rules-text">
      {lines.map((line, index) => {
        const prefix = getAbilityPrefix(line);

        if (!prefix) {
          return (
            <p key={`line-${index}`} className="card-rules-line">
              {renderInlineFormatting(line)}
            </p>
          );
        }

        return (
          <p key={`line-${index}`} className="card-rules-line card-rules-line-ability">
            <span
              className={`card-ability-badge card-ability-badge-${prefix.kind}`}
              title={getAbilityLabel(prefix.kind)}
              aria-label={getAbilityLabel(prefix.kind)}
            >
              <img
                src={getAbilityIcon(prefix.kind)}
                alt=""
                className="card-ability-icon"
              />
            </span>
            <span className="card-rules-line-text">
              {renderInlineFormatting(prefix.rest)}
            </span>
          </p>
        );
      })}
    </div>
  );
}
