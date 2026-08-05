/**
 * GoalValueDisplay Component
 *
 * Displays the goal value with optional counting animation.
 * Uses a timer-based approach for the count-up effect.
 */

import React, { useEffect, useState } from 'react';

import { NUMBER_COUNT_DURATION } from '../TodaysFocusCard.constants';

export interface GoalValueDisplayProps {
  targetValue: number;
  reduceMotion: boolean;
}

export const GoalValueDisplay = React.memo(function GoalValueDisplay({
  targetValue,
  reduceMotion,
}: GoalValueDisplayProps) {
  const [displayValue, setDisplayValue] = useState(
    reduceMotion ? targetValue : 0
  );

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(targetValue);
      return;
    }

    // Animate the count up using a timer-based approach
    const startValue = 0;
    const endValue = targetValue;
    const duration = NUMBER_COUNT_DURATION;
    const steps = 20;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const currentValue = Math.round(
        startValue + (endValue - startValue) * easeProgress
      );
      setDisplayValue(currentValue);

      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayValue(endValue);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [targetValue, reduceMotion]);

  return displayValue;
});

export default GoalValueDisplay;
