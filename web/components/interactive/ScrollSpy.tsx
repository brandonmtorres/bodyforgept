"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* Marks the primary nav link for whichever section is in the reading band.

   Off the home page the nav links are "/#approach", which is not a valid selector and
   has no target on the current document, so only sections that actually exist here
   are spied on. */

export function ScrollSpy() {
  /* re-run per route: this lives in the layout, which does not remount, so the
     sections it spies on have to be re-collected when the page underneath changes */
  const pathname = usePathname();

  useEffect(() => {
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav a"));
    navLinks.forEach((a) => a.classList.remove("is-here"));

    const localHash = (a: HTMLAnchorElement) => {
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("#")) return href;
      if (href.startsWith("/#")) return href.slice(1);
      return null;
    };

    const spied = navLinks
      .map((a) => {
        const h = localHash(a);
        return h && h.length > 1 ? document.querySelector(h) : null;
      })
      .filter((el): el is Element => Boolean(el));

    if (!spied.length) return;

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          navLinks.forEach((a) =>
            a.classList.toggle("is-here", localHash(a) === `#${en.target.id}`),
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    spied.forEach((s) => spy.observe(s));

    return () => spy.disconnect();
  }, [pathname]);

  return null;
}
