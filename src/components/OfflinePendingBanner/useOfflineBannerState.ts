import { useState } from 'react';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';
import { useOfflineQueue, type QueueStats } from '../../hooks/useOfflineQueue';
import type { ProcessingState } from '../OfflineQueueProcessor';

interface UseOfflineBannerStateParams {
  processingState?: ProcessingState;
  queueStats?: QueueStats;
  forceShow?: boolean;
}

export const useOfflineBannerState = ({
  processingState,
  queueStats: externalStats,
  forceShow = false,
}: UseOfflineBannerStateParams) => {
  const { isOnline } = useNetworkStatus();
  const { hasQueuedItems, queueCount, getStats } = useOfflineQueue();

  const [isExpanded, setIsExpanded] = useState(false);
  const [stats, setStats] = useState<QueueStats | null>(externalStats ?? null);

  const isProcessing = processingState?.isProcessing ?? false;
  const displayStats = externalStats ?? stats;
  const isOffline = !isOnline;
  const hasPendingItems = hasQueuedItems;
  const shouldRender = forceShow || !isOnline || hasQueuedItems;

  return {
    displayStats,
    getStats,
    hasPendingItems,
    hasQueuedItems,
    isExpanded,
    isOffline,
    isOnline,
    isProcessing,
    queueCount,
    setIsExpanded,
    setStats,
    shouldRender,
    stats,
  };
};
