import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

/* A service announcement, not a sale. It states what is new, when it runs, and links
   to the page that explains it. No countdown, no dismiss, no badge. */

export function Announcement() {
  return (
    <aside className="ann">
      <Link className="ann__in" href="/weekend-recovery/">
        <span className="ann__k mono">
          <span className="ann__dot" aria-hidden="true" />
          Now booking
        </span>
        <span className="ann__t">
          <b>Recovery Program</b> &mdash; thirty-minute sessions, Saturdays and Sundays. Founding
          rate from $49.
        </span>
        <span className="ann__go">
          See the service
          <ArrowIcon />
        </span>
      </Link>
    </aside>
  );
}
