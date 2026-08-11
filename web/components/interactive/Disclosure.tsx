"use client";

import { useState, type ReactNode } from "react";
import { ChevronIcon } from "@/components/icons";

/* The review disclosures swap their label when open ("Read the full review" becomes
   "Hide the full review"); the service ones keep theirs. Passing openLabel is what
   distinguishes the two, rather than matching on the string the way main.js did. */

type Props = {
  id: string;
  label: string;
  openLabel?: string;
  /* the review disclosures sit inside a quote, where the standard button is too loud */
  quiet?: boolean;
  children: ReactNode;
};

export function Disclosure({ id, label, openLabel, quiet, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="disc" data-disc>
      <button
        className={`disc__btn${quiet ? " disc__btn--quiet" : ""}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{open && openLabel ? openLabel : label}</span>
        <ChevronIcon />
      </button>
      <div className={`disc__wrap${open ? " is-open" : ""}`} id={id}>
        <div className="disc__in">{children}</div>
      </div>
    </div>
  );
}
