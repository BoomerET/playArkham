import type { SVGProps } from "react";
import type { ChaosToken } from "../types/game";

import ElderSignIcon from "../assets/chaos-icons/elder-sign.svg?react";
import AutoFailIcon from "../assets/chaos-icons/auto-fail.svg?react";
import SkullIcon from "../assets/chaos-icons/skull.svg?react";
import CultistIcon from "../assets/chaos-icons/cultist.svg?react";
import TabletIcon from "../assets/chaos-icons/tablet.svg?react";
import ElderThingIcon from "../assets/chaos-icons/elder-thing.svg?react";

interface ChaosTokenIconProps extends SVGProps<SVGSVGElement> {
  token: ChaosToken;
  title?: string;
}

export default function ChaosTokenIcon({
  token,
  title,
  className,
  ...props
}: ChaosTokenIconProps) {
  const sharedProps = {
    className,
    "aria-label": title ?? String(token),
    role: "img" as const,
    ...props,
  };

  switch (token) {
    case "elderSign":
      return <ElderSignIcon {...sharedProps} />;
    case "autoFail":
      return <AutoFailIcon {...sharedProps} />;
    case "skull":
      return <SkullIcon {...sharedProps} />;
    case "cultist":
      return <CultistIcon {...sharedProps} />;
    case "tablet":
      return <TabletIcon {...sharedProps} />;
    case "elderThing":
      return <ElderThingIcon {...sharedProps} />;
    default:
      return null;
  }
}

