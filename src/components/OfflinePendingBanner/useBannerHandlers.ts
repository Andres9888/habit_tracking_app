import { useCallback } from 'react';
import { withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SPRING_CONFIG } from './constants';
import type { QueueStats } from '../../hooks/useOfflineQueue';

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
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!isExpanded && !externalStats) {
      void getStats().then(setStats);
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
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSyncPress?.();
  }, [onSyncPress]);

  return { handlePress, handleSyncPress };
};
