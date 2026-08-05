import { View } from 'react-native';
import { DailyGoalCaption } from './DailyGoalCaption';
import { TimerBand } from './TimerBand';
import { TimerConfirmBand } from './TimerConfirmBand';
import { TotalRow } from './TotalRow';
import { WeeklyTimeCardHeader } from './WeeklyTimeCardHeader';
import { WeeklyGoalStats } from './WeeklyGoalStats';
import { WeeklyProgressBar } from './WeeklyProgressBar';
import { WeeklyTimeBreakdown } from './WeeklyTimeBreakdown';
import type { ProgressStats } from './computeProgressStats';
import type { WeekDay } from './WeeklyTimeCard.types';

interface WeeklyTimeCardBodyProps {
  accent: string;
  pendingMinutes: number | null;
  dailyMinutesGoal: number;
  displayDays: WeekDay[];
  displayTotal: number;
  elapsedSec: number;
  hasAnyGoal: boolean;
  running: boolean;
  stats: ProgressStats;
  weeklyMinutesGoal: number;
  onDayPress: (date: string) => void;
  onDiscardPress: () => void;
  onGoalsPress: () => void;
  onLogPress: () => void;
  onLogTimerPress: () => void;
  onStartPress: () => void;
  onStopPress: () => void;
}

export function WeeklyTimeCardBody(props: WeeklyTimeCardBodyProps) {
  const {
    accent, pendingMinutes, dailyMinutesGoal, displayDays, displayTotal, elapsedSec,
    hasAnyGoal, running, stats, weeklyMinutesGoal,
    onDayPress, onDiscardPress, onGoalsPress, onLogPress, onLogTimerPress, onStartPress, onStopPress,
  } = props;
  return (
    <View className='p-5'>
      {running ? (
        <TimerBand elapsedSec={elapsedSec} habitColor={accent} onStop={onStopPress} />
      ) : null}
      {!running && pendingMinutes !== null ? (
        <TimerConfirmBand
          habitColor={accent}
          recordedMinutes={pendingMinutes}
          onDiscard={onDiscardPress}
          onLog={onLogTimerPress}
        />
      ) : null}
      <WeeklyTimeCardHeader
        habitColor={accent}
        hasAnyGoal={hasAnyGoal}
        running={running}
        onGoalsPress={onGoalsPress}
        onLogPress={onLogPress}
        onStartPress={onStartPress}
      />
      <TotalRow totalMinutes={displayTotal} />
      {weeklyMinutesGoal > 0 ? (
        <>
          <WeeklyProgressBar
            goalMinutes={weeklyMinutesGoal}
            habitColor={accent}
            totalMinutes={displayTotal}
          />
          <WeeklyGoalStats
            avgMinutesPerDay={stats.avgMinutesPerDay}
            habitColor={accent}
            remainingToWeekly={stats.remainingToWeekly}
          />
        </>
      ) : null}
      {dailyMinutesGoal > 0 ? (
        <DailyGoalCaption
          dailyGoal={dailyMinutesGoal}
          daysHit={stats.daysHit}
          habitColor={accent}
          streak={stats.dailyStreak}
          totalDays={displayDays.length}
        />
      ) : null}
      <WeeklyTimeBreakdown
        dailyGoalMinutes={dailyMinutesGoal}
        days={displayDays}
        habitColor={accent}
        onDayPress={onDayPress}
      />
    </View>
  );
}
