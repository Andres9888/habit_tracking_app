/**
 * TierLegend — shows all 5 strength tiers with emojis and thresholds.
 * Used in the HabitStrengthInfoModal to make the tier system transparent.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

const TIERS = [
  { emoji: '🌱', label: 'Starting', range: '0–19%', description: 'Just beginning — every day counts' },
  { emoji: '🌿', label: 'Building', range: '20–39%', description: 'Taking root — keep it up' },
  { emoji: '🌳', label: 'Developing', range: '40–59%', description: 'Growing stronger each day' },
  { emoji: '💪', label: 'Strong', range: '60–79%', description: 'Well-established habit' },
  { emoji: '⚡', label: 'Automatic', range: '80–100%', description: 'Part of who you are' },
];

export function TierLegend() {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: isDark ? colors.gray[100] : colors.gray[50],
        borderColor: colors.border,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 20,
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
        Strength Tiers
      </Text>
      {TIERS.map((tier, i) => (
        <View
          key={tier.label}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10,
            marginBottom: i < TIERS.length - 1 ? 10 : 0,
          }}
        >
          <Text style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{tier.emoji}</Text>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
              <Text style={{ color: colors.text.primary, fontSize: 14, fontWeight: '600' }}>
                {tier.label}
              </Text>
              <Text style={{ color: colors.text.secondary, fontSize: 12 }}>
                {tier.range}
              </Text>
            </View>
            <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 1 }}>
              {tier.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
