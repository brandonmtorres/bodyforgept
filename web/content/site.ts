/* Single source for the details that repeat on every page. Changing a number
   here changes it in the chrome, the call card and the structured data at once. */

export const SITE = {
  name: "BodyForge Physical Therapy",
  slogan: "Build Stronger. Live Better.",
  origin: "https://bodyforgept.com",
  phone: "+13054561004",
  phoneLabel: "(305) 456-1004",
  email: "info@bodyforgept.com",
  instagram: "https://www.instagram.com/bodyforge_physical_therapy/",
  address: {
    street: "3600 West Flagler Street",
    streetShort: "3600 W Flagler St",
    city: "Miami",
    region: "FL",
    postalCode: "33135",
    country: "US",
  },
} as const;

export const telHref = `tel:${SITE.phone}`;
export const mailHref = `mailto:${SITE.email}`;

/* The five service routes. Replaces the PAGES list that tools/build-pages.py
   templated from.

   `menuLabel` and `nav` are not the same string for every service: the header
   dropdown says "One-on-one Pilates" where the breadcrumb and the related-pages grid
   say "Pilates". Both are carried over verbatim rather than unified. */
export type ServiceLink = {
  slug: string;
  menuLabel: string;
  nav: string;
  blurb: string;
  relBlurb: string;
};

/* header dropdown and footer order */
export const SERVICES: ServiceLink[] = [
  {
    slug: "physical-therapy",
    menuLabel: "Physical therapy",
    nav: "Physical therapy",
    blurb: "After surgery, joint and muscle pain, balance, neurological",
    relBlurb: "After surgery, joint and muscle pain, balance, neurological",
  },
  {
    slug: "strength-and-conditioning",
    menuLabel: "Strength & conditioning",
    nav: "Strength & conditioning",
    blurb: "Training that respects what your joints can take",
    relBlurb: "Training with someone who knows what your joints can take",
  },
  {
    slug: "sport-specific-rehabilitation",
    menuLabel: "Sports injury rehab",
    nav: "Sports injury rehab",
    blurb: "Back to competing, on test results",
    relBlurb: "Getting back to competing, on test results rather than the calendar",
  },
  {
    slug: "pilates",
    menuLabel: "One-on-one Pilates",
    nav: "Pilates",
    blurb: "Private, on mat, reformer and trapeze",
    relBlurb: "Private Pilates taught by a Polestar-educated instructor",
  },
  {
    slug: "weekend-recovery",
    menuLabel: "Recovery Program",
    nav: "Recovery Program",
    blurb: "Thirty-minute sessions, Saturdays and Sundays",
    relBlurb: "Thirty-minute recovery sessions, Saturdays and Sundays",
  },
];

/* The related-pages grid walks the services in the generator's own order, which put
   the recovery page first. Kept so the grid on every page matches the static build. */
export const RELATED_ORDER = [
  "weekend-recovery",
  "physical-therapy",
  "strength-and-conditioning",
  "sport-specific-rehabilitation",
  "pilates",
];

export const byRelatedOrder = (excludeSlug: string): ServiceLink[] =>
  RELATED_ORDER.filter((s) => s !== excludeSlug).map(
    (s) => SERVICES.find((x) => x.slug === s)!,
  );
