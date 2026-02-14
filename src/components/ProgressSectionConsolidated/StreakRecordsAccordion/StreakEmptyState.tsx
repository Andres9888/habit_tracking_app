/**
 * StreakEmptyState - Shown when no streak records exist
 * Theme-aware with engaging copy
 */

import React from 'react';
import { View } from 'react-native';
import { Flame } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function StreakEmptyState() {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      accessibilityLabel='No streak records yet. Complete two or more consecutive days to start tracking streaks.'
      entering={anim(0)}
      style={{
        marginTop: 12,
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        backgroundColor: colors.card,
        padding: 20,
        shadowColor: colors.text.primary,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFF7ED',
          marginBottom: 12,
        }}
      >
        <Flame color='#f97316' size={20} strokeWidth={1.5} />
      </View>
      <Animated.Text
        entering={anim(60)}
        style={{
          fontSize: 17,
          fontWeight: '600',
          color: colors.text.primary,
          textAlign: 'center',
          marginBottom: 4,
        }}
      >
        Your First Streak Awaits
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{
          fontSize: 13,
          color: colors.text.secondary,
          textAlign: 'center',
          lineHeight: 18,
        }}
      >
        Show up two days in a row and watch the fire grow 🔥
      </Animated.Text>
    </Animated.View>
  );
}
