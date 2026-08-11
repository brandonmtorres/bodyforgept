"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* Reveal-on-scroll, ported whole rather than split per component.

   The stagger is per section and depends on document order, so it has to be computed
   over the rendered DOM; deriving the same ordering from a tree of React components
   would be guesswork. This runs the static build's logic against the markup React
   produced, which keeps the behaviour identical.

   The hiding rule is `.js .rv`, so `.rv` in the markup is inert until the inline
   script in layout.tsx sets `.js` on <html>. A blocked or failed script therefore
   leaves the page fully visible, which is the property the static build had.

   Keyed on the pathname: this component lives in the layout, which does not remount
   between routes, so with an empty dependency list it observed the first page only.
   Every later route rendered its markup with `.rv` already applied and nothing ever
   adding `.is-in` — navigating back to the home page left the hero at opacity 0. */

const REVEAL_TARGETS = [
  ".approach__top > *",
  ".approach__fig",
  ".incl li",
  ".cond__top > *",
  ".cond__tabs",
  ".cond__panels",
  ".cond__note",
  ".svc__h",
  ".row__fig",
  ".row__body",
  ".rec__top > *",
  ".rec__chips",
  ".rec__fig",
  ".rec__why li",
  ".price",
  ".rec__offer .menu",
  ".rec__act",
  ".doc__fig",
  ".doc__body > *",
  ".team",
  ".res__h",
  ".tst",
  ".book__aside > *",
  ".book__panel",
  ".visit__col > *",
  ".ft__brand",
  ".ft__nav > div",
  /* service pages */
  ".phero__copy > *",
  ".fourway article",
  ".incl-strip li",
  ".incl--ink li",
  ".rates__lead",
  ".rate__r",
  ".claim",
  ".road > li",
  ".rel__i",
  ".cta__in > *",
  /* the split layouts: the text column and its figure had no coverage at all, so
     "02" on strength, sports rehab and Pilates arrived with no motion while every
     section around them animated */
  ".split > div > h2",
  ".split > div > .lead",
  ".split > div > .note",
  ".split__fig",
  ".doc__facts li",
  ".chips--ink li",
  /* the full-bleed tagline band between conditions and services */
  ".band__t",
].join(",");

export function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll<HTMLElement>(REVEAL_TARGETS).forEach((el) => {
      el.classList.add("rv");
    });

    const all = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    const roads = Array.from(document.querySelectorAll<HTMLElement>("[data-road]"));

    if (reduce) {
      all.forEach((el) => el.classList.add("is-in"));
      roads.forEach((el) => el.classList.add("is-in"));
      return;
    }

    /* Anything already on screen is revealed in this pass rather than waiting for the
       observer's first callback, which lands after a paint. On a client-side
       navigation that paint is the one the reader is looking at, so without this the
       top of the new page flickers in. */
    const stagger = new WeakMap<Element, number>();
    const reveal = (el: HTMLElement) => {
      const sec = el.closest("section, footer, aside") ?? document.body;
      const n = stagger.get(sec) ?? 0;
      el.style.setProperty("--d", String(el.dataset.rv ?? Math.min(n, 4)));
      stagger.set(sec, n + 1);
      el.classList.add("is-in");
    };

    const pending: HTMLElement[] = [];
    for (const el of all) {
      /* Anything that starts above the fold is revealed now — not just what overlaps
         the viewport. An element already scrolled past never intersects again, so
         observing it would leave it invisible for good; that is reachable by
         navigating and flicking down before this effect runs. Only what is genuinely
         still below the fold is left to the observer. */
      if (el.getBoundingClientRect().top < innerHeight) reveal(el);
      else pending.push(el);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          reveal(en.target as HTMLElement);
          observer.unobserve(en.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    pending.forEach((el) => observer.observe(el));

    /* the ember line runs left to right and each phase marker lights as it arrives.
       CSS owns the timing; this only says "you can start now". */
    const roadObservers = roads.map((road) => {
      const ob = new IntersectionObserver(
        (en) => {
          if (en[0].isIntersecting) {
            road.classList.add("is-in");
            ob.disconnect();
          }
        },
        { threshold: 0.25 },
      );
      ob.observe(road);
      return ob;
    });

    return () => {
      observer.disconnect();
      roadObservers.forEach((ob) => ob.disconnect());
    };
  }, [pathname]);

  return null;
}
