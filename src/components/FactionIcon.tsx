import type { Faction } from "../types/game";

type FactionIconProps = {
  faction: Faction;
  className?: string;
};

export default function FactionIcon({
  faction,
  className = "",
}: FactionIconProps) {
  const classes = `faction-icon-svg ${className}`.trim();

  switch (faction) {
    case "guardian":
      return (
        <svg
          className={classes}
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l7 3v5c0 5-3.3 8.7-7 10-3.7-1.3-7-5-7-10V6l7-3z" />
          <path d="M12 7v9" />
          <path d="M8.5 11.5H15.5" />
        </svg>
      );

    case "seeker":
      return (
        <svg
          className={classes}
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="10.5" cy="10.5" r="5.5" />
          <path d="M15 15l4.5 4.5" />
          <path d="M10.5 8v5" />
          <path d="M8 10.5h5" />
        </svg>
      );

    case "mystic":
      return (
        <svg
          className={classes}
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l2.2 4.6L19 10l-4.8 2.4L12 17l-2.2-4.6L5 10l4.8-2.4L12 3z" />
          <circle cx="12" cy="10" r="2.2" />
        </svg>
      );

    case "rogue":
      return (
        <svg
          className={classes}
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 4l6 6-8.5 8.5H5.5V13L14 4z" />
          <path d="M12 6l6 6" />
        </svg>
      );

    case "survivor":
      return (
        <svg
          className={classes}
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3c2.5 2 4.5 4.5 4.5 7.2A4.5 4.5 0 0 1 12 14.7a4.5 4.5 0 0 1-4.5-4.5C7.5 7.5 9.5 5 12 3z" />
          <path d="M12 14.7V21" />
          <path d="M9 18h6" />
        </svg>
      );

    case "neutral":
    default:
      return (
        <svg
          className={classes}
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="7" />
          <path d="M9 12h6" />
        </svg>
      );
  }
}

