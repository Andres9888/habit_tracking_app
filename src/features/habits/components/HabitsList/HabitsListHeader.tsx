/**
 * HabitsListHeader — animated header rendered above the habit rows.
 *
 * Contains (top-to-bottom):
 * 1. **OfflineIndicator** (US3) — shown when the device loses connectivity.
 * 2. **HabitsHeader** — title, completion summary, action buttons (add, sort, settings, templates).
 * 3. **CalendarTimeline** — week-view dots with day completion heat and navigation arrows.
 * 4. **TrialCountdownBanner** — shown during an active free-trial period.
 *
 * Animated values (`headerOpacity/TranslateY`, `calendarOpacity/TranslateY`) drive
 * the staggered entrance choreography orchestrated by `useHabitsListAnimations`.
 * Memoised via `React.memo` to skip re-renders when props are reference-equal.
 */

/* eslint-disable max-lines-per-function */

import React, { memo } from 'react';
import { Animated, View } from 'react-native';
import { HabitsHeader } from '../HabitsHeader';
import { CalendarTimeline } from '../../../../components/CalendarTimeline';
import { OfflineIndicator } from '../../../../components/SyncStatus';
import {
  TrialCountdownBanner,
  useTrialCountdown,
} from '../../../../components/TrialCountdownBanner';
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

  // Trial countdown banner
  const { shouldShowBanner, daysRemaining } = useTrialCountdown();

  return (
    <View className='gap-4 pb-4 pt-14'>
      <View className='absolute left-0 right-0 top-4 z-10 flex-row justify-center'>
        <OfflineIndicator
          testID='habits-offline-indicator'
          visible={computed.isOffline}
        />
      </View>
      <Animated.View
        style={{
          opacity: props.headerOpacity,
          transform: [{ translateY: props.headerTranslateY }],
        }}
      >
        <HabitsHeader
          completedToday={computed.completedToday}
          forceShow={props.justCreatedHabitId !== null}
          openCreateHabitScreen={props.onAddHabitPress}
          openSettings={props.openSettings}
          openSortSheet={props.onOpenSortSheet}
          openTemplatesScreen={props.openTemplatesScreen}
          showCompletionSummary={props.showWeekCompletionBar}
          totalHabits={computed.totalHabits}
        />
      </Animated.View>
      {computed.shouldShowTimeline && (
        <Animated.View
          style={{
            opacity: props.calendarOpacity,
            transform: [{ translateY: props.calendarTranslateY }],
          }}
        >
          <CalendarTimeline
            disableFutureDayPress
            showSeparator
            canNavigateForward={props.canNavigateForward}
            completionByDay={computed.completionByDay}
            dates={props.weekDates}
            reduceMotion={props.reduceMotionPreference}
            onDayPress={props.onDayPress}
            onNextWeek={props.onNextWeek}
            onPreviousWeek={props.onPreviousWeek}
          />
        </Animated.View>
      )}

      {/* Trial Countdown Banner */}
      {shouldShowBanner && daysRemaining !== null && (
        <TrialCountdownBanner
          daysRemaining={daysRemaining}
          onUpgrade={props.onUpgradePress}
        />
      )}
    </View>
  );
}

export const HabitsListHeader = memo(HabitsListHeaderComponent);
