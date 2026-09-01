import { useCallback, useEffect } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useHabitInsights } from '../insights';
import { useInsightPalette } from '../insightPalette';
import { heroWash } from './DetailHeroBanner/DetailHeroBanner.utils';
import type { HabitDetailContentProps } from './HabitDetailContent.types';
import { useHabitDetailDayState } from './useHabitDetailDayState';

export function useHabitDetailContent({
  completedDates,
  habit,
  isCompletedToday,
  onPinnedChange,
  onRecoveryChange,
  visible = true,
}: Pick<
  HabitDetailContentProps,
  | 'completedDates'
  | 'habit'
  | 'isCompletedToday'
  | 'onPinnedChange'
  | 'onRecoveryChange'
  | 'visible'
>) {
  const palette = useInsightPalette();
  const insights = useHabitInsights({
    daysOfWeek: habit.daysOfWeek,
    enabled: visible,
    habitCreatedAt: habit.createdAt,
    habitId: habit._id,
    reminderTime: habit.reminderTime,
  });
  const dayState = useHabitDetailDayState({
    completedDates,
    habit,
    insightDoneDates: insights.doneDates,
    isCompletedToday,
  });
  const wash = heroWash(palette, dayState.todayState, dayState.isRecovery);

  useEffect(() => {
    onRecoveryChange?.(dayState.isRecovery);
  }, [dayState.isRecovery, onRecoveryChange]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onPinnedChange?.(event.nativeEvent.contentOffset.y > 160);
    },
    [onPinnedChange]
  );

  return { ...dayState, handleScroll, insights, palette, wash };
}
