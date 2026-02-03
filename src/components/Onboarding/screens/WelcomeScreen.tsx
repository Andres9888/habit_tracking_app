/**
 * Welcome Screen - Screen 1 of onboarding
 * App intro + "don't break the chain" concept
 */

import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { ONBOARDING_COLORS } from '../constants';
import type { OnboardingScreenProps } from '../types';

export function WelcomeScreen({ onNext }: OnboardingScreenProps) {
  const logoScale = useSharedValue(1);

  useEffect(() => {
    // Subtle pulse animation for the logo
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  return (
    <OnboardingLayout
      currentStep="welcome"
      ctaTitle="Let's Get Started"
      onCtaPress={onNext}
      onSkip={onSkip}
    >
      <View className="flex-1 items-center justify-center" style={{ marginTop: -40 }}>
        {/* Logo */}
        <Animated.View
          entering={FadeIn.delay(200).duration(600)}
          style={logoAnimatedStyle}
        >
          <Text className="text-[64px] text-center">🔗</Text>
        </Animated.View>

        {/* App Title */}
        <Animated.Text
          entering={SlideInUp.delay(400).duration(500).springify()}
          className="text-[28px] font-bold text-center mt-5"
          style={{ color: ONBOARDING_COLORS.text.primary }}
        >
          Chain Day
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text
          entering={FadeIn.delay(600).duration(500)}
          className="text-[16px] text-center mt-2"
          style={{ color: ONBOARDING_COLORS.text.secondary }}
        >
          Build habits that stick
        </Animated.Text>

        {/* Concept Card */}
        <Animated.View
          entering={SlideInUp.delay(800).duration(600).springify()}
          className="mt-8 w-full rounded-2xl p-5"
          style={{
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            borderWidth: 1,
            borderColor: ONBOARDING_COLORS.surface.border,
          }}
        >
          <Text
            className="text-[14px] font-semibold uppercase tracking-wider mb-2"
            style={{ color: ONBOARDING_COLORS.text.accent, letterSpacing: 1 }}
          >
            The Secret
          </Text>
          <Text
            className="text-[15px] leading-6"
            style={{ color: ONBOARDING_COLORS.text.primary }}
          >
            Don't break the chain. Every day you show up adds a link. Watch your chain grow stronger.
          </Text>
        </Animated.View>
      </View>
    </OnboardingLayout>
  );
}
