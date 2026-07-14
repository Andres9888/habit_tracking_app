import { useEffect, useState } from 'react';

import { scheduleWhenIdle } from '../../../lib/timing/scheduleWhenIdle';

const OVERLAY_IDLE_FALLBACK_MS = 400;
const OVERLAY_IDLE_TIMEOUT_MS = 1500;

interface DeferredOverlayMountOptions {
  homeReady: boolean;
  requested: boolean;
}

export function useDeferredOverlayMount({
  homeReady,
  requested,
}: DeferredOverlayMountOptions): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    if (requested) {
      setMounted(true);
      return;
    }
    if (!homeReady) return;

    return scheduleWhenIdle(() => setMounted(true), {
      fallbackDelayMs: OVERLAY_IDLE_FALLBACK_MS,
      timeoutMs: OVERLAY_IDLE_TIMEOUT_MS,
    });
  }, [homeReady, mounted, requested]);

  return requested || mounted;
}
