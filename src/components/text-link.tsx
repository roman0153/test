import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export function TextLink({ href, children, light = false, className = "" }: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={`text-link ${light ? "text-link--light" : ""} ${className}`}>
      <span>{children}</span><ArrowIcon />
    </Link>
  );
}