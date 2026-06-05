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
  const [shouldWarmTemplates, setShouldWarmTemplates] = useState(false);

  useEffect(() => {
    return scheduleWhenIdle(() => setShouldWarmTemplates(true), {
      fallbackDelayMs: 1500,
      timeoutMs: 3000,
    });
  }, []);

  useQuery(api.templates.list, shouldWarmTemplates ? {} : 'skip');
}
