/**
 * Chain Explained Screen - Screen 3 of onboarding
 * Animated chain visualization + milestones (7/30/100)
 */

import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  FadeIn,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { ONBOARDING_COLORS, MILESTONES } from '../constants';
import type { OnboardingScreenProps } from '../types';

const CHAIN_LINKS = 7;

export function ChainExplainedScreen({ onNext }: OnboardingScreenProps) {
  return (
    <OnboardingLayout
      currentStep="chainExplained"
      ctaTitle="I'm Ready"
      onCtaPress={onNext}
      onBack={onBack}
      onSkip={onSkip}
    >
      <View className="flex-1">
        {/* Header */}
        <Animated.Text
          entering={FadeIn.delay(200).duration(500)}
          className="text-[24px] font-bold text-center mb-6"
          style={{ color: ONBOARDING_COLORS.text.primary }}
        >
          Build Your Chain
        </Animated.Text>

        {/* Chain Visualization */}
        <Animated.View
          entering={FadeIn.delay(400).duration(500)}
          className="rounded-[20px] p-5 mb-6"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
        >
          <View className="flex-row flex-wrap justify-center gap-1">
            {Array.from({ length: CHAIN_LINKS }).map((_, index) => (
              <ChainLink key={index} index={index} />
            ))}
          </View>
        </Animated.View>

        {/* Explanation Text */}
        <Animated.View
          entering={SlideInUp.delay(1200).duration(500).springify()}
          className="items-center"
        >
          <Text
            className="text-[16px] text-center mb-3 leading-6"
            style={{ color: ONBOARDING_COLORS.text.primary }}
          >
            Every day you complete your habit, you add a{' '}
            <Text style={{ color: ONBOARDING_COLORS.success, fontWeight: '600' }}>
              new link
            </Text>{' '}
            to your chain.
          </Text>
          <Text
            className="text-[16px] text-center leading-6"
            style={{ color: ONBOARDING_COLORS.text.primary }}
          >
            The longer your chain, the stronger your habit becomes.
          </Text>
        </Animated.View>

        {/* Milestones */}
        <Animated.View
          entering={SlideInUp.delay(1400).duration(500).springify()}
          className="flex-row justify-around mt-6 pt-6"
          style={{ borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          {MILESTONES.map((milestone, index) => (
            <MilestoneItem
              key={milestone.days}
              days={milestone.days}
              label={milestone.label}
              delay={1600 + index * 150}
            />
          ))}
        </Animated.View>
      </View>
    </OnboardingLayout>
  );
}

interface ChainLinkProps {
  index: number;
}

function ChainLink({ index }: ChainLinkProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = 500 + index * 100;
    
    scale.value = withDelay(
      delay,
      withSpring(1, {
        damping: 12,
        stiffness: 200,
      })
    );
    
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) })
    );
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 28,
          height: 28,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: ONBOARDING_COLORS.success,
        },
        animatedStyle,
      ]}
    >
      <Text className="text-[14px]">🔗</Text>
    </Animated.View>
  );
}

interface MilestoneItemProps {
  days: number;
  label: string;
  delay: number;
}

function MilestoneItem({ days, label, delay }: MilestoneItemProps) {
  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(400)}
      className="items-center"
    >
      <Text
        className="text-[24px] font-bold"
        style={{ color: ONBOARDING_COLORS.accent.primary }}
      >
        {days}
      </Text>
      <Text
        className="text-[11px] uppercase tracking-wider"
        style={{ color: ONBOARDING_COLORS.text.secondary, letterSpacing: 0.5 }}
      >
        {label}
      </Text>
    </Animated.View>
  );
}
