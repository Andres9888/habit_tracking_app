/**
 * DetailHeroBanner — habit and its plan, then the state-aware context and
 * today's action. Strength lives below this hero so it never grades the user
 * before recovery or action.
 *
 * The why is never hidden by state: the ready state shows the full pill, and
 * recovery / completed show it as one line under their state card.
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
import { HeroWhyLine } from './HeroWhyLine';
import { HeroWhyPill } from './HeroWhyPill';
import { heroWash, smallVersionHint } from './DetailHeroBanner.utils';

interface DetailHeroBannerProps {
  /** Length of the run the miss ended — recovery copy only. */
  brokenRun?: number;
  habit: Habit;
  isToggling: boolean;
  /** Consecutive missed scheduled days ending yesterday — recovery copy only. */
  missedDays?: number;
  recoveryDayLabel?: string;
  todayNote?: string;
  todayState: HabitDayState;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  /** The plan line under the title opens Edit. */
  onEditPlan: () => void;
  onOpenNote: () => void;
}

export function DetailHeroBanner({
  brokenRun = 0,
  habit,
  isToggling,
  missedDays = 1,
  recoveryDayLabel,
  todayNote,
  todayState,
  onDayPress,
  onEditPlan,
  onOpenNote,
}: DetailHeroBannerProps) {
  const palette = useInsightPalette();
  const isCompletedToday = todayState === 'completed';
  const isRecovery = todayState === 'open-today' && Boolean(recoveryDayLabel);
  const wash = heroWash(palette, todayState, isRecovery);
  const showWhyLine = isRecovery || isCompletedToday;

  return (
    <View>
      <LinearGradient
        colors={wash}
        locations={palette.bandLocations}
        style={{ paddingBottom: 12 }}
      >
        <HeroTitleRow habit={habit} palette={palette} onEditPlan={onEditPlan} />
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
            missedDays={missedDays}
            palette={palette}
          />
        ) : (
          <HeroWhyPill habit={habit} palette={palette} />
        )}
        {showWhyLine ? (
          <HeroWhyLine habit={habit} isRecovery={isRecovery} palette={palette} />
        ) : null}
        <HeroTodayActions
          isToggling={isToggling}
          recoveryHint={isRecovery ? smallVersionHint(habit) : undefined}
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
