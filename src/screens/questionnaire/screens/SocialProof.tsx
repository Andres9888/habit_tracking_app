/**
 * Screen 4: SocialProof - Testimonial and social proof screen.
 * Shows goal-matched testimonial, counter, and star rating.
 */

import { Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography, fontWeights } from '@/theme/typography';
import { borderRadius, spacing, shadows } from '@/theme/spacing';
import { CTAButton } from '../components/CTAButton';
import { useQuestionnaire } from '../QuestionnaireContext';
import { TESTIMONIALS, DEFAULT_TESTIMONIAL } from '../data/testimonials';
import type { ScreenProps } from '../questionnaire.types';

export function SocialProof({ onNext }: ScreenProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const { state } = useQuestionnaire();

  const testimonial =
    (state.selectedGoal && TESTIMONIALS[state.selectedGoal]) || DEFAULT_TESTIMONIAL;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.xl,
        paddingTop: insets.top + spacing.lg,
        paddingBottom: insets.bottom + spacing.lg,
        justifyContent: 'center',
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Animated.Text
          entering={FadeInUp.delay(100).springify().damping(18)}
          style={{ ...typography.body, color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xl }}
        >
          {'\uD83D\uDD17'} 47,000+ chains started this month
        </Animated.Text>
        <Animated.View
          entering={FadeInUp.delay(250).springify().damping(18)}
          style={{
            backgroundColor: colors.card,
            borderRadius: borderRadius.large,
            padding: spacing.lg,
            marginBottom: spacing.xl,
            ...shadows.card,
          }}
        >
          <Text style={{ ...typography.body, fontStyle: 'italic', color: colors.text.primary, fontSize: 15, marginBottom: spacing.md }}>
            "{testimonial.quote}"
          </Text>
          <Text style={{ ...typography.caption, fontWeight: fontWeights.bold, color: colors.primary[700] }}>
            {'\u2014'} {testimonial.author}
          </Text>
        </Animated.View>
        <Animated.Text
          entering={FadeInUp.delay(400).springify().damping(18)}
          style={{ ...typography.body, textAlign: 'center', color: colors.text.secondary }}
        >
          {'\u2605\u2605\u2605\u2605\u2605'}{' '}
          <Text style={{ color: colors.text.tertiary }}>4.9 on the App Store</Text>
        </Animated.Text>
      </View>
      <View style={{ marginTop: 'auto' }}>
        <CTAButton label="See how it works" onPress={onNext} />
      </View>
    </View>
  );
}
