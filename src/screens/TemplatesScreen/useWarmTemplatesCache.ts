/**
 * Warms the public template catalog after the main screen has settled.
 *
 * One-shot, not a subscription: the catalog is ~215KB of public documents that
 * change on the order of never, so an open subscription from the habits screen
 * only buys a full-payload push (and a 215KB persist) on any catalog edit.
 * The result is primed into the query cache under the same key TemplatesScreen
 * reads, so the library still opens instantly while its own live subscription
 * attaches. Imported IDs are user-specific and inexpensive, so TemplatesScreen
 * requests them only when the library actually opens.
 */
import * as convexReact from 'convex/react';
import type { ConvexReactClient } from 'convex/react';
import { useEffect } from 'react';
import { api } from '../../../convex/_generated/api';
import { hasCachedQueryValue, primeQueryCache } from '../../lib/queryCache';
import { scheduleWhenIdle } from '../../lib/timing/scheduleWhenIdle';

const ENTRY_NAME = 'templates.list' as const;
const NO_ARGS = {};

// Resolved once at module load, so this stays an unconditional hook call.
// Suites that mock 'convex/react' stub only the hooks they exercise; warming
// is best-effort and must not crash a screen that has no client.
const useConvexClient: () => ConvexReactClient | null =
  typeof convexReact.useConvex === 'function'
    ? convexReact.useConvex
    : () => null;

export function useWarmTemplatesCache() {
  const convex = useConvexClient();

  useEffect(() => {
    if (!convex) return;
    if (hasCachedQueryValue(ENTRY_NAME, NO_ARGS)) return;

    let cancelled = false;
    const cancelIdle = scheduleWhenIdle(
      () => {
        void convex
          .query(api.templates.list, NO_ARGS)
          .then((templates) => {
            if (cancelled || hasCachedQueryValue(ENTRY_NAME, NO_ARGS)) return;
            primeQueryCache(ENTRY_NAME, NO_ARGS, templates);
          })
          .catch((error: unknown) => {
            if (__DEV__) console.warn('[templates] warm failed', error);
          });
      },
      { fallbackDelayMs: 1200, timeoutMs: 3000 }
    );

    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [convex]);
}
