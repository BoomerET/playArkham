import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { getFactionClassName } from "../../lib/ui";
import { useGameStore } from "../../store/gameStore";
import type { GameLocation } from "../../types/game";
import "./locationCard.css";

interface Props {
  location: GameLocation;
}

const locationImages = import.meta.glob(
  "../../assets/images/locations/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

function useModifierKey(key: "Alt" | "Shift") {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        setActive(true);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === key) {
        setActive(false);
      }
    };

    const onWindowBlur = () => {
      setActive(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onWindowBlur);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, [key]);

  return active;
}

function formatName(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function slugifyName(value: string): string {
  return value
    .toLowerCase()
    .replace(/['".,!?]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getLocationImageUrl(location: GameLocation): string | null {
  const candidates = [
    (location as GameLocation & { code?: string }).code ?? "",
    location.id,
    slugifyName(location.name),
  ]
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const match = Object.entries(locationImages).find(([path]) => {
    const fileName = path.split("/").pop()?.toLowerCase() ?? "";
    const baseName = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, "");
    return candidates.includes(baseName);
  });

  return match?.[1] ?? null;
}

function getEnemyTokenLabel(name: string): string {
  const words = name.split(" ").filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

function getInvestigatorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  const first = parts[0][0] ?? "";
  const last = parts[parts.length - 1][0] ?? "";

  return `${first}${last}`.toUpperCase();
}

type PreviewLocation = {
  id: string;
  name: string;
  imageUrl: string;
};

export default function LocationCard({ location }: Props) {
  const moveInvestigator = useGameStore((state) => state.moveInvestigator);
  const investigator = useGameStore((state) => state.investigator);
  const locations = useGameStore((state) => state.locations);
  const enemies = useGameStore((state) => state.enemies);
  const availableInvestigators = useGameStore(
    (state) => state.availableInvestigators,
  );

  const [isRevealAnimating, setIsRevealAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const wasRevealedRef = useRef(location.revealed);
  const zoomHeld = useModifierKey("Shift");

  useEffect(() => {
    if (!wasRevealedRef.current && location.revealed) {
      const startTimeout = window.setTimeout(() => {
        setIsRevealAnimating(true);
      }, 0);

      const endTimeout = window.setTimeout(() => {
        setIsRevealAnimating(false);
      }, 500);

      wasRevealedRef.current = true;

      return () => {
        window.clearTimeout(startTimeout);
        window.clearTimeout(endTimeout);
      };
    }

    wasRevealedRef.current = location.revealed;
  }, [location.revealed]);

  const imageUrl = getLocationImageUrl(location);

  const previewLocation = useMemo<PreviewLocation | null>(() => {
    if (!zoomHeld || !isHovering || !imageUrl) {
      return null;
    }

    return {
      id: location.id,
      name: location.name,
      imageUrl,
    };
  }, [zoomHeld, isHovering, imageUrl, location.id, location.name]);

  const isCurrentLocation = location.investigatorsHere.includes(
    investigator.id,
  );

  const currentLocation = locations.find((current) =>
    current.investigatorsHere.includes(investigator.id),
  );

  const isLegalMove =
    !!currentLocation &&
    currentLocation.id !== location.id &&
    currentLocation.connections.includes(location.id);

  const isIllegalMove =
    !!currentLocation &&
    currentLocation.id !== location.id &&
    !currentLocation.connections.includes(location.id);

  const enemiesHere = enemies.filter(
    (enemy) =>
      enemy.locationId === location.id && enemy.engagedInvestigatorId === null,
  );

  function getInvestigatorData(id: string) {
    return availableInvestigators.find((item) => item.id === id);
  }

  function handleClick() {
    if (isLegalMove) {
      moveInvestigator(location.id);
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if ((event.key === "Enter" || event.key === " ") && isLegalMove) {
      event.preventDefault();
      moveInvestigator(location.id);
    }
  }

  const locationStateClass = isCurrentLocation
    ? "current-location"
    : isLegalMove
      ? "legal-location"
      : isIllegalMove
        ? "illegal-location"
        : "";

  const isInteractive = isLegalMove;
  const hasInvestigators = location.investigatorsHere.length > 0;
  const hasEnemies = enemiesHere.length > 0;

  return (
    <>
      <div
        className={`entity-card location-card location-card-compact location-card-tight ${location.revealed ? "location-card-revealed" : "location-card-hidden"
          } ${isRevealAnimating ? "location-card-reveal-animating" : ""} ${locationStateClass} ${isInteractive ? "clickable-location" : "static-location"
          }`}
        onClick={isInteractive ? handleClick : undefined}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : -1}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        aria-label={isInteractive ? `Move to ${location.name}` : undefined}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          className={`card-zoom-hint ${isHovering ? "visible" : ""} ${zoomHeld ? "active" : ""
            }`}
        >
          Hold <kbd>Shift</kbd> to zoom
        </div>

        {location.revealed ? (
          <>
            {imageUrl ? (
              <div className="location-card-image-shell">
                <img
                  src={imageUrl}
                  alt={location.name}
                  className="location-card-image"
                  draggable={false}
                />
              </div>
            ) : null}

            <div className="location-card-header">
              <p className="entity-title location-card-title">{location.name}</p>

              <div className="location-card-stats">
                <span className="token-chip gold">S {location.shroud}</span>
                <span className="token-chip gold">C {location.clues}</span>
              </div>
            </div>

            <div className="location-card-status-row token-row">
              {isCurrentLocation && (
                <span className="token-chip success">Current</span>
              )}
              {isLegalMove && <span className="token-chip">Move</span>}
              {isIllegalMove && (
                <span className="token-chip danger">Blocked</span>
              )}
            </div>

            {(hasInvestigators || hasEnemies) && (
              <div className="location-card-presence">
                {hasInvestigators && (
                  <div className="location-card-presence-block">
                    <p className="location-card-mini-label">Investigators</p>
                    <div className="location-investigator-token-row">
                      {location.investigatorsHere.map((id) => {
                        const data = getInvestigatorData(id);
                        const fullName = data?.name ?? formatName(id);
                        const factionClass = data
                          ? getFactionClassName(data.faction)
                          : "faction-neutral";

                        return (
                          <div
                            key={id}
                            className={`location-investigator-token ${factionClass}`}
                            title={fullName}
                            aria-label={fullName}
                          >
                            <span className="location-investigator-token-initials">
                              {getInvestigatorInitials(fullName)}
                            </span>

                            {id === investigator.id && (
                              <span
                                className="location-investigator-token-active-ring"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {hasEnemies && (
                  <div className="location-card-presence-block">
                    <p className="location-card-mini-label">Enemies</p>
                    <div className="location-enemy-token-row">
                      {enemiesHere.map((enemy) => (
                        <div
                          key={enemy.id}
                          className={`location-enemy-token ${enemy.exhausted
                            ? "location-enemy-token-exhausted"
                            : ""
                            }`}
                          title={`${enemy.name} • ${enemy.damageOnEnemy}/${enemy.health} damage${enemy.exhausted ? " • exhausted" : ""
                            }`}
                          aria-label={enemy.name}
                        >
                          <span
                            className="location-enemy-token-skull"
                            aria-hidden="true"
                          >
                            ☠
                          </span>
                          <span className="location-enemy-token-label">
                            {getEnemyTokenLabel(enemy.name)}
                          </span>

                          {enemy.damageOnEnemy > 0 && (
                            <span className="location-enemy-token-damage">
                              {enemy.damageOnEnemy}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="location-card-hidden-face">
            <p className="location-card-hidden-label">Unrevealed</p>
            <div className="location-card-hidden-art" aria-hidden="true">
              <span className="location-card-hidden-glyph">?</span>
            </div>
            <p className="location-card-hidden-name">{location.name}</p>
          </div>
        )}
      </div>

      {previewLocation &&
        createPortal(
          <div className="card-preview-overlay" aria-hidden="true">
            <div className="card-preview-frame">
              <img
                src={previewLocation.imageUrl}
                alt={previewLocation.name}
                className="card-preview-image"
                draggable={false}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
