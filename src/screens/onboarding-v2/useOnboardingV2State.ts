import { useCallback, useEffect, useState } from 'react';
import { safeSetItem, safeSetString } from '@/utils/storage';
import {
  INITIAL_ANSWERS,
  OnboardingAnswers,
  STEP_SEQUENCE,
} from './types';
import {
  ONBOARDING_V2_ANSWERS_KEY,
  ONBOARDING_V2_STEP_KEY,
} from './storageKeys';

/**
 * DEV/REVIEW MODE: ignores AsyncStorage on launch so onboarding starts
 * at Welcome with empty answers every time the app opens. Within a
 * session, handleNext/handleBack/updateAnswers still write to
 * AsyncStorage — restore the safeGetString/safeGetItem reads in the
 * mount effect to re-enable cross-launch resume.
 */
export function useOnboardingV2State() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(INITIAL_ANSWERS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const persistStepIndex = useCallback((index: number) => {
    const stepId = STEP_SEQUENCE[index];
    if (stepId) void safeSetString(ONBOARDING_V2_STEP_KEY, stepId);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const next = Math.min(prev + 1, STEP_SEQUENCE.length - 1);
      persistStepIndex(next);
      return next;
    });
  }, [persistStepIndex]);

  const handleBack = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const next = Math.max(prev - 1, 0);
      persistStepIndex(next);
      return next;
    });
  }, [persistStepIndex]);

  const updateAnswers = useCallback(
    (partial: Partial<OnboardingAnswers>) => {
      setAnswers((prev) => {
        const merged = { ...prev, ...partial };
        void safeSetItem(ONBOARDING_V2_ANSWERS_KEY, merged);
        return merged;
      });
    },
    []
  );

  return {
    answers,
    currentStepId: STEP_SEQUENCE[currentStepIndex] ?? 'welcome',
    currentStepIndex,
    isHydrated,
    onBack: handleBack,
    onNext: handleNext,
    totalSteps: STEP_SEQUENCE.length,
    updateAnswers,
  };
}
