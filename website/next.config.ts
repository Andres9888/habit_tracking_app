import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * SR-2026-04-17-05. The site had no headers configured, exposing it to
 * clickjacking, MIME sniffing, and Referer leakage. These headers are
 * the baseline set. Content-Security-Policy is intentionally left out
 * here — it needs per-route tuning for the MDX blog pipeline and
 * third-party scripts (Vercel Analytics), so it belongs in a follow-up
 * once report-only telemetry is in place.
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Handle next-mdx-remote with Turbopack
  serverExternalPackages: ["next-mdx-remote"],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
