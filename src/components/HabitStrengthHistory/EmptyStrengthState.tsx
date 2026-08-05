import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Info, Zap } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '@/theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';
import { iconSizes } from '@/theme/iconSizes';

const SECTION_FADE_DURATION = 400;
const SECTION_SLIDE_DURATION = 400;
const SECTION_SLIDE_DELAY = 200;

interface EmptyStrengthStateProps {
  habitAgeDays: number;
  reduceMotion: boolean;
  onInfoPress?: () => void;
}

/**
 * Encouraging empty state shown when habit has no completions yet.
 */
export function EmptyStrengthState({
  habitAgeDays,
  reduceMotion,
  onInfoPress,
}: EmptyStrengthStateProps) {
  const { colors, isDark } = useThemeColors();
  const entering = reduceMotion
    ? FadeIn.duration(SECTION_FADE_DURATION)
    : FadeInUp.duration(SECTION_SLIDE_DURATION).delay(SECTION_SLIDE_DELAY);

  const message =
    habitAgeDays <= 1
      ? 'Complete your first day to start building strength!'
      : 'Complete today to start building your habit strength!';

  return (
    <Animated.View
      accessible
      accessibilityLabel='Habit strength history - No completions yet'
      entering={entering}
      style={{ gap: 16 }}
      testID='habit-strength-history-empty'
    >
      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: colors.text.primary, fontFamily: fontFamilies.primary.text, fontSize: typography.body.fontSize, fontWeight: fontWeights.semibold }}>
          Strength History
        </Text>
        <Pressable
          accessible
          accessibilityLabel='Learn more about habit strength'
          accessibilityRole='button'
          hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
          testID='strength-history-info-button'
          onPress={onInfoPress}
        >
          <Info color={colors.text.tertiary} size={iconSizes.medium} />
        </Pressable>
      </View>

      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.gray[50],
          borderRadius: borderRadius.medium,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingVertical: 32,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: isDark ? '#451A03' : '#FEF3C7',
            borderRadius: borderRadius.xl,
            height: 48,
            justifyContent: 'center',
            marginBottom: 12,
            width: 48,
          }}
        >
          <Zap color={isDark ? '#FCD34D' : '#D97706'} size={iconSizes.large} />
        </View>
        <Text
          style={{
            color: colors.text.primary,
            fontFamily: fontFamilies.primary.text,
            fontSize: typography.body.fontSize,
            fontWeight: fontWeights.semibold,
            marginBottom: 4,
            textAlign: 'center',
          }}
        >
          Ready to Build Strength
        </Text>
        <Text style={{ color: colors.text.secondary, fontFamily: fontFamilies.primary.text, fontSize: typography.caption.fontSize, textAlign: 'center' }}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}
