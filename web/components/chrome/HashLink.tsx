"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/* Chrome is shared by every route, but a "#conditions" anchor only resolves on the
   home page. Sub-pages need "/#conditions". build-pages.py did this rewrite at build
   time; here the link resolves itself from the route it renders on.

   Both cases go through next/link, including the same-page hash. A plain <a> would
   scroll just as well, but the history entry it pushes belongs to the browser rather
   than the router: navigating on from it and pressing Back then restored the URL
   without re-rendering the page, leaving the previous route on screen. */

type Props = {
  hash: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
};

export function HashLink({ hash, className, onClick, children }: Props) {
  const isHome = usePathname() === "/";

  return (
    <Link className={className} href={isHome ? `#${hash}` : `/#${hash}`} onClick={onClick}>
      {children}
    </Link>
  );
}

/* The brand mark points at the top of the home page from the home page, and at the
   home page itself from anywhere else. */
export function BrandLink({ className, children }: Omit<Props, "hash">) {
  const isHome = usePathname() === "/";

  return (
    <Link
      className={className}
      href={isHome ? "#top" : "/"}
      aria-label="BodyForge Physical Therapy, home"
    >
      {children}
    </Link>
  );
}
