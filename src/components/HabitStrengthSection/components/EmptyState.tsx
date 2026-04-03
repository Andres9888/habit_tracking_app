/**
 * Empty state for HabitStrengthSection
 * Shows when user has no completions yet
 */
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies } from '@/theme/typography';
import { spacing } from '@/theme';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
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
          fontSize: 17,
          fontWeight: '700',
          marginBottom: 8,
        }}
      >
        Habit Strength
      </Text>
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 32 }}>
        <Animated.Text entering={anim(0)} style={{ fontSize: 34, marginBottom: 8 }}>
          🌱
        </Animated.Text>
        <Animated.Text
          entering={anim(60)}
          style={{
            color: colors.text.secondary,
            fontFamily: fontFamilies.primary.text,
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          Complete your first day to start building strength!
        </Animated.Text>
      </View>
    </View>
  );
}
