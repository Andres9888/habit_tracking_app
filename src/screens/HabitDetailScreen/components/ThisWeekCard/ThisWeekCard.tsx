/**
 * ThisWeekCard — the "Progress" card: Monday-first week strip, the three-up
 * stat rail, and the milestone streak bar. First card below the hero wash,
 * matching the Habit Flow Prototype's Progress section.
 */
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import { durations, enterEasing } from '../../../../theme/animations';
import { borderRadius, shadows } from '../../../../theme/spacing';
import { useInsightPalette } from '../../insightPalette';
import { CardEyebrow } from '../CardEyebrow';
import { MilestoneBar } from './MilestoneBar';
import { useThisWeek } from './useThisWeek';
import { WeekDayDot } from './WeekDayDot';
import { WeekStatsRow, type WeekStat } from './WeekStatsRow';

interface ThisWeekCardProps {
  bestStreak: number;
  completedDates: Set<string>;
  currentStreak: number;
  daysOfWeek?: number[];
  /** Completions in the current calendar year, from useHabitInsights. */
  yearCompletions: number;
  onDayPress: (date: string, isCompleted: boolean) => void;
}

export function ThisWeekCard({
  bestStreak,
  completedDates,
  currentStreak,
  daysOfWeek,
  yearCompletions,
  onDayPress,
}: ThisWeekCardProps) {
  const palette = useInsightPalette();
  const reduceMotion = useReduceMotion();
  const { days, doneCount, scheduledCount } = useThisWeek({
    completedDates,
    daysOfWeek,
  });

  const stats: readonly WeekStat[] = [
    { label: 'Current streak', tint: palette.amberBar, value: currentStreak },
    { label: 'Longest', tint: palette.green, value: bestStreak },
    { label: 'Days this year', value: yearCompletions },
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
        padding: 18,
        ...shadows.subtle,
      }}
    >
      <CardEyebrow
        label='Progress'
        note={`${doneCount} of ${scheduledCount} this week`}
        palette={palette}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}
      >
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
      <MilestoneBar currentStreak={currentStreak} palette={palette} />
    </Animated.View>
  );
}
