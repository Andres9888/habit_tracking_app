/**
 * HabitRankingsList EmptyState
 * Dark mode aware via useThemeColors
 */

import React from 'react';
import { View } from 'react-native';
import { ListOrdered } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../theme';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}>
      <Animated.View
        entering={anim(0)}
        style={{
          marginBottom: 16,
          height: 80,
          width: 80,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16,
          backgroundColor: isDark ? '#2E1065' : '#F5F3FF',
          shadowColor: '#8b5cf6',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: isDark ? 0.2 : 0.08,
          shadowRadius: 16,
        }}
      >
        <ListOrdered color={isDark ? '#A78BFA' : '#8b5cf6'} size={40} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        entering={anim(60)}
        style={{ marginBottom: 8, textAlign: 'center', fontWeight: '700', color: colors.text.primary, fontSize: 22, letterSpacing: -0.5 }}
      >
        No Habits to Rank Yet
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{ textAlign: 'center', fontSize: 17, lineHeight: 22, color: colors.text.secondary, maxWidth: 280 }}
      >
        Complete some habits to see your rankings here
      </Animated.Text>
    </View>
  );
}
