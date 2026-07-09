/**
 * HabitsListHeader — animated header rendered above the habit rows.
 *
 * Contains (top-to-bottom):
 * 1. **OfflineIndicator** — US3 offline indicator for lost connectivity.
 * 2. **CalendarTimeline** — unified header with greeting, progress, and week strip.
 *
 * Action buttons have moved to the BottomActionBar.
 */

import React, { memo } from 'react';
import { Animated, View } from 'react-native';
import ReAnimated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarTimeline } from '../../../../components/CalendarTimeline';
import { getShelfBackgroundColor } from '../../../../components/CalendarTimeline/CalendarTimeline.styles';
import { OfflineIndicator } from '../../../../components/SyncStatus';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { useTrialCountdown } from '../../../../components/TrialCountdownBanner';
import { useStickyProgress } from '../../../../components/CalendarTimeline/StickyHeaderContext';
import type { HabitsListHeaderProps } from './HabitsListHeader.types';
import { useHabitsListHeaderComputed } from './useHabitsListHeaderComputed';
import { DayCompleteBeat } from './DayCompleteBeat';

/** Content padding applied by DraggableFlatList's contentContainerStyle */
const CONTENT_H_PADDING = 24;
const STICKY_HEADER_LAYER = { elevation: 20, zIndex: 20 } as const;

function HabitsListHeaderComponent(
  props: HabitsListHeaderProps
): React.ReactElement {
  const { isDark } = useThemeColors();
  const insets = useSafeAreaInsets();
  const stickyProgress = useStickyProgress();
  const shelfBg = getShelfBackgroundColor(isDark);

  const stickyWrapperStyle = useAnimatedStyle(() => ({
    backgroundColor: stickyProgress.value > 0 ? shelfBg : 'transparent',
    marginHorizontal: interpolate(
      stickyProgress.value,
      [0, 1],
      [0, -CONTENT_H_PADDING]
    ),
  }));

  const { isOffline, shouldShowTimeline } = useHabitsListHeaderComputed({
    justCreatedHabitId: props.justCreatedHabitId,
    totalHabits: props.totalHabits,
  });

  const { shouldShowBanner, daysRemaining } = useTrialCountdown();

  const isAllDone =
    props.totalHabits > 0 && props.completedToday >= props.totalHabits;

  return (
    <ReAnimated.View
      className='gap-2 pb-2'
      style={[
        STICKY_HEADER_LAYER,
        { paddingTop: insets.top },
        stickyWrapperStyle,
      ]}
    >
      <View className='absolute left-0 right-0 top-4 z-10 flex-row justify-center'>
        <OfflineIndicator
          testID='habits-offline-indicator'
          visible={isOffline}
        />
      </View>
      {shouldShowTimeline ? (
        <Animated.View
          style={{
            opacity: props.calendarOpacity,
            transform: [{ translateY: props.calendarTranslateY }],
          }}
        >
          <CalendarTimeline
            compact={props.compactView}
            disableFutureDayPress
            canNavigateForward={props.canNavigateForward}
            completedToday={props.completedToday}
            completionIcon={props.completionIcon}
            completionByDay={props.completionByDay}
            currentStreak={props.currentStreak}
            dates={props.weekDates}
            reduceMotion={props.reduceMotionPreference}
            strengthPercent={props.averageStrengthPercent}
            totalHabits={props.totalHabits}
            trialDaysRemaining={shouldShowBanner ? daysRemaining : null}
            onDayPress={props.onDayPress}
            onJumpToToday={props.onJumpToToday}
            onNextWeek={props.onNextWeek}
            onPreviousWeek={props.onPreviousWeek}
            onUpgrade={props.onUpgradePress}
          />
        </Animated.View>
      ) : null}
      <DayCompleteBeat
        isAllDone={isAllDone}
        reduceMotion={props.reduceMotionPreference}
      />
    </ReAnimated.View>
  );
}

export const HabitsListHeader = memo(HabitsListHeaderComponent);
