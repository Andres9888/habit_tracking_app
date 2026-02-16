/**
 * TipsSection - Tips for building habit strength
 * Dark-mode aware version
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

const TIPS = [
  'Consistency beats intensity — daily small wins add up',
  "Don't break the chain — each day matters",
  'If you miss, get back immediately — decay is gradual',
  'Watch your 30-day comparison to track progress',
];

export function TipsSection() {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: isDark ? colors.gray[100] : colors.gray[50],
        borderColor: colors.border,
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
      }}
    >
      <Text
        style={{
          color: colors.text.primary,
          fontSize: 15,
          fontWeight: '600',
          marginBottom: 12,
        }}
      >
        💡 Tips for Building Strength
      </Text>
      <View style={{ gap: 8 }}>
        {TIPS.map((tip, index) => (
          <Text
            key={index}
            style={{
              color: colors.text.secondary,
              fontSize: 13,
              lineHeight: 20,
            }}
          >
            • {tip}
          </Text>
        ))}
      </View>
    </View>
  );
}
