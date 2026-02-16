/**
 * OfflineIndicator Component
 *
 * A subtle visual indicator showing when the app is offline.
 * Implements US3 (Visual Sync Status Indicators) acceptance criteria 1:
 * "Given no connectivity, When viewing habits, Then subtle offline indicator visible"
 *
 * Implements FR-009: Display subtle, non-blocking indicators for offline status
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { WifiOff } from 'lucide-react-native';

import { useThemeColors } from '../../../theme/ThemeContext';
import type { OfflineIndicatorProps } from './types';
import { useOfflineIndicator } from './useOfflineIndicator';

const ICON_SIZE = 12;

export function OfflineIndicator({
  visible = false,
  style,
  testID = 'offline-indicator',
}: OfflineIndicatorProps) {
  const { isDark } = useThemeColors();
  const { animatedStyle, shouldRender } = useOfflineIndicator({ visible });

  if (!shouldRender) {
    return null;
  }

  const palette = isDark
    ? {
        bg: '#1c1917',       // stone-900
        border: '#292524',   // stone-800
        iconBg: '#292524',   // stone-800
        iconColor: '#78716c', // stone-500
        text: '#a8a29e',     // stone-400
      }
    : {
        bg: '#fafaf9',       // stone-50
        border: '#e7e5e4',   // stone-200
        iconBg: '#f5f5f4',   // stone-100
        iconColor: '#a8a29e', // stone-400
        text: '#78716c',     // stone-500
      };

  return (
    <Animated.View
      accessible
      accessibilityLabel='You are offline. Changes will sync when reconnected.'
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
        animatedStyle,
        style,
      ]}
      testID={testID}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: palette.iconBg,
          borderRadius: 8,
          height: 20,
          justifyContent: 'center',
          width: 20,
        }}
      >
        <WifiOff color={palette.iconColor} size={ICON_SIZE} strokeWidth={2.5} />
      </View>
      <Text
        style={{
          color: palette.text,
          fontSize: 12,
          fontWeight: '500',
          letterSpacing: 0.2,
        }}
      >
        Offline
      </Text>
    </Animated.View>
  );
}

export default OfflineIndicator;
