/**
 * Empty state when no habits exist
 * ENHANCED: More motivational messaging, growth-focused
 */

import { View, Text } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}>
      {/* Icon */}
      <Animated.View
        entering={anim(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#2E1065' : '#F5F3FF',
          borderRadius: 16,
          height: 80,
          justifyContent: 'center',
          marginBottom: 20,
          shadowColor: '#8b5cf6',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          width: 80,
        }}
      >
        <TrendingUp color={isDark ? '#C4B5FD' : '#8B5CF6'} size={40} strokeWidth={1.5} />
      </Animated.View>

      {/* Headline */}
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
        Your Stats Journey Starts Now!
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        entering={anim(120)}
        style={{
          color: colors.text.secondary,
          fontSize: 17,
          lineHeight: 22,
          marginBottom: 24,
          maxWidth: 280,
          textAlign: 'center',
        }}
      >
        Complete your first habit to start tracking your progress and growth
      </Animated.Text>

      {/* Motivation Card */}
      <Animated.View
        entering={anim(180)}
        style={{
          backgroundColor: isDark ? '#064E3B' : '#ECFDF5',
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          width: '100%',
        }}
      >
        <Text style={{ color: isDark ? '#6EE7B7' : '#047857', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>
          🎯 Every expert was once a beginner. Your first completion is the start of something great!
        </Text>
      </Animated.View>
    </View>
  );
}
