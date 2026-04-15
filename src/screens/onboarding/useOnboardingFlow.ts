/**
 * useOnboardingFlow — central state machine for the 3-step interactive onboarding.
 *
 * Steps: addHabit → tryCompletion → celebration
 */

import { useCallback, useState } from 'react';
import { safeSetBoolean } from '@/utils/storage';
import { triggerHaptic } from '@/utils/haptics';

import type { Id } from '../../../convex/_generated/dataModel';
import { ONBOARDING_KEY } from './onboarding.data';
import { ONBOARDING_STEPS, type OnboardingStep } from './onboarding.types';

interface UseOnboardingFlowOptions {
  onComplete: () => void;
}

export function useOnboardingFlow({ onComplete }: UseOnboardingFlowOptions) {
  const [stepIndex, setStepIndex] = useState(0);
  const [createdHabitId, setCreatedHabitId] = useState<Id<'habits'> | null>(
    null
  );

  const currentStep: OnboardingStep =
    ONBOARDING_STEPS[stepIndex] ?? 'addHabit';

  const goNext = useCallback(() => {
    void triggerHaptic('tap');
    setStepIndex((prev) => Math.min(prev + 1, ONBOARDING_STEPS.length - 1));
  }, []);

  const goBack = useCallback(() => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleHabitCreated = useCallback(
    (habitId: Id<'habits'>) => {
      setCreatedHabitId(habitId);
      goNext();
    },
    [goNext]
  );

  const handleSkip = useCallback(async () => {
    void triggerHaptic('tap');
    await safeSetBoolean(ONBOARDING_KEY, true);
    onComplete();
  }, [onComplete]);

  const handleFinish = useCallback(async () => {
    void triggerHaptic('toggle');
    await safeSetBoolean(ONBOARDING_KEY, true);
    onComplete();
  }, [onComplete]);

  return {
    createdHabitId,
    currentStep,
    goBack,
    goNext,
    handleFinish,
    handleHabitCreated,
    handleSkip,
    stepIndex,
    totalSteps: ONBOARDING_STEPS.length,
  };
}
