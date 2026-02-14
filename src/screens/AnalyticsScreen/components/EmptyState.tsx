/**
 * EmptyState - OPTIMIZED: FadeInUp animation, better visuals, engaging illustration
 * Dark mode aware via useThemeColors
 */
import React from 'react';
import { View, Text } from 'react-native';
import { BarChart3, Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export const EmptyState: React.FC = () => {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}>
      {/* Illustration */}
      <Animated.View
        entering={anim(0)}
        style={{
          marginBottom: 24,
          height: 96,
          width: 96,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 24,
          backgroundColor: isDark ? '#2E1065' : '#F5F3FF',
          shadowColor: '#8b5cf6',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: isDark ? 0.2 : 0.08,
          shadowRadius: 16,
        }}
      >
        <BarChart3 color={isDark ? '#A78BFA' : '#8b5cf6'} size={48} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={anim(50)}
        style={{ marginBottom: 8, textAlign: 'center', fontWeight: '700', color: colors.text.primary, fontSize: 22, letterSpacing: -0.5 }}
      >
        No Analytics Yet
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        entering={anim(100)}
        style={{ marginBottom: 32, textAlign: 'center', fontSize: 17, lineHeight: 22, color: colors.text.secondary, maxWidth: 280 }}
      >
        Create habits and track them for a few days to unlock your insights
        dashboard.
      </Animated.Text>

      {/* Steps Card */}
      <Animated.View
        entering={anim(150)}
        style={{
          width: '100%',
          borderRadius: 16,
          backgroundColor: colors.card,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.cardBorder,
          shadowColor: isDark ? '#000' : '#1c1917',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 16,
        }}
      >
        <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Sparkles color={isDark ? '#FBBF24' : '#f59e0b'} size={16} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: isDark ? '#FBBF24' : '#D97706' }}>
            GET STARTED
          </Text>
        </View>
        <View style={{ gap: 12 }}>
          <StepItem colors={colors} isDark={isDark} number='1' text='Go to Home tab' />
          <StepItem colors={colors} isDark={isDark} number='2' text='Create your first habit' />
          <StepItem colors={colors} isDark={isDark} number='3' text='Track it daily' />
          <StepItem colors={colors} isDark={isDark} number='4' text='Come back to see insights!' />
        </View>
      </Animated.View>
    </View>
  );
};

function StepItem({ number, text, colors, isDark }: { number: string; text: string; colors: any; isDark: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ height: 28, width: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: colors.gray[200] }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text.secondary }}>
          {number}
        </Text>
      </View>
      <Text style={{ fontSize: 17, color: colors.text.primary }}>{text}</Text>
    </View>
  );
}
