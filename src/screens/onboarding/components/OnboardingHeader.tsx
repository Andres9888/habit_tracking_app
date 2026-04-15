/**
 * OnboardingHeader — reusable title + subtitle for onboarding steps.
 */

import { Text } from 'react-native';
import Animated, { FadeInUp, useReducedMotion } from 'react-native-reanimated';

import { useThemeColors } from '../../../theme/ThemeContext';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

interface OnboardingHeaderProps {
  subtitle: string;
  title: string;
}

export function OnboardingHeader({ subtitle, title }: OnboardingHeaderProps) {
  const { colors } = useThemeColors();
  const shouldReduceMotion = useReducedMotion();
  const entering = shouldReduceMotion
    ? undefined
    : FadeInUp.delay(200).springify().damping(18);

  return (
    <Animated.View
      entering={entering}
      style={{ gap: spacing.md, paddingHorizontal: spacing.xl }}
    >
      <Text style={[typography.displayLarge, { color: colors.primary[700] }]}>
        {title}
      </Text>
      <Text style={[typography.body, { color: colors.text.secondary }]}>
        {subtitle}
      </Text>
    </Animated.View>
  );
}
