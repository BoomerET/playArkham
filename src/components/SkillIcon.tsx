import type { SVGProps } from "react";

export type SkillIconType =
  | "willpower"
  | "intellect"
  | "combat"
  | "agility";

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
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 6.6c-.8.2-1.5.9-1.7 1.8M8.5 10.1c-.9.2-1.6 1-1.6 2M12 5.2v13.6M14 6.3c.9.3 1.6 1 1.8 2M15.8 10.2c1 .2 1.7 1 1.7 2.1M10.2 14.1c-.8.1-1.5.7-1.7 1.5M13.8 14.1c.9.1 1.6.7 1.8 1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
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
        strokeLinejoin="round"
      />
      <path
        d="M5 4.5v10.2c0 2.4 1.5 3.8 4 3.8M8.5 7h6.5M8.5 10h6.5M8.5 13h4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </BaseSvg>
  );
}

function FistIcon(props: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <BaseSvg {...props}>
      <path
        d="M8.5 10V6.7c0-.9.7-1.7 1.6-1.7s1.6.8 1.6 1.7V9M11.7 9V5.9c0-.9.7-1.7 1.6-1.7s1.6.8 1.6 1.7V9.4M14.9 9.4V7.1c0-.9.7-1.7 1.6-1.7S18 6.2 18 7.1v5.1c0 4.4-2.8 7.3-6.9 7.3-3.9 0-6.1-2.3-6.1-5.8v-2.4c0-1 .8-1.8 1.8-1.8s1.7.7 1.7 1.7V13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </BaseSvg>
  );
}

function FootIcon(props: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <BaseSvg {...props}>
      <path
        d="M13.8 4.2c1.1 1.8 1.1 4.1.7 5.8-.3 1.2-.8 2.2-1.1 3.4-.4 1.5.1 2.6 1.2 3.4 1 .8 1.8 1.7 1.8 3 0 1.2-.9 2-2.1 2-1.5 0-3-.7-4.6-.7-1.5 0-2.9.7-4.3.7-1.4 0-2.3-.9-2.3-2.1 0-1.9 1.8-3.2 3.5-3.8 1.7-.6 2.7-1.7 3.1-3.4.3-1.2.1-2.5.3-3.8.3-2 1.4-3.7 3.8-4.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="15.6" cy="5.4" r="1" fill="currentColor" />
      <circle cx="17.6" cy="6.8" r="1" fill="currentColor" />
      <circle cx="18.5" cy="9.1" r="0.95" fill="currentColor" />
      <circle cx="17.9" cy="11.4" r="0.9" fill="currentColor" />
    </BaseSvg>
  );
}

export function normalizeSkillIcon(value: string): SkillIconType | null {
  const normalized = value.trim().toLowerCase();

  if (
    normalized === "willpower" ||
    normalized === "intellect" ||
    normalized === "combat" ||
    normalized === "agility"
  ) {
    return normalized;
  }

  return null;
}

export default function SkillIcon({
  skill,
  title,
  className,
  ...props
}: SkillIconProps) {
  const sharedProps = {
    className,
    title,
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
    default:
      return null;
  }
}
