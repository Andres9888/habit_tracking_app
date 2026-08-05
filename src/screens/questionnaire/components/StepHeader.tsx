/**
 * StepHeader - Overline, headline, and subtitle for questionnaire steps.
 */

import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface StepHeaderProps {
  overline?: string;
  headline: string;
  subtitle: string;
}

export function StepHeader({ overline, headline, subtitle }: StepHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ marginBottom: spacing.lg }}>
      {overline ? (
        <Animated.Text
          entering={FadeInUp.delay(100).springify().damping(18)}
          style={{ ...typography.overline, color: colors.text.secondary, marginBottom: spacing.sm }}
        >
          {overline}
        </Animated.Text>
      ) : null}
      <Animated.Text
        entering={FadeInUp.delay(200).springify().damping(18)}
        style={{ ...typography.heading1, color: colors.primary[700], marginBottom: spacing.md }}
      >
        {headline}
      </Animated.Text>
      <Animated.Text
        entering={FadeInUp.delay(350).springify().damping(18)}
        style={{ ...typography.body, color: colors.text.secondary }}
      >
        {subtitle}
      </Animated.Text>
    </View>
  );
}
