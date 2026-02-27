import { useCallback } from 'react';
import { withSpring } from 'react-native-reanimated';
import { SPRING_CONFIG } from './constants';
import type { QueueStats } from '../../hooks/useOfflineQueue';
import { triggerHaptic } from '@/utils/haptics';

interface UseOfflineBannerHandlersParams {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  externalStats?: QueueStats;
  getStats: () => Promise<QueueStats>;
  setStats: (stats: QueueStats | null) => void;
  expandProgress: { value: number };
  onPress?: () => void;
  onSyncPress?: () => void;
}

export const useOfflineBannerHandlers = ({
  isExpanded,
  setIsExpanded,
  externalStats,
  getStats,
  setStats,
  expandProgress,
  onPress,
  onSyncPress,
}: UseOfflineBannerHandlersParams) => {
  const handlePress = useCallback(() => {
    triggerHaptic('tap');

    if (!isExpanded && !externalStats) {
      void getStats()
        .then(setStats)
        .catch((error) => {
          if (__DEV__) console.warn('Error getting queue stats:', error);
          setStats(null);
        });
    }

    setIsExpanded(!isExpanded);
    expandProgress.value = withSpring(isExpanded ? 0 : 1, SPRING_CONFIG);

    onPress?.();
  }, [
    isExpanded,
    externalStats,
    getStats,
    setStats,
    setIsExpanded,
    expandProgress,
    onPress,
  ]);

  const handleSyncPress = useCallback(() => {
    triggerHaptic('toggle');
    onSyncPress?.();
  }, [onSyncPress]);

  return { handlePress, handleSyncPress };
};
