/**
 * PendingSyncBadge Component
 *
 * A small badge indicator showing that a habit has pending sync operations.
 * Displays on individual habit cards to indicate unsynced completions.
 *
 * Implements US3 (Visual Sync Status Indicators) acceptance criteria 2:
 * "Given pending completions, When viewing habit, Then subtle 'pending' indicator shows"
 *
 * Implements FR-009: Display subtle, non-blocking indicators for pending sync
 */

import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Cloud } from 'lucide-react-native';

import type { PendingSyncBadgeProps } from './types';
import { styles, ICON_SIZES, ICON_COLOR } from './styles';
import { usePendingSyncBadge } from './usePendingSyncBadge';

export function PendingSyncBadge({
  visible = false,
  size = 'small',
  style,
  testID = 'pending-sync-badge',
}: PendingSyncBadgeProps) {
  const { animatedStyle, shouldRender } = usePendingSyncBadge({ visible });

  if (!shouldRender) {
    return null;
  }

  const iconSize = ICON_SIZES[size];
  const badgeSizeStyle =
    size === 'small' ? styles.badgeSmall : styles.badgeMedium;

  return (
    <Animated.View
      accessible
      accessibilityHint='This habit has changes waiting to sync'
      accessibilityLabel='Pending sync'
      accessibilityRole='image'
      style={[styles.container, animatedStyle, style]}
      testID={testID}
    >
      <View style={[styles.badge, badgeSizeStyle]}>
        <Cloud color={ICON_COLOR} size={iconSize} strokeWidth={2.5} />
      </View>
    </Animated.View>
  );
}

export default PendingSyncBadge;
