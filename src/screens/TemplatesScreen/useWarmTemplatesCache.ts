/**
 * Warms the public template catalog after the main screen has settled.
 *
 * Keep exactly one catalog subscription alive from the habits screen. Imported
 * IDs are user-specific and inexpensive, so TemplatesScreen requests them only
 * when the library actually opens.
 */
import { useEffect, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import { useCachedQuery } from '../../lib/queryCache';
import { scheduleWhenIdle } from '../../lib/timing/scheduleWhenIdle';

export function useWarmTemplatesCache() {
  const [shouldWarm, setShouldWarm] = useState(false);

  useEffect(
    () =>
      scheduleWhenIdle(() => setShouldWarm(true), {
        fallbackDelayMs: 1200,
        timeoutMs: 3000,
      }),
    []
  );

  useCachedQuery(api.templates.list, shouldWarm ? {} : 'skip', {
    entryName: 'templates.list',
  });
}
