/**
 * Warmup hook for templates data.
 *
 * Preloads the templates list while the habits screen is active so opening the
 * templates modal can reuse cached Convex data.
 */

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { TIMEOUTS } from '../../../lib/timing/config';
import { scheduleWhenIdle } from '../../../lib/timing/scheduleWhenIdle';

export function useTemplatesWarmup(): void {
  const [shouldWarmup, setShouldWarmup] = useState(false);

  useEffect(() => {
    return scheduleWhenIdle(
      () => setShouldWarmup(true),
      {
        fallbackDelayMs: TIMEOUTS.PURCHASES_INIT,
        timeoutMs: TIMEOUTS.REQUEST_IDLE_CALLBACK,
      }
    );
  }, []);

  useQuery(api.templates.list, shouldWarmup ? {} : 'skip');
}
