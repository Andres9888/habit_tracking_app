/**
 * Screen 1: WelcomeHook - Opening hook for the Chain Day onboarding.
 * Large chain emoji, headline, subtitle, and CTA.
 */

import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { CTAButton } from '../components/CTAButton';
import type { ScreenProps } from '../questionnaire.types';

export function WelcomeHook({ onNext }: ScreenProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.xl,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + spacing.lg,
        justifyContent: 'center',
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.Text
          entering={FadeInUp.delay(100).springify().damping(18)}
          style={{ fontSize: 64, marginBottom: spacing.xl }}
        >
          {'\uD83D\uDD17'}
        </Animated.Text>
        <Animated.Text
          entering={FadeInUp.delay(250).springify().damping(18)}
          style={{
            ...typography.displayLarge,
            color: colors.primary[700],
            textAlign: 'center',
            marginBottom: spacing.base,
          }}
        >
          What if your habits actually stuck this time?
        </Animated.Text>
        <Animated.Text
          entering={FadeInUp.delay(400).springify().damping(18)}
          style={{
            ...typography.body,
            color: colors.text.secondary,
            textAlign: 'center',
            paddingHorizontal: spacing.sm,
          }}
        >
          Chain Day uses behavioral science to turn daily actions into automatic
          routines {'\u2014'} no willpower required.
        </Animated.Text>
      </View>
      <View style={{ marginTop: 'auto' }}>
        <CTAButton label="Let's find your habits" onPress={onNext} />
      </View>
    </View>
  );
}
