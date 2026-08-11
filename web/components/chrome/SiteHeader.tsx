"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SERVICES, SITE, mailHref, telHref } from "@/content/site";
import { ArrowIcon, ChevronIcon, PhoneIcon } from "@/components/icons";
import { Brand } from "./Brand";
import { HashLink } from "./HashLink";

/* Header and mobile nav ship together because the burger owns both. The markup is
   the static build's, one for one; only the wiring is React. */

export function SiteHeader() {
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);

  const burgerRef = useRef<HTMLButtonElement>(null);
  const svcBtnRef = useRef<HTMLButtonElement>(null);
  const svcGroupRef = useRef<HTMLDivElement>(null);

  /* ── header lifts off the page once you leave the very top ── */
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  /* ── the open menu owns the viewport, so the page behind it must not scroll ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* ── crossing into desktop drops the mobile menu rather than stranding it ── */
  useEffect(() => {
    const mq = matchMedia("(min-width: 1060px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* ── escape closes whichever is open and returns focus to its trigger ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (svcOpen) {
        setSvcOpen(false);
        svcBtnRef.current?.focus();
      } else if (menuOpen) {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [menuOpen, svcOpen]);

  /* ── a click anywhere outside the services group closes it ── */
  useEffect(() => {
    if (!svcOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!svcGroupRef.current?.contains(e.target as Node)) setSvcOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [svcOpen]);

  /* ── tabbing out of the group closes it too ── */
  const onSvcFocusOut = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setSvcOpen(false);
  }, []);

  return (
    <>
      <header className={`hdr${stuck ? " is-stuck" : ""}`} id="hdr">
        <div className="hdr__in">
          <Brand />

          <nav className="nav" id="nav" aria-label="Primary">
            <HashLink hash="conditions">What we treat</HashLink>

            <div className="nav__has" ref={svcGroupRef} onBlur={onSvcFocusOut}>
              <button
                className="nav__btn"
                id="svcbtn"
                ref={svcBtnRef}
                aria-expanded={svcOpen}
                aria-controls="svcmenu"
                aria-haspopup="true"
                onClick={(e) => {
                  e.stopPropagation();
                  setSvcOpen((v) => !v);
                }}
              >
                Services
                <ChevronIcon />
              </button>

              <div className="nav__menu" id="svcmenu" hidden={!svcOpen}>
                {SERVICES.map((s) => (
                  <Link key={s.slug} href={`/${s.slug}/`} onClick={() => setSvcOpen(false)}>
                    <b>{s.menuLabel}</b>
                    <span>{s.blurb}</span>
                  </Link>
                ))}
                <HashLink hash="services" className="nav__all" onClick={() => setSvcOpen(false)}>
                  All four on one page
                  <ArrowIcon />
                </HashLink>
              </div>
            </div>

            <Link href="/weekend-recovery/">Recovery</Link>
            <HashLink hash="doctor">The team</HashLink>
            <HashLink hash="results">Reviews</HashLink>
            <HashLink hash="visit">Visit</HashLink>
          </nav>

          <div className="hdr__act">
            <a className="btn btn--primary btn--sm hdr__call" href={telHref}>
              <PhoneIcon />
              <span>
                Call<span className="hdr__num"> {SITE.phoneLabel}</span>
              </span>
            </a>
            <button
              className="burger"
              id="burger"
              ref={burgerRef}
              aria-expanded={menuOpen}
              aria-controls="mobnav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        className="mobnav"
        id="mobnav"
        hidden={!menuOpen}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setMenuOpen(false);
        }}
      >
        <nav className="mobnav__in" aria-label="Mobile">
          <HashLink hash="approach">Approach</HashLink>
          <HashLink hash="conditions">What we treat</HashLink>
          <p className="mobnav__lbl">Services</p>
          {SERVICES.map((s) => (
            <Link className="mobnav__sub" key={s.slug} href={`/${s.slug}/`}>
              {s.menuLabel}
            </Link>
          ))}
          <Link href="/weekend-recovery/">Recovery Program</Link>
          <HashLink hash="doctor">The team</HashLink>
          <HashLink hash="results">Reviews</HashLink>
          <HashLink hash="visit">Visit</HashLink>
          <div className="mobnav__act">
            <a className="btn btn--primary" href={telHref}>
              Call {SITE.phoneLabel}
            </a>
            <a className="btn btn--ghost" href={mailHref}>
              {SITE.email}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
