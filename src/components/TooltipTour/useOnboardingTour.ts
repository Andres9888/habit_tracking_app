/**
 * useOnboardingTour Hook
 * 
 * Triggers the onboarding tooltip tour after user creates their first habit.
 * Checks AsyncStorage to ensure tour only shows once.
 */

import { useEffect, useState } from 'react';
import { useTooltipTour } from './TooltipTourProvider';
import type { TooltipStep } from './types';

interface UseOnboardingTourProps {
  /** Number of habits user has created */
  habitCount: number;
  /** Whether the tour should be eligible to trigger */
  isEnabled?: boolean;
}

/**
 * Define the onboarding tooltip steps
 * These guide users through the key features after creating their first habit
 */
const ONBOARDING_STEPS: TooltipStep[] = [
  {
    id: 'tap-to-complete',
    message: 'Tap to complete your habit',
    placement: 'bottom',
    position: {
      top: 280,
      left: 40,
      right: 40,
    },
  },
  {
    id: 'swipe-for-options',
    message: 'Swipe for more options',
    placement: 'bottom',
    position: {
      top: 280,
      left: 40,
      right: 40,
    },
  },
  {
    id: 'track-progress',
    message: 'Track your progress here',
    placement: 'top',
    position: {
      bottom: 100,
      left: 40,
      right: 40,
    },
  },
  {
    id: 'customize-settings',
    message: 'Customize in settings',
    placement: 'bottom',
    position: {
      top: 80,
      right: 20,
    },
  },
];

/**
 * Hook that triggers onboarding tour after first habit is created
 */
export function useOnboardingTour({ habitCount, isEnabled = true }: UseOnboardingTourProps) {
  const { startTour, hasSeenTour } = useTooltipTour();
  const [hasCheckedTour, setHasCheckedTour] = useState(false);

  useEffect(() => {
    if (!isEnabled || hasCheckedTour) return;

    async function checkAndStartTour() {
      // Only trigger if user has exactly 1 habit (just created their first)
      if (habitCount !== 1) {
        setHasCheckedTour(true);
        return;
      }

      // Check if user has already seen the tour
      const seen = await hasSeenTour();
      setHasCheckedTour(true);

      if (!seen) {
        // Small delay to let the habit card render
        setTimeout(() => {
          startTour(ONBOARDING_STEPS);
        }, 800);
      }
    }

    void checkAndStartTour();
  }, [habitCount, isEnabled, hasCheckedTour, startTour, hasSeenTour]);
}
