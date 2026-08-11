import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

/* next dev refuses cross-origin requests to /_next/* unless the host is listed, and
   "localhost" is the only one allowed by default. Reaching the dev server by IP — which
   is what a browser on the Windows side of WSL does — then gets the HTML but 403s every
   JS chunk, so the page arrives dead.

   The WSL address changes between reboots, so the machine's own IPv4 addresses are read
   at startup rather than hard-coded. Development only; next build ignores this. */
const localHosts = [
  "localhost",
  "127.0.0.1",
  ...Object.values(networkInterfaces())
    .flat()
    .filter((i) => i?.family === "IPv4")
    .map((i) => i!.address),
];

const nextConfig: NextConfig = {
  allowedDevOrigins: localHosts,

  /* A folder of finished HTML. Any file host serves it, and it still drops into
     the WordPress theme the way site/ does today. */
  output: "export",

  /* Emits out/physical-therapy/index.html rather than out/physical-therapy.html,
     so the URLs the old WordPress site accumulated ranking on keep resolving. */
  trailingSlash: true,

  /* build-assets.py already produces every derivative at four widths with an
     explicit srcset, and export mode has no optimizer to run anyway. */
  images: { unoptimized: true },
};

export default nextConfig;
