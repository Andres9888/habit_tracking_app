/**
 * Onboarding Flow Component
 * 3-screen onboarding experience:
 * 1. Value Hook - "Don't break the chain"
 * 2. First Habit - Create your first habit
 * 3. Success - Confirmation and entry
 */

import React, { useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { ValueHookScreen } from './screens/ValueHookScreen';
import { FirstHabitScreen } from './screens/FirstHabitScreen';
import { SuccessScreen } from './screens/SuccessScreen';
import type { OnboardingFlowProps, OnboardingScreen } from './types';

const TRANSITION_DURATION = 300;

type ScreenState = {
  screen: OnboardingScreen;
  habitName?: string;
};

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>({
    screen: 'value-hook',
  });

  // Transition animation
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const transitionToScreen = useCallback((nextScreen: OnboardingScreen, habitName?: string) => {
    // Animate out
    opacity.value = withTiming(0, { duration: TRANSITION_DURATION / 2, easing: Easing.out(Easing.ease) });
    translateX.value = withTiming(-50, { duration: TRANSITION_DURATION / 2, easing: Easing.out(Easing.ease) }, () => {
      // Update screen
      setCurrentScreen({ screen: nextScreen, habitName });
      
      // Reset for animate in
      translateX.value = 50;
      
      // Animate in
      opacity.value = withTiming(1, { duration: TRANSITION_DURATION / 2, easing: Easing.out(Easing.ease) });
      translateX.value = withTiming(0, { duration: TRANSITION_DURATION / 2, easing: Easing.out(Easing.ease) });
    });
  }, [opacity, translateX]);

  const handleValueHookNext = useCallback(() => {
    transitionToScreen('first-habit');
  }, [transitionToScreen]);

  const handleFirstHabitNext = useCallback((habitName: string) => {
    transitionToScreen('success', habitName);
  }, [transitionToScreen]);

  const handleFirstHabitSkip = useCallback(() => {
    onSkip?.();
  }, [onSkip]);

  const handleSuccessComplete = useCallback(() => {
    onComplete(currentScreen.habitName);
  }, [onComplete, currentScreen.habitName]);

  const renderScreen = () => {
    switch (currentScreen.screen) {
      case 'value-hook':
        return <ValueHookScreen onNext={handleValueHookNext} />;
      
      case 'first-habit':
        return (
          <FirstHabitScreen
            onNext={handleFirstHabitNext}
            onSkip={handleFirstHabitSkip}
          />
        );
      
      case 'success':
        return (
          <SuccessScreen
            habitName={currentScreen.habitName}
            onComplete={handleSuccessComplete}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {renderScreen()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OnboardingFlow;
