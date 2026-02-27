/* eslint-disable max-lines */
/**
 * EmptyState - OPTIMIZED: animation (respects reduce-motion), dark mode, accessible
 */
import React from 'react';
import { View, Text } from 'react-native';
import { BarChart3, Sparkles } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies } from '../../../theme/typography';
import { useReducedMotionEntry } from '../../../components/EmptyState/useReducedMotionEntry';

export const EmptyState: React.FC = () => {
  const { colors, isDark } = useThemeColors();
  const { entry } = useReducedMotionEntry();

  return (
    <View
      accessible
      accessibilityLabel='No analytics yet. Create habits and track them for a few days to unlock your insights dashboard.'
      accessibilityRole='text'
      style={{ alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}
    >
      {/* Illustration */}
      <Animated.View
        entering={entry(0)}
        style={{
          alignItems: 'center',
          backgroundColor: colors.primary[100],
          borderRadius: 24,
          height: 96,
          justifyContent: 'center',
          marginBottom: 24,
          shadowColor: colors.primary[500],
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          width: 96,
        }}
      >
        <BarChart3 color={colors.accent} size={48} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={entry(50)}
        style={{
          color: colors.text.primary,
          fontFamily: fontFamilies.primary.display,
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
        entering={entry(100)}
        style={{
          color: colors.text.secondary,
          fontFamily: fontFamilies.primary.text,
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
        entering={entry(150)}
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
          <Text style={{ color: isDark ? '#FCD34D' : '#D97706', fontFamily: fontFamilies.primary.text, fontSize: 13, fontWeight: '600' }}>
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
          borderRadius: 16,
          height: 28,
          justifyContent: 'center',
          width: 28,
        }}
      >
        <Text style={{ color: colors.text.secondary, fontFamily: fontFamilies.primary.text, fontSize: 13, fontWeight: '600' }}>
          {number}
        </Text>
      </View>
      <Text style={{ color: colors.text.primary, fontFamily: fontFamilies.primary.text, fontSize: 17 }}>{text}</Text>
    </View>
  );
}
