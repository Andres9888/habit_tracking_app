/**
 * StreakEmptyState - Shown when no streak records exist
 * Standardized: FadeInUp animation, proper typography, dark mode
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography } from '@/theme/typography';
import { borderRadius, spacing } from '@/theme/spacing';
import { iconSizes } from '@/theme/iconSizes';
import { enterEasing } from '@/theme/animations';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).easing(enterEasing);

export function StreakEmptyState() {
  const { colors, isDark } = useThemeColors();

  return (
    <Animated.View
      accessibilityLabel='No streak records yet.'
      entering={anim(0)}
      style={{
        alignItems: 'center',
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderRadius: borderRadius.medium,
        borderWidth: 1,
        marginTop: 12,
        padding: spacing.lg,
        shadowColor: colors.text.primary,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#431407' : '#FFF7ED',
          borderRadius: 20,
          height: 40,
          justifyContent: 'center',
          marginBottom: 12,
          width: 40,
        }}
      >
        <Flame color={isDark ? '#FDBA74' : '#F97316'} size={iconSizes.medium} strokeWidth={1.5} />
      </View>
      <Text
        style={{
          ...typography.button,
          color: colors.text.primary,
          marginBottom: 4,
          textAlign: 'center',
        }}
      >
        No Streaks Yet
      </Text>
      <Text
        style={{
          ...typography.caption,
          color: colors.text.secondary,
          textAlign: 'center',
        }}
      >
        Complete 2+ consecutive days to start tracking streaks
      </Text>
    </Animated.View>
  );
}
