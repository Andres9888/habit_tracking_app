/**
 * Empty state for HabitStrengthSection
 * ENHANCED: Growth-focused messaging, emphasizes potential
 */
import React from 'react';
import { Text, View } from 'react-native';
import { Sprout } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        shadowColor: colors.text.primary,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      }}
    >
      <Text
        style={{
          color: colors.text.primary,
          fontSize: 17,
          fontWeight: '700',
          marginBottom: 16,
        }}
      >
        Habit Strength
      </Text>
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 24 }}>
        {/* Icon */}
        <Animated.View
          entering={anim(0)}
          style={{
            alignItems: 'center',
            backgroundColor: isDark ? '#064E3B' : '#ECFDF5',
            borderRadius: 20,
            height: 56,
            justifyContent: 'center',
            marginBottom: 12,
            width: 56,
          }}
        >
          <Sprout color={isDark ? '#6EE7B7' : '#059669'} size={28} />
        </Animated.View>

        {/* Headline */}
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
          Ready to Grow!
        </Animated.Text>

        {/* Description */}
        <Animated.Text
          entering={anim(120)}
          style={{
            color: colors.text.secondary,
            fontSize: 14,
            lineHeight: 20,
            marginBottom: 16,
            maxWidth: 240,
            textAlign: 'center',
          }}
        >
          Your first completion plants the seed. Each day makes it stronger.
        </Animated.Text>

        {/* Progress Indicator */}
        <Animated.View
          entering={anim(180)}
          style={{
            backgroundColor: isDark ? '#064E3B' : '#D1FAE5',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <Text style={{ color: isDark ? '#6EE7B7' : '#047857', fontSize: 12, fontWeight: '500' }}>
            🌟 Complete today to start building!
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}
