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
import { HabitsHeader } from '../HabitsHeader';
import { CalendarTimeline } from '../../../../components/CalendarTimeline';
import { DailyQuote } from '../../../../components/DailyQuote';
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
          forceShow={props.justCreatedHabitId !== null}
          totalHabits={computed.totalHabits}
        />
      </Animated.View>

      {/* Daily Motivation Quote */}
      <DailyQuote />

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
