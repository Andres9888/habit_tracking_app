/**
 * DetailHeroBanner — habit and schedule, then the state-aware context and
 * today's action. Strength lives below this hero so it never grades the user
 * before recovery or action.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import type { Habit } from '../../../../features/habits/types';
import type { HabitDayState } from '../../../../features/habits/habitDayState';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { useInsightPalette } from '../../insightPalette';
import { HeroTitleRow } from './HeroTitleRow';
import { HeroTodayActions } from './HeroTodayActions';
import { HeroRecoveryCard } from './HeroRecoveryCard';
import { HeroStateCard } from './HeroStateCard';
import { HeroWhyPill } from './HeroWhyPill';
import { heroWash, twoMinuteHint } from './DetailHeroBanner.utils';

interface DetailHeroBannerProps {
  /** Length of the run the miss ended — recovery copy only. */
  brokenRun?: number;
  habit: Habit;
  isToggling: boolean;
  recoveryDayLabel?: string;
  todayNote?: string;
  todayState: HabitDayState;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onOpenNote: () => void;
}

export function DetailHeroBanner({
  brokenRun = 0,
  habit,
  isToggling,
  recoveryDayLabel,
  todayNote,
  todayState,
  onDayPress,
  onOpenNote,
}: DetailHeroBannerProps) {
  const palette = useInsightPalette();
  const isCompletedToday = todayState === 'completed';
  const isRecovery = todayState === 'open-today' && Boolean(recoveryDayLabel);
  const wash = heroWash(palette, todayState, isRecovery);

  return (
    <View>
      <LinearGradient
        colors={wash}
        locations={palette.bandLocations}
        style={{ paddingBottom: 12 }}
      >
        <HeroTitleRow habit={habit} palette={palette} />
      </LinearGradient>
      <View style={{ backgroundColor: wash[2], paddingHorizontal: 20 }}>
        {todayState === 'completed' ? (
          <HeroStateCard palette={palette} state='completed' />
        ) : todayState === 'paused' ? (
          <HeroStateCard palette={palette} state='paused' />
        ) : todayState !== 'open-today' ? (
          <HeroStateCard palette={palette} state='off' />
        ) : recoveryDayLabel ? (
          <HeroRecoveryCard
            bestStreak={habit.bestStreak ?? 0}
            brokenRun={brokenRun}
            missedDayLabel={recoveryDayLabel}
            palette={palette}
          />
        ) : (
          <HeroWhyPill habit={habit} palette={palette} />
        )}
        <HeroTodayActions
          isToggling={isToggling}
          recoveryHint={isRecovery ? twoMinuteHint(habit) : undefined}
          todayNote={todayNote}
          todayState={todayState}
          onOpenNote={onOpenNote}
          onToggleToday={() =>
            onDayPress(getLocalDateString(), isCompletedToday)
          }
        />
      </View>
    </View>
  );
}
