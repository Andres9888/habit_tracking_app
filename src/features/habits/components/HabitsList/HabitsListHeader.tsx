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

import React, { memo } from 'react';
import { Animated, View } from 'react-native';
import { CalendarTimeline } from '../../../../components/CalendarTimeline';
import { OfflineIndicator } from '../../../../components/SyncStatus';
import { useTrialCountdown } from '../../../../components/TrialCountdownBanner';
import type { HabitsListHeaderProps } from './HabitsListHeader.types';
import { useHabitsListHeaderComputed } from './useHabitsListHeaderComputed';

function HabitsListHeaderComponent(
  props: HabitsListHeaderProps
): React.ReactElement {
  const computed = useHabitsListHeaderComputed({
    getHabitStatus: props.getHabitStatus,
    habits: props.habits,
    justCreatedHabitId: props.justCreatedHabitId,
    weekDateStrings: props.weekDateStrings,
  });

  const { shouldShowBanner, daysRemaining } = useTrialCountdown();

  return (
    <View className='gap-2 pb-2 pt-12'>
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
    </View>
  );
}

export const HabitsListHeader = memo(HabitsListHeaderComponent);
