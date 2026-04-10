import type { SVGProps } from "react";
import type { SkillIconType } from "./skillIconUtils";

import BrainIcon from "../assets/skill-icons/brain.svg?react";
import BookIcon from "../assets/skill-icons/book.svg?react";
import FistIcon from "../assets/skill-icons/fist.svg?react";
import FootIcon from "../assets/skill-icons/foot.svg?react";

interface SkillIconProps extends SVGProps<SVGSVGElement> {
  skill: SkillIconType;
  title?: string;
}

export default function SkillIcon({
  skill,
  title,
  className,
  ...props
}: SkillIconProps) {
  const sharedProps = {
    className,
    "aria-label": title ?? skill,
    role: "img" as const,
    ...props,
  };

  switch (skill) {
    case "willpower":
      return <BrainIcon {...sharedProps} />;
    case "intellect":
      return <BookIcon {...sharedProps} />;
    case "combat":
      return <FistIcon {...sharedProps} />;
    case "agility":
      return <FootIcon {...sharedProps} />;
    case "wild":
      return (
        <svg viewBox="0 0 24 24" {...sharedProps}>
          <text x="12" y="16" textAnchor="middle" fontSize="18">
            ?
          </text>
        </svg>
      );
    default:
      return null;
  }
}
