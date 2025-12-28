/**
 * OfflinePendingBanner Component
 * UI component showing pending offline submissions
 *
 * Part of Edge Case handling: Offline Queue for Submissions
 *
 * Features:
 * - Shows when offline with queue items
 * - Shows sync progress when processing
 * - Animated entrance/exit
 * - Tap to expand details
 * - Respects reduce motion preference
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  AlertTriangle,
  ChevronDown,
  Cloud,
  CloudOff,
  RefreshCw,
  WifiOff,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useNetworkStatus } from '../contexts/NetworkStatusContext';
import { useOfflineQueue, QueueStats, OfflineSubmissionType } from '../hooks/useOfflineQueue';
import { ProcessingState } from './OfflineQueueProcessor';

/**
 * Props for OfflinePendingBanner
 */
export interface OfflinePendingBannerProps {
  /** Current processing state (if processor is active) */
  processingState?: ProcessingState;
  /** Whether to respect reduce motion preference */
  reduceMotion?: boolean;
  /** Callback when banner is tapped */
  onPress?: () => void;
  /** Callback when "Sync Now" is tapped */
  onSyncPress?: () => void;
  /** Whether to show the sync button */
  showSyncButton?: boolean;
  /** Custom queue stats (for testing) */
  queueStats?: QueueStats;
  /** Whether to show even when online (for testing) */
  forceShow?: boolean;
}

// Submission type display names
const TYPE_LABELS: Record<OfflineSubmissionType, string> = {
  reflection: 'Reflections',
  letter: 'Letters',
  voiceNote: 'Voice Notes',
  visionBoardImage: 'Images',
  affirmation: 'Affirmations',
  habitUpdate: 'Habit Updates',
};

// Animation constants
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
};

/**
 * Format relative time for oldest item
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

/**
 * OfflinePendingBanner Component
 *
 * Displays a banner when there are pending offline submissions.
 * Shows sync progress and allows manual sync trigger.
 *
 * @example
 * ```tsx
 * <OfflinePendingBanner
 *   processingState={processingState}
 *   onSyncPress={processQueue}
 *   showSyncButton={isOnline}
 * />
 * ```
 */
export function OfflinePendingBanner({
  processingState,
  reduceMotion = false,
  onPress,
  onSyncPress,
  showSyncButton = true,
  queueStats: externalStats,
  forceShow = false,
}: OfflinePendingBannerProps) {
  const { isOnline } = useNetworkStatus();
  const { hasQueuedItems, queueCount, getStats } = useOfflineQueue();

  const [isExpanded, setIsExpanded] = useState(false);
  const [stats, setStats] = useState<QueueStats | null>(externalStats ?? null);

  // Animation values
  const expandProgress = useSharedValue(0);
  const spinProgress = useSharedValue(0);
  const pulseProgress = useSharedValue(0);

  // Load stats when expanding
  const handlePress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!isExpanded && !externalStats) {
      void getStats().then(setStats);
    }

    setIsExpanded(!isExpanded);
    expandProgress.value = withSpring(isExpanded ? 0 : 1, SPRING_CONFIG);

    onPress?.();
  }, [isExpanded, externalStats, getStats, expandProgress, onPress]);

  // Handle sync button press
  const handleSyncPress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSyncPress?.();
  }, [onSyncPress]);

  // Start spinner animation when processing
  React.useEffect(() => {
    if (processingState?.isProcessing && !reduceMotion) {
      spinProgress.value = withRepeat(
        withTiming(1, { duration: 1000 }),
        -1,
        false
      );
    } else {
      spinProgress.value = 0;
    }
  }, [processingState?.isProcessing, reduceMotion, spinProgress]);

  // Pulse animation for offline indicator
  React.useEffect(() => {
    if (!isOnline && !reduceMotion) {
      pulseProgress.value = withRepeat(
        withTiming(1, { duration: 2000 }),
        -1,
        true
      );
    } else {
      pulseProgress.value = 0;
    }
  }, [isOnline, reduceMotion, pulseProgress]);

  // Animated styles
  const expandAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      expandProgress.value,
      [0, 1],
      [0, 120],
      Extrapolation.CLAMP
    ),
    opacity: expandProgress.value,
  }));

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(expandProgress.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  const spinAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinProgress.value * 360}deg` }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      pulseProgress.value,
      [0, 0.5, 1],
      [1, 0.5, 1],
      Extrapolation.CLAMP
    ),
  }));

  // Don't render if online and no queued items (unless forceShow)
  if (!forceShow && isOnline && !hasQueuedItems) {
    return null;
  }

  // Don't render if online with no items
  if (!forceShow && !hasQueuedItems && isOnline) {
    return null;
  }

  const isProcessing = processingState?.isProcessing ?? false;
  const displayStats = externalStats ?? stats;

  // Determine banner state
  const isOffline = !isOnline;
  const hasPendingItems = hasQueuedItems;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePress}
        style={styles.banner}
        accessibilityRole="button"
        accessibilityLabel={
          isOffline
            ? `Offline. ${queueCount} items pending sync`
            : `${queueCount} items waiting to sync`
        }
        accessibilityHint="Tap to expand details"
      >
        {/* Left icon */}
        <Animated.View style={[styles.iconContainer, pulseAnimatedStyle]}>
          {isOffline ? (
            <WifiOff size={20} color="#F97316" />
          ) : isProcessing ? (
            <Animated.View style={spinAnimatedStyle}>
              <RefreshCw size={20} color="#0EA5E9" />
            </Animated.View>
          ) : hasPendingItems ? (
            <CloudOff size={20} color="#F59E0B" />
          ) : (
            <Cloud size={20} color="#10B981" />
          )}
        </Animated.View>

        {/* Main content */}
        <View style={styles.content}>
          <Text style={styles.title}>
            {isOffline
              ? 'You\'re Offline'
              : isProcessing
              ? 'Syncing...'
              : hasPendingItems
              ? 'Pending Sync'
              : 'All Synced'}
          </Text>
          <Text style={styles.subtitle}>
            {isProcessing && processingState
              ? `${processingState.processedCount}/${processingState.totalItems} items`
              : hasPendingItems
              ? `${queueCount} item${queueCount !== 1 ? 's' : ''} waiting`
              : 'Everything is up to date'}
          </Text>
        </View>

        {/* Progress bar when processing */}
        {isProcessing && processingState && (
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${processingState.progress * 100}%` },
              ]}
            />
          </View>
        )}

        {/* Sync button or chevron */}
        {showSyncButton && isOnline && hasPendingItems && !isProcessing ? (
          <Pressable
            onPress={handleSyncPress}
            style={styles.syncButton}
            accessibilityRole="button"
            accessibilityLabel="Sync now"
          >
            <RefreshCw size={16} color="#FFFFFF" />
            <Text style={styles.syncButtonText}>Sync</Text>
          </Pressable>
        ) : (
          <Animated.View style={chevronAnimatedStyle}>
            <ChevronDown size={20} color="#71717A" />
          </Animated.View>
        )}
      </Pressable>

      {/* Expandable details */}
      <Animated.View style={[styles.expandedContent, expandAnimatedStyle]}>
        {displayStats && (
          <View style={styles.statsContainer}>
            {/* Items by type */}
            <Text style={styles.statsHeader}>Pending Items:</Text>
            <View style={styles.statsList}>
              {(Object.entries(displayStats.byType) as [OfflineSubmissionType, number][])
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
            {displayStats.failedItems > 0 && (
              <View style={styles.warningContainer}>
                <AlertTriangle size={14} color="#F59E0B" />
                <Text style={styles.warningText}>
                  {displayStats.failedItems} item{displayStats.failedItems !== 1 ? 's' : ''} failed to sync
                </Text>
              </View>
            )}

            {/* Oldest item */}
            {displayStats.oldestItemAt && (
              <Text style={styles.ageText}>
                Oldest: {formatRelativeTime(displayStats.oldestItemAt)}
              </Text>
            )}
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  ageText: {
    color: '#71717A',
    fontSize: 12,
    marginTop: 10,
  },
  banner: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  container: {
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  expandedContent: {
    overflow: 'hidden',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    marginRight: 12,
    width: 36,
  },
  progressBar: {
    backgroundColor: '#0EA5E9',
    height: '100%',
  },
  progressContainer: {
    backgroundColor: '#E4E4E7',
    bottom: 0,
    height: 3,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  statsContainer: {
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  statsDot: {
    backgroundColor: '#A1A1AA',
    borderRadius: 3,
    height: 6,
    marginRight: 8,
    width: 6,
  },
  statsHeader: {
    color: '#52525B',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  statsItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statsList: {
    gap: 6,
  },
  statsText: {
    color: '#3F3F46',
    fontSize: 14,
  },
  subtitle: {
    color: '#71717A',
    fontSize: 13,
    marginTop: 2,
  },
  syncButton: {
    alignItems: 'center',
    backgroundColor: '#0EA5E9',
    borderRadius: 16,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    color: '#27272A',
    fontSize: 15,
    fontWeight: '600',
  },
  warningContainer: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  warningText: {
    color: '#92400E',
    fontSize: 13,
    marginLeft: 6,
  },
});

export default OfflinePendingBanner;
