/**
 * SyncedToast Component
 *
 * A brief, non-blocking toast notification that confirms successful sync.
 * Implements US3 (Visual Sync Status Indicators) acceptance criteria 3:
 * "Given sync completes, When done, Then pending indicators disappear, brief 'Synced' confirmation"
 *
 * Implements FR-009: Display subtle, non-blocking indicators for sync status
 */

import React from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

import { useThemeColors } from '../../../theme/ThemeContext';
import type { SyncedToastProps } from './types';
import { useSyncedToastAnimations } from './useSyncedToastAnimations';

const DEFAULT_DURATION = 2000;
const ICON_SIZE = 12;

export function SyncedToast({
  visible = false,
  syncedCount,
  duration = DEFAULT_DURATION,
  onDismiss,
  style,
  testID = 'synced-toast',
}: SyncedToastProps) {
  const { isDark } = useThemeColors();
  const { animatedStyle, shouldRender } = useSyncedToastAnimations({
    duration,
    onHidden: onDismiss,
    visible,
  });

  if (!shouldRender) {
    return null;
  }

  const palette = isDark
    ? {
        bg: '#052e16',       // green-950
        border: '#14532d',   // green-900
        iconBg: '#064e3b',   // green-900/emerald
        iconColor: '#4ade80', // green-400
        text: '#86efac',     // green-300
      }
    : {
        bg: '#f0fdf4',       // green-50
        border: '#86efac',   // green-300
        iconBg: '#dcfce7',   // green-100
        iconColor: '#16a34a', // green-600
        text: '#166534',     // green-800
      };

  const showCount = syncedCount !== undefined && syncedCount > 0;
  const accessibilityLabel = showCount
    ? `Synced ${syncedCount} change${syncedCount === 1 ? '' : 's'}`
    : 'Changes synced';

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
        <Check color={palette.iconColor} size={ICON_SIZE} strokeWidth={2.5} />
      </Animated.View>
      <Text
        style={{
          color: palette.text,
          fontSize: 12,
          fontWeight: '500',
          letterSpacing: 0.2,
        }}
      >
        Synced
      </Text>
      {showCount && (
        <Text
          style={{ color: palette.text, fontSize: 12, fontWeight: '500' }}
          testID={`${testID}-count`}
        >
          ({syncedCount})
        </Text>
      )}
    </Animated.View>
  );
}

export default SyncedToast;
