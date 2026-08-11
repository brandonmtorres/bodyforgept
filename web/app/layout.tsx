import type { Metadata, Viewport } from "next";
import "./globals.css";

import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { Dock } from "@/components/chrome/Dock";
import { RevealController } from "@/components/interactive/RevealController";
import { ScrollSpy } from "@/components/interactive/ScrollSpy";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  icons: {
    icon: [{ url: "/media/icon-32.png", sizes: "32x32" }],
    apple: "/media/icon-180.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#150e0a",
};

/* Scoped to .js so a failed or blocked script can never hide the content: the reveal
   rule is `.js .rv`. Running it as the first thing in the body means the class lands
   before any .rv element is parsed, so there is no flash of visible-then-hidden. */
const JS_FLAG = `document.documentElement.classList.add("js");`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* suppressHydrationWarning covers this element's attributes only: the inline script
       below adds class="js" before React hydrates, so the DOM legitimately carries an
       attribute the server did not render. Without it React logs a mismatch on every
       page load, which would bury a real one. */
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Both families come from the Google Fonts CDN, as they do in the static
            build. next/font would self-host them and drop two preconnects, but it
            registers a different @font-face set, and Chromium then resolves the `ch`
            unit against it differently — 22ch came out 22px wider, which moved every
            pull quote and shifted the page below it. The stylesheet below is the one
            the design was measured against, so it is the one that ships. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- see the note above:
            next/font is what this rule wants, and it shifts the ch unit */}
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Martian+Mono:wdth,wght@75..112.5,100..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />

        <a className="skip" href="#main">
          Skip to content
        </a>

        <SiteHeader />

        <main id="main">
          <span id="top" />
          {children}
        </main>

        <SiteFooter />
        <Dock />

        <RevealController />
        <ScrollSpy />
      </body>
    </html>
  );
}
