/**
 * EmptyState - Shown when user has no habits yet
 * Theme-aware with dark mode support and spring animations
 */
import React from 'react';
import { View, Text } from 'react-native';
import { BarChart3, Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { spacing } from '../../../theme/spacing';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export const EmptyState: React.FC = () => {
  const { colors: tc, isDark } = useThemeColors();

  const accentColor = isDark ? '#A78BFA' : '#8b5cf6';
  const accentBg = isDark ? '#1E1B4B' : '#F5F3FF';
  const amberColor = isDark ? '#FBBF24' : '#F59E0B';
  const amberTextColor = isDark ? '#FCD34D' : '#B45309';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing['2xl'] }}>
      {/* Illustration */}
      <Animated.View
        entering={anim(0)}
        style={{
          marginBottom: spacing.lg,
          height: 96,
          width: 96,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 24,
          backgroundColor: accentBg,
          shadowColor: accentColor,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
        }}
      >
        <BarChart3 color={accentColor} size={48} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={anim(50)}
        style={{
          fontSize: 22,
          fontWeight: '700',
          letterSpacing: -0.5,
          color: tc.text.primary,
          marginBottom: spacing.xs,
          textAlign: 'center',
        }}
      >
        No Analytics Yet
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        entering={anim(100)}
        style={{
          fontSize: 17,
          lineHeight: 22,
          letterSpacing: -0.41,
          color: tc.text.secondary,
          textAlign: 'center',
          maxWidth: 280,
          marginBottom: spacing.xl,
        }}
      >
        Create habits and track them for a few days to unlock your insights dashboard.
      </Animated.Text>

      {/* Steps Card */}
      <Animated.View
        entering={anim(150)}
        style={{
          width: '100%',
          borderRadius: 16,
          backgroundColor: tc.card,
          borderColor: tc.cardBorder,
          borderWidth: 1,
          padding: spacing.lg,
          shadowColor: isDark ? '#000000' : '#1c1917',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md }}>
          <Sparkles color={amberColor} size={16} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: amberTextColor, letterSpacing: 0.5 }}>
            GET STARTED
          </Text>
        </View>
        <View style={{ gap: 12 }}>
          <StepItem number='1' text='Go to Home tab' tc={tc} isDark={isDark} />
          <StepItem number='2' text='Create your first habit' tc={tc} isDark={isDark} />
          <StepItem number='3' text='Track it daily' tc={tc} isDark={isDark} />
          <StepItem number='4' text='Come back to see insights!' tc={tc} isDark={isDark} />
        </View>
      </Animated.View>
    </View>
  );
};

function StepItem({
  number,
  text,
  tc,
  isDark,
}: {
  number: string;
  text: string;
  tc: ReturnType<typeof import('../../../theme').useThemeColors>['colors'];
  isDark: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View
        style={{
          height: 28,
          width: 28,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          backgroundColor: isDark ? '#374151' : '#F5F5F4',
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: '600', color: tc.text.secondary }}>
          {number}
        </Text>
      </View>
      <Text style={{ fontSize: 17, color: tc.text.primary, letterSpacing: -0.41 }}>{text}</Text>
    </View>
  );
}
