/**
 * StrengthComparisonCards Component
 *
 * Displays three cards showing habit strength at key timeframes:
 * - Now (current strength with delta badge)
 * - 30 Days Ago (or "Start" if habit is younger)
 * - 1 Year Ago (or "Start" if habit is younger)
 */

import React from 'react';
import { View } from 'react-native';

import { isPerfectStreak } from '../strengthUtils';
import { StrengthCard } from './StrengthCard';
import type { StrengthComparisonCardsProps } from './types';

export function StrengthComparisonCards({
  current,
  thirtyDaysAgo,
  oneYearAgo,
  deltaVsMonth,
  habitAgeDays,
  completedDates,
}: StrengthComparisonCardsProps) {
  // Determine labels for past timeframes based on habit age
  const thirtyDaysLabel = habitAgeDays >= 30 ? '30 Days' : 'Start';
  const oneYearLabel = habitAgeDays >= 365 ? '1 Year' : 'Start';

  // Use start strength (0) if habit is too young for the timeframe
  const thirtyDaysStrength = thirtyDaysAgo ?? 0;
  const oneYearStrength = oneYearAgo ?? 0;

  // Check for perfect completion streak
  const showPerfect = completedDates
    ? isPerfectStreak(completedDates, habitAgeDays)
    : false;

  return (
    <View
      accessible
      accessibilityLabel='Habit strength comparison across timeframes'
      accessibilityRole='none'
      className='flex-row gap-2'
    >
      <StrengthCard
        isHighlighted
        animationDelay={0}
        delta={deltaVsMonth}
        showPerfectBadge={showPerfect}
        strength={current}
        timeLabel='Now'
      />

      <StrengthCard
        animationDelay={100}
        strength={thirtyDaysStrength}
        timeLabel={thirtyDaysLabel}
      />

      <StrengthCard
        animationDelay={200}
        strength={oneYearStrength}
        timeLabel={oneYearLabel}
      />
    </View>
  );
}

export default StrengthComparisonCards;
