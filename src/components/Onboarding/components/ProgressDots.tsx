/**
 * Progress Dots - Visual indicator for onboarding progress
 */

import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { ONBOARDING_COLORS, ONBOARDING_STEPS } from '../constants';
import type { OnboardingStep } from '../types';

interface ProgressDotsProps {
  currentStep: OnboardingStep;
}

export function ProgressDots({ currentStep }: ProgressDotsProps) {
  const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);

  return (
    <View className="flex-row items-center justify-center gap-2">
      {ONBOARDING_STEPS.map((step, index) => (
        <ProgressDot
          key={step}
          isActive={index === currentIndex}
          isCompleted={index < currentIndex}
        />
      ))}
    </View>
  );
}

interface ProgressDotProps {
  isActive: boolean;
  isCompleted: boolean;
}

function ProgressDot({ isActive, isCompleted }: ProgressDotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const width = withSpring(isActive ? 24 : 8, {
      damping: 15,
      stiffness: 200,
    });

    const backgroundColor = isCompleted
      ? ONBOARDING_COLORS.success
      : isActive
        ? ONBOARDING_COLORS.accent.primary
        : 'rgba(255, 255, 255, 0.2)';

    return {
      width,
      backgroundColor,
    };
  }, [isActive, isCompleted]);

  return (
    <Animated.View
      style={[
        {
          height: 8,
          borderRadius: 4,
        },
        animatedStyle,
      ]}
    />
  );
}
