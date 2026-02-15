/**
 * HabitRankingsList EmptyState
 * Standardized: FadeInUp animation, Lucide icon, proper typography, dark mode
 */

import React from 'react';
import { View } from 'react-native';
import { ListOrdered } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}>
      <Animated.View
        entering={anim(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#2E1065' : '#F5F3FF',
          borderRadius: 16,
          height: 80,
          justifyContent: 'center',
          marginBottom: 16,
          shadowColor: '#8b5cf6',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          width: 80,
        }}
      >
        <ListOrdered color={isDark ? '#C4B5FD' : '#8b5cf6'} size={40} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        entering={anim(60)}
        style={{
          color: colors.text.primary,
          fontSize: 22,
          fontWeight: '700',
          letterSpacing: -0.5,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        No Habits to Rank Yet
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{
          color: colors.text.secondary,
          fontSize: 17,
          lineHeight: 22,
          maxWidth: 280,
          textAlign: 'center',
        }}
      >
        Complete some habits to see your rankings here
      </Animated.Text>
    </View>
  );
}
