/**
 * Warmup hook for templates data.
 *
 * Preloads the templates list once after the habits screen settles so opening
 * the templates modal avoids a cold fetch without keeping a live subscription
 * attached to the main screen.
 */

import { useConvex } from 'convex/react';
import { useEffect } from 'react';
import { api } from '../../../../convex/_generated/api';
import { scheduleWhenIdle } from '../../../lib/timing/scheduleWhenIdle';

export function useTemplatesWarmup(): void {
  const convex = useConvex();

  useEffect(() => {
    let cancelled = false;

    const cancelScheduledWarmup = scheduleWhenIdle(
      () => {
        if (cancelled) {
          return;
        }

        void convex.query(api.templates.list, {});
      },
      {
        fallbackDelayMs: 250,
        timeoutMs: 1500,
      }
    );

    return () => {
      cancelled = true;
      cancelScheduledWarmup();
    };
  }, [convex]);
}
