#!/usr/bin/env node
/**
 * Writes vercel.json rewrites that proxy /docs to a Mintlify Host-at deployment.
 *
 * Usage:
 *   node scripts/wire-mintlify-docs-proxy.mjs <mintlify-subdomain>
 *
 * Example:
 *   node scripts/wire-mintlify-docs-proxy.mjs cadence-abc123
 *
 * Prerequisites (Mintlify dashboard):
 *   1. GitHub App → acknowledgements-sfc/cadence-cursor, subdirectory mintlify/
 *   2. Custom domain → Host at cadencemgmt.site, base path docs
 *   3. Note the *.mintlify.site subdomain from the dashboard Overview
 */

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const subdomain = process.argv[2]?.trim();
if (!subdomain || subdomain.includes(".") || subdomain.includes("/")) {
  console.error(
    "Usage: node scripts/wire-mintlify-docs-proxy.mjs <mintlify-subdomain>",
  );
  console.error("  subdomain only — e.g. cadence-abc123 (not a full URL)");
  process.exit(1);
}

const origin = `https://${subdomain}.mintlify.site`;
const config = {
  rewrites: [
    {
      source: "/_mintlify/:path*",
      destination: `${origin}/_mintlify/:path*`,
    },
    {
      source: "/mintlify-assets/:path+",
      destination: `${origin}/mintlify-assets/:path+`,
    },
    {
      source: "/docs",
      destination: `${origin}/docs`,
    },
    {
      source: "/docs/:path*",
      destination: `${origin}/docs/:path*`,
    },
    {
      source: "/(.*)",
      destination: "/index.html",
    },
  ],
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "vercel.json");
writeFileSync(out, `${JSON.stringify(config, null, 2)}\n`);
console.log(`Wrote ${out}`);
console.log(`Docs proxy → ${origin}/docs`);
console.log("Next: deploy cadence-front-door to production.");
