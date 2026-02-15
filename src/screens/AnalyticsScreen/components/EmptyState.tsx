/* eslint-disable max-lines */
/**
 * EmptyState - OPTIMIZED: FadeInUp animation, better visuals, dark mode
 */
import React from 'react';
import { View, Text } from 'react-native';
import { BarChart3, Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export const EmptyState: React.FC = () => {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}>
      {/* Illustration */}
      <Animated.View
        entering={anim(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#2E1065' : '#F5F3FF',
          borderRadius: 24,
          height: 96,
          justifyContent: 'center',
          marginBottom: 24,
          shadowColor: '#8b5cf6',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          width: 96,
        }}
      >
        <BarChart3 color={isDark ? '#C4B5FD' : '#8b5cf6'} size={48} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={anim(50)}
        style={{
          color: colors.text.primary,
          fontSize: 22,
          fontWeight: '700',
          letterSpacing: -0.5,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        No Analytics Yet
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        entering={anim(100)}
        style={{
          color: colors.text.secondary,
          fontSize: 17,
          lineHeight: 22,
          marginBottom: 32,
          maxWidth: 280,
          textAlign: 'center',
        }}
      >
        Create habits and track them for a few days to unlock your insights
        dashboard.
      </Animated.Text>

      {/* Steps Card */}
      <Animated.View
        entering={anim(150)}
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 20,
          shadowColor: colors.text.primary,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          width: '100%',
        }}
      >
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <Sparkles color={isDark ? '#FCD34D' : '#F59E0B'} size={16} />
          <Text style={{ color: isDark ? '#FCD34D' : '#D97706', fontSize: 13, fontWeight: '600' }}>
            GET STARTED
          </Text>
        </View>
        <View style={{ gap: 12 }}>
          <StepItem colors={colors} number='1' text='Go to Home tab' />
          <StepItem colors={colors} number='2' text='Create your first habit' />
          <StepItem colors={colors} number='3' text='Track it daily' />
          <StepItem colors={colors} number='4' text='Come back to see insights!' />
        </View>
      </Animated.View>
    </View>
  );
};

function StepItem({ number, text, colors }: { number: string; text: string; colors: { gray: Record<string, string>; text: { primary: string; secondary: string } } }) {
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 12 }}>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.gray[100],
          borderRadius: 14,
          height: 28,
          justifyContent: 'center',
          width: 28,
        }}
      >
        <Text style={{ color: colors.text.secondary, fontSize: 13, fontWeight: '600' }}>
          {number}
        </Text>
      </View>
      <Text style={{ color: colors.text.primary, fontSize: 17 }}>{text}</Text>
    </View>
  );
}
