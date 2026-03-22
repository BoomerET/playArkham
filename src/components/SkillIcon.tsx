import type { SVGProps } from "react";
import type { SkillIconType } from "./skillIconUtils";

interface SkillIconProps extends SVGProps<SVGSVGElement> {
  skill: SkillIconType;
  title?: string;
}

function BaseSvg({
  children,
  title,
  ...props
}: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

function BrainIcon(props: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <BaseSvg {...props}>
      <path
        d="M9.2 5.2C9.8 3.9 11 3 12.4 3c1.1 0 2.2.6 2.8 1.6 1.4 0 2.8 1.1 3.1 2.7.8.4 1.4 1.3 1.4 2.3 0 .8-.3 1.5-.9 2 .3.5.4 1 .4 1.6 0 1.8-1.3 3.2-3 3.5-.5 1.4-1.8 2.3-3.3 2.3-1 0-1.9-.4-2.6-1.1-.6.7-1.5 1.1-2.5 1.1-1.8 0-3.2-1.2-3.5-2.9C3.5 15.7 3 14.7 3 13.6c0-.8.3-1.5.7-2.1C3.3 10.9 3 10.3 3 9.6c0-1.3.9-2.4 2.1-2.8.4-1.5 1.7-2.6 3.3-2.6.3 0 .5 0 .8.1Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </BaseSvg>
  );
}

function BookIcon(props: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <BaseSvg {...props}>
      <path
        d="M5 4.5h9.5c2.5 0 4 1.4 4 3.8v10.2H9c-2.5 0-4-1.4-4-3.8V4.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </BaseSvg>
  );
}

function FistIcon(props: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <BaseSvg {...props}>
      <path
        d="M8.5 10V6.7c0-.9.7-1.7 1.6-1.7s1.6.8 1.6 1.7V9"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </BaseSvg>
  );
}

function FootIcon(props: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <BaseSvg {...props}>
      <path
        d="M13.8 4.2c1.1 1.8 1.1 4.1.7 5.8"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </BaseSvg>
  );
}

export default function SkillIcon({ skill, ...props }: SkillIconProps) {
  switch (skill) {
    case "willpower":
      return <BrainIcon {...props} />;
    case "intellect":
      return <BookIcon {...props} />;
    case "combat":
      return <FistIcon {...props} />;
    case "agility":
      return <FootIcon {...props} />;
    default:
      return null;
  }
}
