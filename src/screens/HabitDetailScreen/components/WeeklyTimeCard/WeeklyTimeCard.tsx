import { useState } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { shadows } from '../../../../theme/spacing';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { computeProgressStats } from './computeProgressStats';
import { LogTimeSheet } from './LogTimeSheet';
import { TimeGoalsSheet } from './TimeGoalsSheet';
import { useTimerOrchestration } from './useTimerOrchestration';
import { useWeeklyTime } from './WeeklyTimeCard.hooks';
import { WeeklyTimeCardBody } from './WeeklyTimeCardBody';
import type { WeeklyTimeCardProps } from './WeeklyTimeCard.types';

export function WeeklyTimeCard({
  habitId,
  habitColor,
  dailyMinutesGoal = 0,
  weeklyMinutesGoal = 0,
}: WeeklyTimeCardProps) {
  const { colors } = useThemeColors();
  const accent = habitColor ?? colors.primary[600];
  const { closeEditor, days, editingDate, openEditor, todayKey, totalMinutes } =
    useWeeklyTime(habitId);
  const todayPersistedMinutes = days.find((d) => d.isToday)?.minutes ?? 0;
  const {
    elapsedMin,
    elapsedSec,
    handleDiscard,
    handleLog,
    handleStart,
    handleStop,
    pendingMinutes,
    running,
  } = useTimerOrchestration({ habitId, todayKey, todayPersistedMinutes });
  const [goalsOpen, setGoalsOpen] = useState(false);

  const runningMinutes = running ? elapsedMin : 0;
  const displayTotal = totalMinutes + runningMinutes;
  const displayDays = running
    ? days.map((d) => (d.isToday ? { ...d, minutes: d.minutes + runningMinutes } : d))
    : days;
  const initialMinutes = editingDate
    ? days.find((d) => d.date === editingDate)?.minutes ?? 0
    : 0;
  const stats = computeProgressStats(displayDays, displayTotal, dailyMinutesGoal, weeklyMinutesGoal);
  const hasAnyGoal = dailyMinutesGoal > 0 || weeklyMinutesGoal > 0;

  return (
    <Animated.View
      className='overflow-hidden rounded-2xl shadow-sm'
      entering={FadeIn.duration(180)}
      style={{ ...shadows.card, backgroundColor: colors.card }}
    >
      <WeeklyTimeCardBody
        accent={accent}
        dailyMinutesGoal={dailyMinutesGoal}
        displayDays={displayDays}
        displayTotal={displayTotal}
        elapsedSec={elapsedSec}
        hasAnyGoal={hasAnyGoal}
        pendingMinutes={pendingMinutes}
        running={running}
        stats={stats}
        weeklyMinutesGoal={weeklyMinutesGoal}
        onDayPress={openEditor}
        onDiscardPress={handleDiscard}
        onGoalsPress={() => setGoalsOpen(true)}
        onLogPress={() => openEditor(todayKey)}
        onLogTimerPress={() => void handleLog()}
        onStartPress={handleStart}
        onStopPress={() => void handleStop()}
      />
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
