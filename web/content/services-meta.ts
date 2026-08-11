import type { Metadata } from "next";
import { SITE } from "./site";

/* Per-page title, description and structured data. The Service + BreadcrumbList
   graph is identical in shape for all five pages, so it is generated rather than
   repeated; anything page-specific is passed in. */

export type ServiceMeta = {
  slug: string;
  nav: string;
  title: string;
  desc: string;
  schemaName: string;
  schemaType: string;
};

export const SERVICE_META: Record<string, ServiceMeta> = {
  "physical-therapy": {
    slug: "physical-therapy",
    nav: "Physical therapy",
    title: "Physical Therapy in Miami | BodyForge Physical Therapy",
    desc: "One-on-one physical therapy in Miami. Recovery after surgery, joint and muscle pain, balance problems and neurological conditions, treated by a licensed clinician. 3600 W Flagler St.",
    schemaName: "Personalized Physical Therapy",
    schemaType: "Physical therapy",
  },
  "strength-and-conditioning": {
    slug: "strength-and-conditioning",
    nav: "Strength & conditioning",
    title: "Strength & Conditioning in Miami | BodyForge Physical Therapy",
    desc: "Strength and conditioning in Miami with a doctor of physical therapy. One-on-one training, a plan for your own gym, or a prehab screening to stop injuries before they start.",
    schemaName: "Strength and Conditioning",
    schemaType: "Strength and conditioning training",
  },
  "sport-specific-rehabilitation": {
    slug: "sport-specific-rehabilitation",
    nav: "Sports injury rehab",
    title: "Sports Injury Rehab in Miami | BodyForge Physical Therapy",
    desc: "Sports injury rehabilitation in Miami. Return-to-sport testing for field, court, water and combat athletes, so you go back when you are ready rather than when the pain stops.",
    schemaName: "Sport-Specific Rehabilitation",
    schemaType: "Sports injury rehabilitation",
  },
  pilates: {
    slug: "pilates",
    nav: "Pilates",
    title: "One-on-One Pilates in Miami | BodyForge Physical Therapy",
    desc: "Private one-on-one Pilates in Miami on mat, reformer, trapeze and spine corrector, taught by a Polestar-trained instructor who is also a doctor of physical therapy. All levels.",
    schemaName: "One-on-One Pilates",
    schemaType: "Pilates instruction",
  },
  "weekend-recovery": {
    slug: "weekend-recovery",
    nav: "Recovery Program",
    title: "Recovery Program in Miami | BodyForge Physical Therapy",
    desc: "Thirty-minute recovery sessions in Miami: massage, assisted stretching, joint mobilization, cupping, Theragun and Normatec compression, run by a licensed PT clinic. Saturdays and Sundays. From $49.",
    schemaName: "Recovery Program",
    schemaType: "Recovery and manual therapy session",
  },
};

export function serviceMetadata(slug: string): Metadata {
  const m = SERVICE_META[slug];
  return {
    title: m.title,
    description: m.desc,
    alternates: { canonical: `/${m.slug}/` },
    openGraph: {
      type: "article",
      siteName: SITE.name,
      title: m.title,
      description: m.desc,
      url: `/${m.slug}/`,
      images: [{ url: "/media/og.jpg" }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export function serviceSchema(slug: string, extra: object[] = []) {
  const m = SERVICE_META[slug];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE.origin}/${m.slug}/#service`,
        name: m.schemaName,
        serviceType: m.schemaType,
        description: m.desc,
        url: `${SITE.origin}/${m.slug}/`,
        provider: {
          "@type": ["MedicalBusiness", "PhysicalTherapy"],
          name: SITE.name,
          "@id": `${SITE.origin}/#clinic`,
          telephone: "+1-305-456-1004",
          address: {
            "@type": "PostalAddress",
            streetAddress: SITE.address.street,
            addressLocality: SITE.address.city,
            addressRegion: SITE.address.region,
            postalCode: SITE.address.postalCode,
            addressCountry: SITE.address.country,
          },
        },
        areaServed: { "@type": "City", name: "Miami" },
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: `${SITE.origin}/#book`,
          servicePhone: "+1-305-456-1004",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.origin}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: m.nav,
            item: `${SITE.origin}/${m.slug}/`,
          },
        ],
      },
      ...extra,
    ],
  };
}
