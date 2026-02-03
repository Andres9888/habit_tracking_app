/**
 * Onboarding Flow - Main orchestrating component
 * Manages navigation between onboarding screens and data state
 */

import { useState, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ONBOARDING_STEPS } from './constants';
import type { OnboardingStep, OnboardingData } from './types';
import {
  WelcomeScreen,
  CreateHabitScreen,
  ChainExplainedScreen,
  ReminderScreen,
  ReadyScreen,
} from './screens';
import { useOnboardingStorage } from './hooks';
import { OnboardingErrorBoundary } from './components';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const INITIAL_DATA: OnboardingData = {
  selectedHabit: null,
  customHabitName: '',
  reminderTime: null,
  reminderPreset: null,
};

function OnboardingFlowInner({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);

  const { markOnboardingComplete, saveOnboardingData } = useOnboardingStorage();
  const createHabit = useMutation(api.habits.create);

  const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);

  const goNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < ONBOARDING_STEPS.length) {
      setCurrentStep(ONBOARDING_STEPS[nextIndex]);
    }
  }, [currentIndex]);

  const goBack = useCallback(() => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(ONBOARDING_STEPS[prevIndex]);
    }
  }, [currentIndex]);

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const skipOnboarding = useCallback(async () => {
    try {
      // Mark onboarding as complete without creating habits
      await markOnboardingComplete();
      onComplete();
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      // Still proceed
      onComplete();
    }
  }, [markOnboardingComplete, onComplete]);

  const completeOnboarding = useCallback(async () => {
    try {
      // Create the first habit
      const habitName = data.selectedHabit?.name || data.customHabitName;
      if (habitName) {
        await createHabit({
          name: habitName,
          notes: data.selectedHabit?.emoji || '',
        });
      }

      // Save onboarding data and mark complete
      await saveOnboardingData(data);
      await markOnboardingComplete();

      // Notify parent
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still proceed - user can create habits manually
      await markOnboardingComplete();
      onComplete();
    }
  }, [data, createHabit, saveOnboardingData, markOnboardingComplete, onComplete]);

  // Only show back button after the welcome screen (currentIndex > 0)
  const onBackHandler = currentIndex > 0 ? goBack : undefined;

  const screenProps = {
    data,
    updateData,
    onNext: goNext,
    onBack: onBackHandler,
    onSkip: skipOnboarding,
    onComplete: completeOnboarding,
  };

  switch (currentStep) {
    case 'welcome':
      return <WelcomeScreen {...screenProps} />;
    case 'createHabit':
      return <CreateHabitScreen {...screenProps} />;
    case 'chainExplained':
      return <ChainExplainedScreen {...screenProps} />;
    case 'reminder':
      return <ReminderScreen {...screenProps} />;
    case 'ready':
      return <ReadyScreen {...screenProps} />;
    default:
      return <WelcomeScreen {...screenProps} />;
  }
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const handleReset = () => {
    // Reset to welcome screen on error
    // The error boundary will unmount and remount the flow
  };

  const handleSkip = async () => {
    try:
      await onComplete();
    } catch (error) {
      console.error('Error skipping from error boundary:', error);
      onComplete();
    }
  };

  return (
    <OnboardingErrorBoundary onReset={handleReset} onSkip={handleSkip}>
      <OnboardingFlowInner onComplete={onComplete} />
    </OnboardingErrorBoundary>
  );
}
