"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

/**
 * Gate Vercel Analytics behind explicit user consent.
 *
 * SR-2026-04-17-12. Vercel Analytics is privacy-friendly by default
 * (no cookies, aggregated metrics) but strict jurisdictions still
 * require opt-in for any analytics collection. Default to OFF until
 * the visitor accepts.
 *
 * Decision is stored in localStorage under `chainday:analytics-consent`
 * with values `"accepted"` or `"declined"`. The banner doesn't render
 * once a decision exists.
 */
const STORAGE_KEY = "chainday:analytics-consent";

type Decision = "accepted" | "declined" | null;

function readDecision(): Decision {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "accepted" || value === "declined" ? value : null;
}

export function AnalyticsConsent() {
  const [decision, setDecision] = useState<Decision>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDecision(readDecision());
    setHydrated(true);
  }, []);

  function record(next: "accepted" | "declined") {
    window.localStorage.setItem(STORAGE_KEY, next);
    setDecision(next);
  }

  if (!hydrated) return null;

  return (
    <>
      {decision === "accepted" && <Analytics />}
      {decision === null && (
        <div
          role="dialog"
          aria-label="Analytics consent"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-xl border border-zinc-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/95"
        >
          <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-200">
            We use privacy-friendly analytics (Vercel Analytics, no
            cookies) to understand which pages are useful. Is that OK?
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => record("accepted")}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => record("declined")}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  );
}
