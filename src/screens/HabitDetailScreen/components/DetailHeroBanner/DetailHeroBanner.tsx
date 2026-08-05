/**
 * DetailHeroBanner — the pale-green wash at the top of the habit detail screen
 * (Habit Flow Prototype, frames 1 and 2): schedule eyebrow, serif habit name,
 * strength dial, the user's why, and whichever today-action the day calls for.
 *
 * The wash shifts a shade greener once today is logged and settles into the page
 * background at its last stop, so the hero melts into the cards below rather
 * than ending on a hard edge. Sits flush under DetailBandHeader, which paints
 * itself in the wash's first stop.
 *
 * Per the design there is no streak counter here — the Progress card carries the
 * streak numbers.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import type { Habit } from '../../../../features/habits/types';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { recoveryHeadline } from '../../insights';
import { useInsightPalette } from '../../insightPalette';
import { HeroTitleRow } from './HeroTitleRow';
import { HeroTodayActions } from './HeroTodayActions';
import { HeroRecoveryCard } from './HeroRecoveryCard';
import { HeroWhyPill } from './HeroWhyPill';

interface DetailHeroBannerProps {
  /** Local "h:mm a" label for today's completion, when known. */
  completedAtLabel?: string;
  /** Total completions this year — survives a streak reset. */
  daysDone: number;
  habit: Habit;
  isCompletedToday: boolean;
  /** Yesterday was scheduled and skipped — show the recovery state. */
  isMissedYesterday: boolean;
  isToggling: boolean;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function DetailHeroBanner({
  completedAtLabel,
  daysDone,
  habit,
  isCompletedToday,
  isMissedYesterday,
  isToggling,
  onDayPress,
}: DetailHeroBannerProps) {
  const palette = useInsightPalette();
  const wash = isCompletedToday
    ? palette.bandGradientDone
    : palette.bandGradient;

  return (
    <LinearGradient
      colors={wash}
      locations={palette.bandLocations}
      style={{ paddingBottom: 22 }}
    >
      <HeroTitleRow
        habit={habit}
        isCompletedToday={isCompletedToday}
        palette={palette}
      />
      <View style={{ paddingHorizontal: 20 }}>
        {isMissedYesterday ? (
          <HeroRecoveryCard
            bestStreak={habit.bestStreak ?? 0}
            daysDone={daysDone}
            headline={recoveryHeadline(habit.bestStreak ?? 0, daysDone)}
            palette={palette}
          />
        ) : (
          <HeroWhyPill habit={habit} palette={palette} />
        )}
      </View>
      <HeroTodayActions
        completedAtLabel={completedAtLabel}
        habit={habit}
        isCompletedToday={isCompletedToday}
        isRecovering={isMissedYesterday}
        isToggling={isToggling}
        palette={palette}
        onToggleToday={() => onDayPress(getLocalDateString(), isCompletedToday)}
      />
    </LinearGradient>
  );
}
