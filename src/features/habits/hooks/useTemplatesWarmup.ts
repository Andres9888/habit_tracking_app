/**
 * Warmup hook for templates data.
 *
 * Preloads the templates list while the habits screen is active so opening the
 * templates modal can reuse cached Convex data.
 */

import { useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from '../../../../convex/_generated/api';
import { scheduleWhenIdle } from '../../../lib/timing/scheduleWhenIdle';

export function useTemplatesWarmup(): void {
  const [shouldWarm, setShouldWarm] = useState(false);

  useEffect(() => {
    const cancelWarmup = scheduleWhenIdle(
      () => setShouldWarm(true),
      {
        fallbackDelayMs: 120,
        timeoutMs: 1500,
      }
    );

    return cancelWarmup;
  }, []);

  useQuery(api.templates.list, shouldWarm ? {} : 'skip');
}
