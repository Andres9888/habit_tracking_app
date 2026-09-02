/**
 * ThisWeekCard — "This week" from the Habit Detail Prototype: range, count,
 * and seven day pips.
 *
 * No streak rail here. Current / Longest / Days done already live on the Goal
 * ladder (now, record, goal) and on Analytics; repeating them made Detail read
 * as a dashboard. The week is the week.
 */
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import { durations, enterEasing } from '../../../../theme/animations';
import { borderRadius, shadows } from '../../../../theme/spacing';
import { useInsightPalette } from '../../insightPalette';
import { useThisWeek } from './useThisWeek';
import { WeekCardHeader } from './WeekCardHeader';
import { weekProgressLabel } from './weekProgressLabel';
import { WeekDayDot } from './WeekDayDot';
import type { HabitDayContext } from '../../../../features/habits/habitDayState';

interface ThisWeekCardProps {
  completedDates: Set<string>;
  dayContext: HabitDayContext;
  onDayPress: (date: string, isCompleted: boolean) => void;
}

export function ThisWeekCard({
  completedDates,
  dayContext,
  onDayPress,
}: ThisWeekCardProps) {
  const palette = useInsightPalette();
  const reduceMotion = useReduceMotion();
  const { days, doneCount, rangeLabel, remainingScheduled } = useThisWeek({
    completedDates,
    ...dayContext,
  });
  const progress = weekProgressLabel(doneCount, remainingScheduled);

  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeIn.duration(durations.standard).easing(enterEasing)
      }
      style={{
        backgroundColor: palette.card,
        borderColor: palette.cardBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 13,
        ...shadows.subtle,
      }}
    >
      <WeekCardHeader
        loggedLabel={progress.label}
        palette={palette}
        rangeLabel={rangeLabel}
        tone={progress.tone}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {days.map((day) => (
          <WeekDayDot
            key={day.date}
            day={day}
            palette={palette}
            onPress={onDayPress}
          />
        ))}
      </View>
    </Animated.View>
  );
}
