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

import { useThemeColors } from '../../../theme/ThemeContext';
import type { SyncingIndicatorProps } from './types';
import { useSyncingIndicator } from './useSyncingIndicator';

const ICON_SIZE = 12;

export function SyncingIndicator({
  visible = false,
  pendingCount,
  style,
  testID = 'syncing-indicator',
}: SyncingIndicatorProps) {
  const { colors, isDark } = useThemeColors();
  const { animatedContainerStyle, animatedSpinnerStyle, shouldRender } =
    useSyncingIndicator({ visible });

  if (!shouldRender) {
    return null;
  }

  const palette = isDark
    ? {
        bg: '#422006',       // amber-950
        border: '#78350f',   // amber-900
        iconBg: '#451a03',   // amber-950 deeper
        iconColor: '#fbbf24', // amber-400
        text: '#fcd34d',     // amber-300
        badgeBg: '#d97706',  // amber-600
        badgeText: '#fff',
      }
    : {
        bg: '#fffbeb',       // amber-50
        border: '#fde68a',   // amber-200
        iconBg: '#fef3c7',   // amber-100
        iconColor: '#d97706', // amber-600
        text: '#92400e',     // amber-800
        badgeBg: '#f59e0b',  // amber-500
        badgeText: '#fff',
      };

  const accessibilityLabel = pendingCount
    ? `Syncing ${pendingCount} change${pendingCount === 1 ? '' : 's'}`
    : 'Syncing changes';

  return (
    <Animated.View
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityLiveRegion='polite'
      accessibilityRole='alert'
      style={[
        {
          alignItems: 'center',
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderRadius: 16,
          borderWidth: 1,
          flexDirection: 'row' as const,
          gap: 6,
          paddingHorizontal: 10,
          paddingVertical: 6,
        },
        animatedContainerStyle,
        style,
      ]}
      testID={testID}
    >
      <Animated.View
        style={[
          {
            alignItems: 'center',
            backgroundColor: palette.iconBg,
            borderRadius: 8,
            height: 20,
            justifyContent: 'center',
            width: 20,
          },
          animatedSpinnerStyle,
        ]}
      >
        <RefreshCw color={palette.iconColor} size={ICON_SIZE} strokeWidth={2.5} />
      </Animated.View>
      <Text
        style={{
          color: palette.text,
          fontSize: 12,
          fontWeight: '500',
          letterSpacing: 0.2,
        }}
      >
        Syncing
      </Text>
      {pendingCount !== undefined && pendingCount > 0 && (
        <View
          style={{
            backgroundColor: palette.badgeBg,
            borderRadius: 6,
            marginLeft: 2,
            minWidth: 16,
            paddingHorizontal: 4,
            paddingVertical: 1,
          }}
          testID={`${testID}-count`}
        >
          <Text
            style={{
              color: palette.badgeText,
              fontSize: 10,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {pendingCount}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

export default SyncingIndicator;
