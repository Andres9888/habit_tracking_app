import { useEffect, useRef, useState } from 'react';

import { scheduleWhenIdle } from '../../lib/timing/scheduleWhenIdle';

const WARM_MOUNT_DURATION_MS = 4000;

export function useWarmMountWindow(visible: boolean): boolean {
  const [warmMount, setWarmMount] = useState(false);
  const hasWarmed = useRef(false);

  useEffect(() => {
    if (visible) {
      hasWarmed.current = true;
      setWarmMount(false);
      return;
    }
    if (hasWarmed.current) return;

    let cancelled = false;
    let expirationTimer: ReturnType<typeof setTimeout> | undefined;
    const cancelScheduledWarmMount = scheduleWhenIdle(
      () => {
        if (cancelled) return;

        hasWarmed.current = true;
        setWarmMount(true);
        expirationTimer = setTimeout(
          () => setWarmMount(false),
          WARM_MOUNT_DURATION_MS
        );
      },
      { fallbackDelayMs: 120, timeoutMs: 1500 }
    );

    return () => {
      cancelled = true;
      cancelScheduledWarmMount();
      if (expirationTimer !== undefined) clearTimeout(expirationTimer);
    };
  }, [visible]);

  return !visible && warmMount;
}
