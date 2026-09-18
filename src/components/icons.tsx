import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function LeafMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 44" fill="none" aria-hidden="true" {...props}>
      <path d="M16 3C11 9 5 15 5 22a11 11 0 0 0 22 0C27 15 21 9 16 3Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 4v37M6 18l10 10 9-12M16 19l6-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="m6 6 12 12M6 18 18 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ServiceIcon({ name, ...props }: IconProps & { name: string }) {
  if (name === "navrh") return <LeafMark {...props} />;
  return (
    <svg viewBox="0 0 40 44" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {name === "realizacia" && <path d="M12 7h16v8H12zM4 15h16v8H4zM20 15h16v8H20zM12 23h16v8H12zM5 37h30M20 31v6" />}
      {name === "udrzba" && <><path d="M20 39V17m0 16C9 33 5 25 5 21c9 0 15 4 15 12Zm0-5c11 0 15-8 15-12-9 0-15 4-15 12ZM20 19c-8-5-7-11 0-16 7 5 8 11 0 16Z" /><path d="m11 26 9 7 9-11" /></>}
      {name === "zavlahy" && <><path d="M20 3C16 11 8 19 8 26a12 12 0 0 0 24 0C32 19 24 11 20 3Z" /><path d="M13 26a7 7 0 0 0 7 7" /></>}
    </svg>
  );
}