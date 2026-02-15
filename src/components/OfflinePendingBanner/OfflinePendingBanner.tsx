/**
 * OfflinePendingBanner Component
 * UI component showing pending offline submissions
 */

import React from 'react';
import { View, Pressable } from 'react-native';

import type { OfflinePendingBannerProps } from './types';
import {
  useOfflineBannerAnimations,
  useOfflineBannerHandlers,
} from './OfflinePendingBanner.hooks';
import { BannerContent } from './BannerContent';
import { BannerIcon } from './BannerIcon';
import { ExpandedStats } from './ExpandedStats';
import { ProgressBar } from './ProgressBar';
import { SyncButton } from './SyncButton';
import { styles } from './OfflinePendingBanner.styles';
import { useOfflineBannerState } from './useOfflineBannerState';

export function OfflinePendingBanner({
  processingState,
  reduceMotion = false,
  onPress,
  onSyncPress,
  showSyncButton = true,
  queueStats: externalStats,
  forceShow = false,
}: OfflinePendingBannerProps) {
  const state = useOfflineBannerState({
    forceShow,
    processingState,
    queueStats: externalStats,
  });

  const animations = useOfflineBannerAnimations({
    isOnline: state.isOnline,
    isProcessing: state.isProcessing,
    reduceMotion,
  });

  const handlers = useOfflineBannerHandlers({
    expandProgress: animations.expandProgress,
    externalStats,
    getStats: state.getStats,
    isExpanded: state.isExpanded,
    onPress,
    onSyncPress,
    setIsExpanded: state.setIsExpanded,
    setStats: state.setStats,
  });

  if (!state.shouldRender) return null;

  const a11yLabel = state.isOffline
    ? `Offline. ${state.queueCount} items pending sync`
    : `${state.queueCount} items waiting to sync`;

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityHint='Tap to expand details'
        accessibilityLabel={a11yLabel}
        accessibilityRole='button'
        style={styles.banner}
        onPress={handlers.handlePress}
      >
        <BannerIcon
          hasPendingItems={state.hasPendingItems}
          isOffline={state.isOffline}
          isProcessing={state.isProcessing}
          pulseAnimatedStyle={animations.pulseAnimatedStyle}
          spinAnimatedStyle={animations.spinAnimatedStyle}
        />

        <BannerContent
          hasPendingItems={state.hasPendingItems}
          isOffline={state.isOffline}
          isProcessing={state.isProcessing}
          processingState={processingState}
          queueCount={state.queueCount}
        />

        <ProgressBar
          isProcessing={state.isProcessing}
          processingState={processingState}
        />

        <SyncButton
          chevronAnimatedStyle={animations.chevronAnimatedStyle}
          hasPendingItems={state.hasPendingItems}
          isOnline={state.isOnline}
          isProcessing={state.isProcessing}
          showSyncButton={showSyncButton}
          onSyncPress={handlers.handleSyncPress}
        />
      </Pressable>

      <ExpandedStats
        expandAnimatedStyle={animations.expandAnimatedStyle}
        stats={state.displayStats}
      />
    </View>
  );
}

export default OfflinePendingBanner;
