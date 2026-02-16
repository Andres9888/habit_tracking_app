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

import { useThemeColors } from '../../../theme/ThemeContext';
import type { PendingSyncBadgeProps } from './types';
import { usePendingSyncBadge } from './usePendingSyncBadge';

const ICON_SIZES = { small: 8, medium: 10 } as const;

export function PendingSyncBadge({
  visible = false,
  size = 'small',
  style,
  testID = 'pending-sync-badge',
}: PendingSyncBadgeProps) {
  const { isDark } = useThemeColors();
  const { animatedStyle, shouldRender } = usePendingSyncBadge({ visible });

  if (!shouldRender) {
    return null;
  }

  const palette = isDark
    ? { bg: '#451a03', border: '#78350f', icon: '#fbbf24' }
    : { bg: '#fef3c7', border: '#fcd34d', icon: '#d97706' };

  const iconSize = ICON_SIZES[size];
  const badgeSize = size === 'small' ? { height: 14, width: 14, borderRadius: 4 } : { height: 18, width: 18, borderRadius: 6 };

  return (
    <Animated.View
      accessible
      accessibilityHint='This habit has changes waiting to sync'
      accessibilityLabel='Pending sync'
      accessibilityRole='image'
      style={[{ alignItems: 'center', justifyContent: 'center' }, animatedStyle, style]}
      testID={testID}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderWidth: 1,
          justifyContent: 'center',
          ...badgeSize,
        }}
      >
        <Cloud color={palette.icon} size={iconSize} strokeWidth={2.5} />
      </View>
    </Animated.View>
  );
}

export default PendingSyncBadge;
