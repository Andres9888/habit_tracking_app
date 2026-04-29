/**
 * SyncingIndicator Component
 *
 * A subtle visual indicator showing when sync is in progress.
 * Implements US3 (Visual Sync Status Indicators) acceptance criteria 2:
 * "Given pending completions, When viewing habit, Then subtle 'pending' indicator shows"
 *
 * Implements FR-009: Display subtle, non-blocking indicators for sync progress
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { RefreshCw } from 'lucide-react-native';

import { colors } from '../../../theme/colors/core';
import type { SyncingIndicatorProps } from './types';
import { styles } from './styles';
import { useSyncingIndicator } from './useSyncingIndicator';

const ICON_SIZE = 12;
const ICON_COLOR = colors.warning;

export function SyncingIndicator({
  visible = false,
  pendingCount,
  style,
  testID = 'syncing-indicator',
}: SyncingIndicatorProps) {
  const { animatedContainerStyle, animatedSpinnerStyle, shouldRender } =
    useSyncingIndicator({ visible });

  if (!shouldRender) {
    return null;
  }

  const accessibilityLabel = pendingCount
    ? `Syncing ${pendingCount} change${pendingCount === 1 ? '' : 's'}`
    : 'Syncing changes';

  return (
    <Animated.View
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityLiveRegion='polite'
      accessibilityRole='alert'
      style={[styles.container, animatedContainerStyle, style]}
      testID={testID}
    >
      <Animated.View style={[styles.iconContainer, animatedSpinnerStyle]}>
        <RefreshCw color={ICON_COLOR} size={ICON_SIZE} strokeWidth={2.5} />
      </Animated.View>
      <Text style={styles.text}>Syncing</Text>
      {pendingCount !== undefined && pendingCount > 0 ? <View style={styles.countBadge} testID={`${testID}-count`}>
          <Text style={styles.countText}>{pendingCount}</Text>
        </View> : null}
    </Animated.View>
  );
}

export default SyncingIndicator;
