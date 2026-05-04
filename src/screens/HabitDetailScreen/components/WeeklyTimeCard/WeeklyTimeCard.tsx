import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { shadows } from '../../../../theme/spacing';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { computeProgressStats } from './computeProgressStats';
import { DailyGoalCaption } from './DailyGoalCaption';
import { LogTimeSheet } from './LogTimeSheet';
import { TimeGoalsSheet } from './TimeGoalsSheet';
import { TotalRow } from './TotalRow';
import { useWeeklyTime } from './WeeklyTimeCard.hooks';
import { WeeklyTimeCardHeader } from './WeeklyTimeCardHeader';
import { WeeklyGoalStats } from './WeeklyGoalStats';
import { WeeklyProgressBar } from './WeeklyProgressBar';
import { WeeklyTimeBreakdown } from './WeeklyTimeBreakdown';
import type { WeeklyTimeCardProps } from './WeeklyTimeCard.types';

export function WeeklyTimeCard({
  habitId,
  habitColor,
  dailyMinutesGoal = 0,
  weeklyMinutesGoal = 0,
}: WeeklyTimeCardProps) {
  const { colors } = useThemeColors();
  const { closeEditor, days, editingDate, openEditor, todayKey, totalMinutes } =
    useWeeklyTime(habitId);
  const [goalsOpen, setGoalsOpen] = useState(false);
  const initialMinutes = editingDate
    ? days.find((d) => d.date === editingDate)?.minutes ?? 0
    : 0;
  const stats = computeProgressStats(days, totalMinutes, dailyMinutesGoal, weeklyMinutesGoal);
  const cardStyle = { ...shadows.card, backgroundColor: colors.card };
  const hasAnyGoal = dailyMinutesGoal > 0 || weeklyMinutesGoal > 0;

  return (
    <Animated.View
      className='overflow-hidden rounded-2xl shadow-sm'
      entering={FadeIn.duration(180)}
      style={cardStyle}
    >
      <View className='p-5'>
        <WeeklyTimeCardHeader
          hasAnyGoal={hasAnyGoal}
          onGoalsPress={() => setGoalsOpen(true)}
          onLogPress={() => openEditor(todayKey)}
        />
        <TotalRow totalMinutes={totalMinutes} />
        {weeklyMinutesGoal > 0 ? (
          <>
            <WeeklyProgressBar
              goalMinutes={weeklyMinutesGoal}
              habitColor={habitColor}
              totalMinutes={totalMinutes}
            />
            <WeeklyGoalStats
              avgMinutesPerDay={stats.avgMinutesPerDay}
              habitColor={habitColor}
              remainingToWeekly={stats.remainingToWeekly}
            />
          </>
        ) : null}
        {dailyMinutesGoal > 0 ? (
          <DailyGoalCaption
            dailyGoal={dailyMinutesGoal}
            daysHit={stats.daysHit}
            habitColor={habitColor}
            streak={stats.dailyStreak}
            totalDays={days.length}
          />
        ) : null}
        <WeeklyTimeBreakdown
          dailyGoalMinutes={dailyMinutesGoal}
          days={days}
          habitColor={habitColor}
          onDayPress={openEditor}
        />
      </View>
      <LogTimeSheet
        date={editingDate}
        habitId={habitId}
        initialMinutes={initialMinutes}
        onClose={closeEditor}
      />
      <TimeGoalsSheet
        habitId={habitId}
        initialDailyMinutes={dailyMinutesGoal}
        initialWeeklyMinutes={weeklyMinutesGoal}
        visible={goalsOpen}
        onClose={() => setGoalsOpen(false)}
      />
    </Animated.View>
  );
}
