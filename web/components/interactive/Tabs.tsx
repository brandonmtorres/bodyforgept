"use client";

import { useRef, useState, type ReactNode } from "react";

/* Roving tabindex: exactly one tab is reachable by Tab, and the arrow keys move
   between them. Home and End jump to the ends. Selection follows focus, which is the
   pattern the static build used. */

export type TabItem = {
  id: string;
  label: ReactNode;
  panel: ReactNode;
};

export function Tabs({ items, label }: { items: TabItem[]; label: string }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number, focus = true) => {
    setActive(i);
    if (focus) tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const n = items.length;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    else if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    select(next);
  };

  return (
    <>
      <div className="cond__tabs" role="tablist" aria-label={label}>
        {items.map((t, i) => {
          const on = i === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`t-${t.id}`}
              aria-controls={`p-${t.id}`}
              aria-selected={on}
              className={`ctab${on ? " is-on" : ""}`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(i, false)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="cond__panels">
        {items.map((t, i) => {
          const on = i === active;
          return (
            <div
              key={t.id}
              role="tabpanel"
              id={`p-${t.id}`}
              aria-labelledby={`t-${t.id}`}
              className={`cpan${on ? " is-on" : ""}`}
              tabIndex={0}
              hidden={!on}
            >
              {t.panel}
            </div>
          );
        })}
      </div>
    </>
  );
}
