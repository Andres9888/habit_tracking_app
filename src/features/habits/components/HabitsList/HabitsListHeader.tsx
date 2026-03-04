/**
 * HabitsListHeader — animated header rendered above the habit rows.
 *
 * Contains (top-to-bottom):
 * 1. **OfflineIndicator** — shown when the device loses connectivity.
 * 2. **HabitsHeader** — minimal date-only title.
 * 3. **CalendarTimeline** — week-view dots with day completion heat.
 * 4. **TrialCountdownBanner** — shown during an active free-trial period.
 *
 * Action buttons have moved to the BottomActionBar.
 */

import React, { memo, useMemo } from 'react';
import { Animated, View } from 'react-native';
import ReAnimated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { CalendarTimeline } from '../../../../components/CalendarTimeline';
import { getShelfBackgroundColor } from '../../../../components/CalendarTimeline/CalendarTimeline.styles';
import { OfflineIndicator } from '../../../../components/SyncStatus';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { useTrialCountdown } from '../../../../components/TrialCountdownBanner';
import { useStickyProgress } from '../../../../components/CalendarTimeline/StickyHeaderContext';
import type { HabitsListHeaderProps } from './HabitsListHeader.types';
import { useHabitsListHeaderComputed } from './useHabitsListHeaderComputed';

/** Content padding applied by DraggableFlatList's contentContainerStyle */
const CONTENT_H_PADDING = 24;

function HabitsListHeaderComponent(
  props: HabitsListHeaderProps
): React.ReactElement {
  const { isDark } = useThemeColors();
  const stickyProgress = useStickyProgress();
  const shelfBg = getShelfBackgroundColor(isDark);

  const stickyWrapperStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      stickyProgress.value,
      [0, 1],
      ['transparent', shelfBg]
    ),
    marginHorizontal: interpolate(
      stickyProgress.value,
      [0, 1],
      [0, -CONTENT_H_PADDING]
    ),
  }));

  const computed = useHabitsListHeaderComputed({
    getHabitStatus: props.getHabitStatus,
    habits: props.habits,
    justCreatedHabitId: props.justCreatedHabitId,
    weekDateStrings: props.weekDateStrings,
  });

  const { shouldShowBanner, daysRemaining } = useTrialCountdown();

  const currentStreak = useMemo(() => {
    if (props.habits.length === 0) return 0;
    return Math.max(...props.habits.map((h) => props.getStreak(h._id)));
  }, [props.habits, props.getStreak]);

  return (
    <ReAnimated.View className='gap-2 pb-2 pt-12' style={stickyWrapperStyle}>
      <View className='absolute left-0 right-0 top-4 z-10 flex-row justify-center'>
        <OfflineIndicator
          testID='habits-offline-indicator'
          visible={computed.isOffline}
        />
      </View>
      {computed.shouldShowTimeline && (
        <Animated.View
          style={{
            opacity: props.calendarOpacity,
            transform: [{ translateY: props.calendarTranslateY }],
          }}
        >
          <CalendarTimeline
            disableFutureDayPress
            canNavigateForward={props.canNavigateForward}
            completedToday={computed.completedToday}
            completionByDay={computed.completionByDay}
            currentStreak={currentStreak}
            dates={props.weekDates}
            reduceMotion={props.reduceMotionPreference}
            totalHabits={computed.totalHabits}
            trialDaysRemaining={shouldShowBanner ? daysRemaining : null}
            onDayPress={props.onDayPress}
            onJumpToToday={props.onJumpToToday}
            onNextWeek={props.onNextWeek}
            onPreviousWeek={props.onPreviousWeek}
            onUpgrade={props.onUpgradePress}
          />
        </Animated.View>
      )}
    </ReAnimated.View>
  );
}

export const HabitsListHeader = memo(HabitsListHeaderComponent);
