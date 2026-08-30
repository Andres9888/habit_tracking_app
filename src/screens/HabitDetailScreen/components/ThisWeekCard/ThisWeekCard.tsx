/**
 * ThisWeekCard — "This week" from the Habit Detail Prototype: range, count,
 * seven day pips, then the streak rail.
 *
 * The rail is back on this card because a check-in has to visibly change the
 * room, not a counter on another screen: one tap moves the pip, Current, Days
 * done and the caption underneath at the same time.
 */
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import { durations, enterEasing } from '../../../../theme/animations';
import { borderRadius, shadows } from '../../../../theme/spacing';
import { useInsightPalette } from '../../insightPalette';
import { milestoneCaption, milestoneTarget } from './milestoneTarget';
import { useThisWeek } from './useThisWeek';
import { WeekCardHeader } from './WeekCardHeader';
import { WeekDayDot } from './WeekDayDot';
import { WeekStatsRow, type WeekStat } from './WeekStatsRow';
import type { HabitDayContext } from '../../../../features/habits/habitDayState';

interface ThisWeekCardProps {
  bestStreak: number;
  completedDates: Set<string>;
  currentStreak: number;
  /** Completions this year — the window the habit is actually queried over. */
  daysLogged: number;
  dayContext: HabitDayContext;
  onDayPress: (date: string, isCompleted: boolean) => void;
}

export function ThisWeekCard({
  bestStreak,
  completedDates,
  currentStreak,
  daysLogged,
  dayContext,
  onDayPress,
}: ThisWeekCardProps) {
  const palette = useInsightPalette();
  const reduceMotion = useReduceMotion();
  const { days, doneCount, rangeLabel } = useThisWeek({
    completedDates,
    ...dayContext,
  });
  const { target, isBest } = milestoneTarget(currentStreak, bestStreak);
  const stats: readonly WeekStat[] = [
    { label: 'Current', tint: palette.amberBar, value: currentStreak },
    { label: 'Longest', tint: palette.ctaGreen, value: bestStreak },
    { label: 'Days done', value: daysLogged },
  ];

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
        loggedLabel={`${doneCount} ${doneCount === 1 ? 'day' : 'days'} logged`}
        palette={palette}
        rangeLabel={rangeLabel}
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
      <WeekStatsRow palette={palette} stats={stats} />
      <Text
        style={{
          color: palette.textSecondary,
          fontSize: 12.5,
          marginTop: 9,
          paddingHorizontal: 2,
          textAlign: 'center',
        }}
      >
        {milestoneCaption(currentStreak, target, isBest)}
      </Text>
    </Animated.View>
  );
}
