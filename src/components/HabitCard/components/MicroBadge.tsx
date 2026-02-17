/**
 * MicroBadge - Displays ⚡ icon for micro-habits (2-5 min duration)
 *
 * Based on the 2-minute rule from James Clear's Atomic Habits
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

interface MicroBadgeProps {
  /** Whether to show the badge (based on habit duration) */
  isMicro: boolean;
  /** Size of the badge: 'small' for compact view, 'normal' for default */
  size?: 'small' | 'normal';
}

export function MicroBadge({ isMicro, size = 'normal' }: MicroBadgeProps) {
  const { isDark } = useThemeColors();

  if (!isMicro) {
    return null;
  }

  const badgeStyles = {
    small: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      fontSize: 10,
      gap: 2,
    },
    normal: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      fontSize: 11,
      gap: 3,
    },
  };

  const currentStyle = badgeStyles[size];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDark ? '#1e3a29' : '#d1fae5',
        borderRadius: 8,
        paddingHorizontal: currentStyle.paddingHorizontal,
        paddingVertical: currentStyle.paddingVertical,
        gap: currentStyle.gap,
      }}
    >
      <Text
        style={{
          fontSize: currentStyle.fontSize,
          color: '#059669',
          fontWeight: '600',
          lineHeight: currentStyle.fontSize + 4,
        }}
      >
        ⚡
      </Text>
      {size === 'normal' && (
        <Text
          style={{
            fontSize: 10,
            color: '#059669',
            fontWeight: '600',
            lineHeight: 12,
          }}
        >
          Micro
        </Text>
      )}
    </View>
  );
}
