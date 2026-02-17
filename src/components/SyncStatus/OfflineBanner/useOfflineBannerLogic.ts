/**
 * useOfflineBannerLogic Hook
 *
 * Business logic for the OfflineBanner component
 */

import { useState, useEffect } from 'react';
import type { OfflineBannerProps, OfflineBannerLogicReturn } from './types';

export function useOfflineBannerLogic({
  visible,
  pendingCount,
  isSyncing,
}: Pick<OfflineBannerProps, 'visible' | 'pendingCount' | 'isSyncing'>): OfflineBannerLogicReturn {
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    } else {
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const displayText = isSyncing
    ? `Syncing ${pendingCount} items`
    : pendingCount > 0
      ? `You're offline. ${pendingCount} changes pending sync`
      : 'You\'re offline';

  return {
    shouldRender,
    displayText,
  };
}
