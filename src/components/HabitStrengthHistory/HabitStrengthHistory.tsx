/**
 * HabitStrengthHistory Component
 *
 * Main container that composes all Habit Strength History sub-components.
 */

import React from 'react';
import { useReducedMotion } from 'react-native-reanimated';

import { useHabitStrength } from '../../hooks/useHabitStrength';
import { HabitStrengthInfoModal } from '../HabitStrengthInfoModal';
import { EmptyStrengthState } from './EmptyStrengthState';
import { HabitStrengthHistorySkeleton } from './HabitStrengthHistorySkeleton';
import { HabitStrengthHistoryContent } from './HabitStrengthHistoryContent';
import { useInfoModal } from './useInfoModal';
import type { HabitStrengthHistoryProps } from './types';

export function HabitStrengthHistory({
  habitId: _habitId,
  completedDates,
  habitCreatedAt,
  habitColor,
}: HabitStrengthHistoryProps) {
  const infoModal = useInfoModal();
  const shouldReduceMotion = useReducedMotion();
  const { currentStrength, strengthHistory, metrics, isCalculating } =
    useHabitStrength(completedDates, habitCreatedAt);

  if (isCalculating) {
    return (
      <HabitStrengthHistorySkeleton
        reduceMotion={shouldReduceMotion ?? false}
      />
    );
  }

  if (completedDates.size === 0) {
    return (
      <>
        <EmptyStrengthState
          habitAgeDays={metrics.habitAgeDays}
          reduceMotion={shouldReduceMotion ?? false}
          onInfoPress={infoModal.show}
        />
        <HabitStrengthInfoModal
          visible={infoModal.visible}
          onClose={infoModal.hide}
        />
      </>
    );
  }

  return (
    <>
      <HabitStrengthHistoryContent
        completedDates={completedDates}
        currentStrength={currentStrength}
        habitColor={habitColor}
        metrics={metrics}
        strengthHistory={strengthHistory}
        onInfoPress={infoModal.show}
      />
      <HabitStrengthInfoModal
        visible={infoModal.visible}
        onClose={infoModal.hide}
      />
    </>
  );
}

export default HabitStrengthHistory;
