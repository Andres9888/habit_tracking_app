import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { AlertTriangle } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { styles } from './OfflinePendingBanner.styles';
import { TYPE_LABELS } from './constants';
import { formatRelativeTime } from './utils';
import type {
  QueueStats,
  OfflineSubmissionType,
} from '../../hooks/useOfflineQueue';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

interface ExpandedStatsProps {
  stats: QueueStats | null;
  expandAnimatedStyle: AnimatedStyle<ViewStyle>;
}

export function ExpandedStats({
  stats,
  expandAnimatedStyle,
}: ExpandedStatsProps) {
  if (!stats) return null;

  return (
    <Animated.View style={[styles.expandedContent, expandAnimatedStyle]}>
      <View style={styles.statsContainer}>
        {/* Items by type */}
        <Text style={styles.statsHeader}>Pending Items:</Text>
        <View style={styles.statsList}>
          {(Object.entries(stats.byType) as [OfflineSubmissionType, number][])
            .filter(([, count]) => count > 0)
            .map(([type, count]) => (
              <View key={type} style={styles.statsItem}>
                <View style={styles.statsDot} />
                <Text style={styles.statsText}>
                  {TYPE_LABELS[type]}: {count}
                </Text>
              </View>
            ))}
        </View>

        {/* Failed items warning */}
        {stats.failedItems > 0 ? <View style={styles.warningContainer}>
            <AlertTriangle color='#F59E0B' size={iconSizes.small} />
            <Text style={styles.warningText}>
              {stats.failedItems} item{stats.failedItems === 1 ? '' : 's'}{' '}
              failed to sync
            </Text>
          </View> : null}

        {/* Oldest item */}
        {stats.oldestItemAt ? <Text style={styles.ageText}>
            Oldest: {formatRelativeTime(stats.oldestItemAt)}
          </Text> : null}
      </View>
    </Animated.View>
  );
}
