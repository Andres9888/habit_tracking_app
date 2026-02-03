/**
 * Ready Screen - Screen 5 of onboarding
 * Show first habit card, confetti, "Start My Journey" CTA
 */

import { useEffect, useRef } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, {
  FadeIn,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { ONBOARDING_COLORS } from '../constants';
import type { OnboardingScreenProps } from '../types';

const DAYS_PREVIEW = 7;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function ReadyScreen({ onNext, onBack, onSkip, data, onComplete }: OnboardingScreenProps) {
  const confettiRef = useRef<ConfettiCannon>(null);
  const bounceY = useSharedValue(0);

  const habitEmoji = data.selectedHabit?.emoji || '✨';
  const habitName = data.selectedHabit?.name || data.customHabitName || 'My Habit';

  useEffect(() => {
    // Trigger confetti on mount
    const timer = setTimeout(() => {
      confettiRef.current?.start();
    }, 500);

    // Bounce animation for celebration emoji
    bounceY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 500 }),
        withTiming(0, { duration: 500 })
      ),
      -1,
      true
    );

    return () => clearTimeout(timer);
  }, []);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceY.value }],
  }));

  const handleComplete = async () => {
    if (onComplete) {
      await onComplete();
    }
    onNext();
  };

  return (
    <OnboardingLayout
      currentStep="ready"
      ctaTitle="Start My Journey"
      onCtaPress={handleComplete}
      onBack={onBack}
      onSkip={onSkip}
    >
      {/* Confetti */}
      <ConfettiCannon
        ref={confettiRef}
        count={100}
        origin={{ x: SCREEN_WIDTH / 2, y: 0 }}
        autoStart={false}
        fadeOut
        fallSpeed={3000}
        colors={[
          ONBOARDING_COLORS.accent.primary,
          ONBOARDING_COLORS.accent.secondary,
          ONBOARDING_COLORS.success,
          '#fbbf24', // Amber
          '#f472b6', // Pink
        ]}
      />

      <View className="flex-1 items-center">
        {/* Celebration Emoji */}
        <Animated.View
          entering={FadeIn.delay(200).duration(500)}
          style={bounceStyle}
        >
          <Text className="text-[64px] mt-5">🎉</Text>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          entering={SlideInUp.delay(400).duration(500).springify()}
          className="text-[28px] font-bold mt-4"
          style={{ color: ONBOARDING_COLORS.text.primary }}
        >
          You're All Set!
        </Animated.Text>

        {/* Message */}
        <Animated.Text
          entering={FadeIn.delay(600).duration(400)}
          className="text-[15px] mt-2 mb-6"
          style={{ color: ONBOARDING_COLORS.text.secondary }}
        >
          Complete your first day to start your chain
        </Animated.Text>

        {/* First Habit Card */}
        <Animated.View
          entering={SlideInUp.delay(800).duration(600).springify()}
          className="w-full rounded-[20px] p-5"
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            borderWidth: 1,
            borderColor: 'rgba(34, 197, 94, 0.3)',
          }}
        >
          {/* Habit Header */}
          <View className="flex-row items-center gap-3 mb-4">
            <Text className="text-[36px]">{habitEmoji}</Text>
            <View>
              <Text
                className="text-[18px] font-semibold"
                style={{ color: ONBOARDING_COLORS.text.primary }}
              >
                {habitName}
              </Text>
              <Text
                className="text-[13px]"
                style={{ color: ONBOARDING_COLORS.success }}
              >
                Day 1 — Let's go!
              </Text>
            </View>
          </View>

          {/* Chain Preview */}
          <View className="flex-row gap-2">
            {Array.from({ length: DAYS_PREVIEW }).map((_, index) => (
              <DayDot key={index} isToday={index === 0} delay={1000 + index * 50} />
            ))}
          </View>
        </Animated.View>
      </View>
    </OnboardingLayout>
  );
}

interface DayDotProps {
  isToday: boolean;
  delay: number;
}

function DayDot({ isToday, delay }: DayDotProps) {
  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(300)}
      className="w-8 h-8 rounded-[10px] items-center justify-center"
      style={{
        backgroundColor: isToday
          ? 'rgba(34, 197, 94, 0.2)'
          : 'rgba(255, 255, 255, 0.1)',
        borderWidth: 2,
        borderStyle: isToday ? 'solid' : 'dashed',
        borderColor: isToday
          ? ONBOARDING_COLORS.success
          : ONBOARDING_COLORS.surface.borderLight,
      }}
    >
      {isToday && (
        <Text
          className="text-[16px] font-semibold"
          style={{ color: ONBOARDING_COLORS.success }}
        >
          ?
        </Text>
      )}
    </Animated.View>
  );
}
