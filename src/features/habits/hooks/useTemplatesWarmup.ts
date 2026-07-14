/** Deferred, cache-aware warmup for the Templates Library. */
import { useEffect, useState } from 'react';

import { api } from '../../../../convex/_generated/api';
import { useNetworkStatus } from '../../../contexts/NetworkStatusContext';
import { useCachedQuery, useCachedQuerySavedAt } from '../../../lib/queryCache';
import { scheduleWhenIdle } from '../../../lib/timing/scheduleWhenIdle';

const TEMPLATE_CACHE_FRESH_MS = 6 * 60 * 60 * 1000;
const IDLE_FALLBACK_MS = 750;
const IDLE_TIMEOUT_MS = 2500;

interface UseTemplatesWarmupOptions {
  homeReady: boolean;
}

export function isTemplateCacheFresh(
  savedAt: number | undefined,
  now = Date.now()
): boolean {
  return savedAt !== undefined && now - savedAt < TEMPLATE_CACHE_FRESH_MS;
}

export function useTemplatesWarmup({
  homeReady,
}: UseTemplatesWarmupOptions): void {
  const { isOnline, status } = useNetworkStatus();
  const templatesSavedAt = useCachedQuerySavedAt(
    'templates.list',
    {},
    {
      fallbackToLatest: true,
    }
  );
  const importedIdsSavedAt = useCachedQuerySavedAt(
    'templates.getImportedTemplateIds',
    {},
    {
      fallbackToLatest: true,
    }
  );
  const cacheFresh =
    isTemplateCacheFresh(templatesSavedAt) &&
    isTemplateCacheFresh(importedIdsSavedAt);
  const canWarm = homeReady && isOnline && !status.isExpensive && !cacheFresh;
  const [warmNow, setWarmNow] = useState(false);

  useEffect(() => {
    if (!canWarm) {
      setWarmNow(false);
      return;
    }
    return scheduleWhenIdle(() => setWarmNow(true), {
      fallbackDelayMs: IDLE_FALLBACK_MS,
      timeoutMs: IDLE_TIMEOUT_MS,
    });
  }, [canWarm]);

  const args = canWarm && warmNow ? {} : 'skip';
  useCachedQuery(api.templates.list, args, { entryName: 'templates.list' });
  useCachedQuery(api.templates.getImportedTemplateIds, args, {
    entryName: 'templates.getImportedTemplateIds',
  });
}
