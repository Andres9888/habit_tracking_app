/**
 * Empty state for HabitStrengthSection
 * Shows when user has no completions yet
 */
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { Easing, FadeInUp } from 'react-native-reanimated';
import { durations } from '../../../theme/animations';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';
import { borderRadius, spacing } from '@/theme/spacing';

const anim = (delay: number) =>
  FadeInUp.duration(durations.enter).delay(delay).easing(Easing.out(Easing.cubic));

export function EmptyState() {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: borderRadius.card,
        padding: spacing.lg,
        shadowColor: colors.text.primary,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      }}
    >
      <Text
        style={{
          color: colors.text.primary,
          fontFamily: fontFamilies.primary.text,
          fontSize: typography.body.fontSize,
          fontWeight: fontWeights.bold,
          marginBottom: 8,
        }}
      >
        Habit Strength
      </Text>
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 32 }}>
        <Animated.Text entering={anim(0)} style={{ fontSize: typography.displayLarge.fontSize, marginBottom: 8 }}>
          🌱
        </Animated.Text>
        <Animated.Text
          entering={anim(60)}
          style={{
            color: colors.text.secondary,
            fontFamily: fontFamilies.primary.text,
            fontSize: typography.bodySmall.fontSize,
            textAlign: 'center',
          }}
        >
          Complete your first day to start building strength!
        </Animated.Text>
      </View>
    </View>
  );
}
