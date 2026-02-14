/**
 * HabitRankingsList EmptyState
 * Theme-aware, on-brand emerald palette, engaging copy
 */

import React from 'react';
import { View } from 'react-native';
import { Trophy } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}>
      <Animated.View
        entering={anim(0)}
        style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary[100],
          marginBottom: 16,
          shadowColor: colors.primary[500],
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }}
      >
        <Trophy color={colors.primary[500]} size={40} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        entering={anim(60)}
        style={{
          fontSize: 22,
          fontWeight: '700',
          letterSpacing: -0.5,
          color: colors.text.primary,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        Leaderboard Unlocks Soon
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{
          fontSize: 17,
          lineHeight: 22,
          color: colors.text.secondary,
          textAlign: 'center',
          maxWidth: 280,
        }}
      >
        Complete a few habits and your top performers will show up here.
      </Animated.Text>
    </View>
  );
}
