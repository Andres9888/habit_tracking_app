/**
 * ConflictNotification Component
 *
 * A brief, non-blocking notification that informs users when sync conflicts
 * were detected and automatically resolved using the completion-wins strategy.
 *
 * Implements US4 (Graceful Conflict Resolution) acceptance criteria 2:
 * "Given conflict occurs, When user notified, Then informational only, no action required"
 *
 * Implements FR-009: Display subtle, non-blocking indicators for sync status
 */

import React from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { GitMerge } from 'lucide-react-native';

import { useThemeColors } from '../../../theme/ThemeContext';
import type { ConflictNotificationProps } from './types';
import { useConflictNotificationAnimations } from './useConflictNotificationAnimations';

const DEFAULT_DURATION = 3000;
const ICON_SIZE = 12;

export function ConflictNotification({
  visible = false,
  conflictCount,
  duration = DEFAULT_DURATION,
  onDismiss,
  style,
  testID = 'conflict-notification',
}: ConflictNotificationProps) {
  const { isDark } = useThemeColors();
  const { animatedStyle, shouldRender } = useConflictNotificationAnimations({
    duration,
    onHidden: onDismiss,
    visible,
  });

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
      }
    : {
        bg: '#fffbeb',       // amber-50
        border: '#fcd34d',   // amber-300
        iconBg: '#fef3c7',   // amber-100
        iconColor: '#d97706', // amber-600
        text: '#92400e',     // amber-800
      };

  const showCount = conflictCount !== undefined && conflictCount > 0;
  const accessibilityLabel = showCount
    ? `${conflictCount} sync conflict${conflictCount === 1 ? '' : 's'} resolved`
    : 'Sync conflict resolved';

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
          paddingHorizontal: 12,
          paddingVertical: 6,
        },
        animatedStyle,
        style,
      ]}
      testID={testID}
    >
      <Animated.View
        style={{
          alignItems: 'center',
          backgroundColor: palette.iconBg,
          borderRadius: 8,
          height: 20,
          justifyContent: 'center',
          width: 20,
        }}
      >
        <GitMerge color={palette.iconColor} size={ICON_SIZE} strokeWidth={2.5} />
      </Animated.View>
      <Text
        style={{
          color: palette.text,
          fontSize: 12,
          fontWeight: '500',
          letterSpacing: 0.2,
        }}
      >
        Conflict resolved
      </Text>
      {showCount && (
        <Text
          style={{ color: palette.text, fontSize: 12, fontWeight: '500' }}
          testID={`${testID}-count`}
        >
          ({conflictCount})
        </Text>
      )}
    </Animated.View>
  );
}

export default ConflictNotification;
