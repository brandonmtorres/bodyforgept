/* ═══════════════════════════════════════════════════════════════════════
   BodyForge Physical Therapy — interaction layer
   No dependencies. Everything degrades to working HTML without it.
   ═══════════════════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ───────────────────────────────────────────────────── header ──── */
  const hdr = $("#hdr");
  const onScroll = () => hdr.classList.toggle("is-stuck", window.scrollY > 12);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  const burger = $("#burger");
  const mobnav = $("#mobnav");
  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobnav.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  mobnav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !mobnav.hidden) { setMenu(false); burger.focus(); } });
  matchMedia("(min-width: 1060px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ────────────────────────────────────────── services dropdown ──── */
  const svcBtn = $("#svcbtn");
  const svcMenu = $("#svcmenu");
  if (svcBtn && svcMenu) {
    const setSvc = (open) => {
      svcBtn.setAttribute("aria-expanded", String(open));
      svcMenu.hidden = !open;
    };
    svcBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setSvc(svcBtn.getAttribute("aria-expanded") !== "true");
    });
    svcMenu.addEventListener("click", (e) => { if (e.target.closest("a")) setSvc(false); });
    document.addEventListener("click", (e) => {
      if (!svcMenu.hidden && !e.target.closest(".nav__has")) setSvc(false);
    });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !svcMenu.hidden) { setSvc(false); svcBtn.focus(); }
    });
    // leaving the group by keyboard closes it
    $(".nav__has").addEventListener("focusout", (e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setSvc(false);
    });
  }

  /* ──────────────────────────────────────────────────── reveals ──── */
  const revealTargets = [
    ".approach__top > *", ".approach__fig", ".incl li",
    ".cond__top > *", ".cond__tabs", ".cond__panels", ".cond__note",
    ".svc__h", ".row__fig", ".row__body",
    ".rec__top > *", ".rec__chips", ".rec__fig", ".rec__why li",
    ".price", ".rec__offer .menu", ".rec__act", ".partner",
    ".doc__fig", ".doc__body > *", ".team",
    ".res__h", ".tst",
    ".book__aside > *", ".book__panel",
    ".visit__col > *",
    ".ft__brand", ".ft__nav > div",
    /* service pages */
    ".phero__copy > *", ".fourway article", ".incl-strip li", ".incl--ink li",
    ".rates__lead", ".rate__r", ".claim", ".road > li", ".rel__i", ".cta__in > *",
  ];

  // added by JS so the page is fully visible if the script never runs
  $$(revealTargets.join(",")).forEach((el) => {
    if (!el.classList.contains("rv")) el.classList.add("rv");
  });

  const stagger = new WeakMap();
  const rvObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const sec = el.closest("section, footer") || document.body;
      const n = stagger.get(sec) || 0;
      el.style.setProperty("--d", String(el.dataset.rv ?? Math.min(n, 4)));
      stagger.set(sec, n + 1);
      el.classList.add("is-in");
      rvObserver.unobserve(el);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  if (reduce) $$(".rv").forEach((el) => el.classList.add("is-in"));
  else $$(".rv").forEach((el) => rvObserver.observe(el));

  /* ─────────────────────────────────────────────── roadmap line ──── */
  /* The ember line runs left to right and each phase marker lights as it
     arrives. CSS owns the timing; this only says "you can start now". */
  $$("[data-road]").forEach((road) => {
    if (reduce) { road.classList.add("is-in"); return; }
    new IntersectionObserver((en, ob) => {
      if (en[0].isIntersecting) { road.classList.add("is-in"); ob.disconnect(); }
    }, { threshold: 0.25 }).observe(road);
  });

  /* ───────────────────────────────────────────────────── tabs ──── */
  const tabs = $$(".ctab");
  const selectTab = (tab, focus = true) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.classList.toggle("is-on", on);
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) { panel.hidden = !on; panel.classList.toggle("is-on", on); }
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab, false));
    tab.addEventListener("keydown", (e) => {
      const map = { ArrowRight: 1, ArrowLeft: -1, Home: "first", End: "last" };
      if (!(e.key in map)) return;
      e.preventDefault();
      const d = map[e.key];
      const next = d === "first" ? tabs[0]
                 : d === "last" ? tabs[tabs.length - 1]
                 : tabs[(i + d + tabs.length) % tabs.length];
      selectTab(next);
    });
  });

  /* ────────────────────────────────────────────── disclosures ──── */
  $$("[data-disc]").forEach((d) => {
    const btn = $(".disc__btn", d);
    const wrap = $(".disc__wrap", d);
    const label = $("span", btn);
    const openText = label.textContent;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      wrap.classList.toggle("is-open", !open);
      if (openText === "Read the full review") label.textContent = open ? openText : "Hide the full review";
    });
  });

  /* ───────────────────────────────────────────────── scrollspy ──── */
  // service pages link back as "/#approach", which is not a valid selector and
  // has no target here. Only spy on sections that exist on this page.
  const navLinks = $$(".nav a");
  const localHash = (a) => {
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#")) return href;
    if (href.startsWith("/#")) return href.slice(1);
    return null;
  };
  const spied = navLinks.map((a) => {
    const h = localHash(a);
    return h ? document.querySelector(h) : null;
  }).filter(Boolean);

  if (spied.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle("is-here", localHash(a) === `#${en.target.id}`));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    spied.forEach((s) => spy.observe(s));
  }

  /* ────────────────────────────────────────────────────── dock ──── */
  const dock = $("#dock");
  const heroSec = $(".hero") || $(".phero");
  const bookSec = $("#book");
  if (dock && heroSec) {
    let pastHero = false, atBook = false;
    const syncDock = () => dock.classList.toggle("is-up", pastHero && !atBook);
    new IntersectionObserver(([en]) => { pastHero = !en.isIntersecting; syncDock(); }, { threshold: 0 }).observe(heroSec);
    if (bookSec) {
      new IntersectionObserver(([en]) => { atBook = en.isIntersecting; syncDock(); }, { threshold: 0.12 }).observe(bookSec);
    }
  }

  /* ─────────────────────────────────────────────── hours / open ──── */
  /* Weekends are open, but only for Weekend Recovery, so the indicator has to
     say which. Keeping the two sets separate is what makes that possible. */
  const now = new Date();
  const CLINIC = { 1: [7, 16], 2: [10, 19], 3: [7, 16], 4: [10, 19], 5: [7, 16] };
  const RECOVERY = { 6: [7, 14], 0: [13, 19] };
  const HOURS = { ...CLINIC, ...RECOVERY };

  const todayRow = $(`.hours tr[data-day="${now.getDay()}"]`);
  if (todayRow) todayRow.classList.add("is-today");

  const clock = (h) => `${((h + 11) % 12) + 1}${h < 12 ? "am" : "pm"}`;
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const openEl = $("#open-now");
  if (openEl) {
    const span = HOURS[now.getDay()];
    const mins = now.getHours() * 60 + now.getMinutes();
    const isOpen = !!span && mins >= span[0] * 60 && mins < span[1] * 60;
    const recoveryToday = now.getDay() in RECOVERY;
    openEl.hidden = false;
    openEl.classList.toggle("is-open", isOpen);
    if (isOpen) {
      openEl.textContent = recoveryToday
        ? `Recovery open now · until ${clock(span[1])}`
        : `Open now · until ${clock(span[1])}`;
    } else {
      let d = now.getDay(), add = 0;
      do { d = (d + 1) % 7; add++; } while (!HOURS[d] && add < 8);
      const sameDayLater = span && mins < span[0] * 60;
      const what = (day) => (day in RECOVERY ? "recovery opens" : "opens");
      openEl.textContent = sameDayLater
        ? `Closed · ${what(now.getDay())} today at ${clock(span[0])}`
        : `Closed · ${what(d)} ${add === 1 ? "tomorrow" : DAYS[d]} at ${clock(HOURS[d][0])}`;
    }
  }

  /* the call card echoes the same state, so the number is never offered with
     stale hours sitting under it */
  const callSub = $("#call-now");
  if (callSub) {
    const span = CLINIC[now.getDay()];
    const mins = now.getHours() * 60 + now.getMinutes();
    if (span && mins >= span[0] * 60 && mins < span[1] * 60) {
      callSub.innerHTML = `<b>Open now</b> <i>·</i> the clinic answers until ${clock(span[1])} today`;
    } else {
      let d = now.getDay(), add = 0;
      do { d = (d + 1) % 7; add++; } while (!CLINIC[d] && add < 8);
      const sameDayLater = span && mins < span[0] * 60;
      callSub.innerHTML = sameDayLater
        ? `Leave a message <i>·</i> the clinic answers from ${clock(span[0])} today`
        : `Leave a message <i>·</i> the clinic answers ${add === 1 ? "tomorrow" : DAYS[d]} from ${clock(CLINIC[d][0])}`;
    }
  }

  /* copyright year */
  const yr = $("#yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

})();
