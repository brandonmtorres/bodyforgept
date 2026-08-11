import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { HOME_SCHEMA } from "@/content/schema";

import { Announcement } from "@/components/sections/Announcement";
import { Hero } from "@/components/sections/Hero";
import { Approach } from "@/components/sections/Approach";
import { Conditions } from "@/components/sections/Conditions";
import { Band } from "@/components/sections/Band";
import { Services } from "@/components/sections/Services";
import { Recovery } from "@/components/sections/Recovery";
import { Doctor } from "@/components/sections/Doctor";
import { Results } from "@/components/sections/Results";
import { Book } from "@/components/sections/Book";
import { Visit } from "@/components/sections/Visit";

const TITLE = "BodyForge Physical Therapy | One-on-One PT in Miami, FL";
const DESC =
  "One-on-one physical therapy in Miami. Recovery after surgery, joint and muscle pain, balance and neurological conditions, sports injuries, strength training and private Pilates. Weekend recovery sessions now booking. 3600 W Flagler St. Call (305) 456-1004.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "BodyForge Physical Therapy",
    title: TITLE,
    description:
      "One patient at a time. Every session is one-on-one with a licensed clinician, from your first visit to your last.",
    url: "/",
    images: [
      {
        url: "/media/og.jpg",
        width: 1200,
        height: 630,
        alt: "A BodyForge clinician setting both hands on a patient's knee at the start of a range-of-motion check.",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={HOME_SCHEMA} />
      <Announcement />
      <Hero />
      <Approach />
      <Conditions />
      <Band />
      <Services />
      <Recovery />
      <Doctor />
      <Results />
      <Book />
      <Visit />
    </>
  );
}
