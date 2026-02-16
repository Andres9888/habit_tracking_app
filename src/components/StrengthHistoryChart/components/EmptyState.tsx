/**
 * EmptyState - Displayed when not enough data is available
 * ENHANCED: More encouraging, growth-focused messaging
 */

import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

interface EmptyStateProps {
  height: number;
}

export function EmptyState({ height }: EmptyStateProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: colors.gray[50],
        borderRadius: 12,
        height,
        justifyContent: 'center',
        paddingHorizontal: 24,
      }}
    >
      {/* Icon */}
      <Animated.View
        entering={anim(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#064E3B' : '#ECFDF5',
          borderRadius: 12,
          height: 48,
          justifyContent: 'center',
          marginBottom: 12,
          width: 48,
        }}
      >
        <TrendingUp color={isDark ? '#6EE7B7' : '#059669'} size={24} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={anim(60)}
        style={{
          color: colors.text.primary,
          fontSize: 17,
          fontWeight: '600',
          marginBottom: 4,
          textAlign: 'center',
        }}
      >
        Building Your History
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        entering={anim(120)}
        style={{
          color: colors.text.secondary,
          fontSize: 13,
          lineHeight: 18,
          marginBottom: 10,
          textAlign: 'center',
        }}
      >
        Keep going to unlock your chart!
      </Animated.Text>

      {/* Badge */}
      <Animated.View
        entering={anim(180)}
        style={{
          backgroundColor: isDark ? '#047857' : '#D1FAE5',
          borderRadius: 6,
          paddingHorizontal: 10,
          paddingVertical: 4,
        }}
      >
        <Text style={{ color: isDark ? '#D1FAE5' : '#047857', fontSize: 11, fontWeight: '500' }}>
          📈 Progress in the making
        </Text>
      </Animated.View>
    </View>
  );
}
