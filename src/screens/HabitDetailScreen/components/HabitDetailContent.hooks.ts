import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useHabitInsights } from '../insights';
import { useInsightPalette } from '../insightPalette';
import { heroWash } from './DetailHeroBanner/DetailHeroBanner.utils';
import type { HabitDetailContentProps } from './HabitDetailContent.types';
import { useHabitDetailDayState } from './useHabitDetailDayState';

/**
 * Slack under the hero's measured height. The hero ends just below the
 * fixed-height secondary slot, so the toggle is fully gone a hair before the
 * hero's own bottom edge crosses the top of the viewport.
 */
const HEADER_ALLOWANCE = 8;

/** Room under the last door so the sticky bar never covers it. */
export const STICKY_CONTENT_STYLE = { paddingBottom: 96 } as const;

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
    // `daysOfData` is 0 only for the EMPTY placeholder while the log loads.
    insightsReady: insights.daysOfData > 0,
    isCompletedToday,
  });
  const wash = heroWash(palette, dayState.todayState, dayState.isRecovery);

  useEffect(() => {
    onRecoveryChange?.(dayState.isRecovery);
  }, [dayState.isRecovery, onRecoveryChange]);

  // Measured, not guessed: the hero's height changes with Dynamic Type, the
  // recovery card and the note row. It is the ScrollView's first child, so its
  // height is also its bottom edge in content coordinates.
  const heroHeight = useRef(0);
  const [isHeroCtaOffscreen, setIsHeroCtaOffscreen] = useState(false);

  const handleHeroLayout = useCallback((event: LayoutChangeEvent) => {
    heroHeight.current = event.nativeEvent.layout.height;
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      onPinnedChange?.(offsetY > 160);
      setIsHeroCtaOffscreen(
        heroHeight.current > 0 &&
          offsetY > heroHeight.current - HEADER_ALLOWANCE
      );
    },
    [onPinnedChange]
  );

  const showStickyCheckIn =
    isHeroCtaOffscreen &&
    (dayState.todayState === 'open-today' ||
      dayState.todayState === 'completed');

  return {
    ...dayState,
    handleHeroLayout,
    handleScroll,
    insights,
    palette,
    showStickyCheckIn,
    wash,
  };
}
