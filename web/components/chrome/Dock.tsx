"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE, mailHref, telHref } from "@/content/site";
import { MailIcon, PhoneIcon } from "@/components/icons";

/* The sticky mobile action bar. It rises once the hero has scrolled away and stands
   down over the contact section, where the same number is already on screen. */

/* Keyed on the route so it remounts with fresh state. The hero and booking sections it
   watches belong to the page, not the layout, so after a client-side navigation they
   are different elements — and the raised/lowered state from the previous page must
   not carry over. */
export function Dock() {
  return <DockBar key={usePathname()} />;
}

function DockBar() {
  const [up, setUp] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero") ?? document.querySelector(".phero");
    if (!hero) return;

    let pastHero = false;
    let atBook = false;
    const sync = () => setUp(pastHero && !atBook);

    const heroObs = new IntersectionObserver(
      ([en]) => {
        pastHero = !en.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    heroObs.observe(hero);

    const book = document.querySelector("#book");
    const bookObs = book
      ? new IntersectionObserver(
          ([en]) => {
            atBook = en.isIntersecting;
            sync();
          },
          { threshold: 0.12 },
        )
      : null;
    bookObs?.observe(book!);

    return () => {
      heroObs.disconnect();
      bookObs?.disconnect();
    };
  }, []);

  return (
    <div className={`dock${up ? " is-up" : ""}`} id="dock" aria-hidden="false">
      <a className="btn btn--primary" href={telHref}>
        <PhoneIcon />
        Call {SITE.phoneLabel}
      </a>
      <a className="btn btn--ghost" href={mailHref} aria-label="Email the clinic">
        <MailIcon />
      </a>
    </div>
  );
}
