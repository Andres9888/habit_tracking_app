/**
 * AnalyticsScreen EmptyState
 * Theme-aware, on-brand emerald palette, engaging onboarding steps
 */
import React from 'react';
import { View } from 'react-native';
import { BarChart3, Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export const EmptyState: React.FC = () => {
  const { colors } = useThemeColors();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}>
      {/* Illustration */}
      <Animated.View
        entering={anim(0)}
        style={{
          width: 96,
          height: 96,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary[100],
          marginBottom: 24,
          shadowColor: colors.primary[500],
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }}
      >
        <BarChart3 color={colors.primary[500]} size={48} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={anim(50)}
        style={{
          fontSize: 22,
          fontWeight: '700',
          letterSpacing: -0.5,
          color: colors.text.primary,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        Your Insights Are Brewing
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        entering={anim(100)}
        style={{
          fontSize: 17,
          lineHeight: 22,
          color: colors.text.secondary,
          textAlign: 'center',
          maxWidth: 280,
          marginBottom: 32,
        }}
      >
        Track habits for a few days and we'll paint a picture of your progress.
      </Animated.Text>

      {/* Steps Card */}
      <Animated.View
        entering={anim(150)}
        style={{
          width: '100%',
          borderRadius: 16,
          backgroundColor: colors.card,
          padding: 20,
          shadowColor: colors.text.primary,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Sparkles color='#f59e0b' size={16} />
          <Animated.Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: '#d97706',
              letterSpacing: 0.5,
            }}
          >
            GET STARTED
          </Animated.Text>
        </View>
        <View style={{ gap: 12 }}>
          <StepItem colors={colors} number='1' text='Create a habit on the Home tab' />
          <StepItem colors={colors} number='2' text='Check it off each day' />
          <StepItem colors={colors} number='3' text='Come back here for insights' />
        </View>
      </Animated.View>
    </View>
  );
};

function StepItem({ number, text, colors }: { number: string; text: string; colors: any }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary[100],
        }}
      >
        <Animated.Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: colors.primary[500],
          }}
        >
          {number}
        </Animated.Text>
      </View>
      <Animated.Text style={{ fontSize: 17, color: colors.text.primary }}>
        {text}
      </Animated.Text>
    </View>
  );
}
