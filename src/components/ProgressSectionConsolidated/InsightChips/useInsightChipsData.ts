/**
 * useInsightChipsData Hook
 *
 * Builds the chip data array from the provided props
 */

import { useMemo } from 'react';

import type { InsightChipData } from './types';
import type { InsightChipsProps } from '../types';

export function useInsightChipsData({
  currentStreak,
  bestDay,
  focusDay,
  monthlyCompleted,
  monthlyTotal,
  onFocusDayPress,
}: InsightChipsProps): InsightChipData[] {
  return useMemo(() => {
    const chips: InsightChipData[] = [ {
      borderColor: 'orange-200',
      hasPulse: currentStreak > 0,
      icon: '🔥',
      id: 'streak',
      isInteractive: false,
      label: 'Current Streak',
      value: currentStreak === 1 ? '1 day' : `${currentStreak} days`,
    }];

    // Current Streak chip

    // Best Day chip
    if (bestDay) {
      chips.push({
        borderColor: 'success-200',
        icon: '🏆',
        id: 'bestDay',
        isInteractive: false,
        label: `${Math.round(bestDay.rate)}% completion`,
        value: bestDay.name,
      });
    }

    // Focus Day chip (interactive)
    if (focusDay) {
      chips.push({
        borderColor: 'amber-200',
        icon: '⚡',
        id: 'focusDay',
        isInteractive: !!onFocusDayPress,
        label: 'Focus day',
        onPress: onFocusDayPress,
        value: focusDay.name,
      });
    }

    // Monthly Progress chip
    chips.push({
      borderColor: 'violet-200',
      icon: '📅',
      id: 'monthly',
      isInteractive: false,
      label: 'This month',
      value: `${monthlyCompleted}/${monthlyTotal}`,
    });

    return chips;
  }, [
    currentStreak,
    bestDay,
    focusDay,
    monthlyCompleted,
    monthlyTotal,
    onFocusDayPress,
  ]);
}
