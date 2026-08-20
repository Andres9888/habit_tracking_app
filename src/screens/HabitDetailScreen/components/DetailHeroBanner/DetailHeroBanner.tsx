/**
 * DetailHeroBanner — habit and schedule, then the state-aware context and
 * today's action. Strength lives below this hero so it never grades the user
 * before recovery or action.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import type { Habit } from '../../../../features/habits/types';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { useInsightPalette } from '../../insightPalette';
import { HeroTitleRow } from './HeroTitleRow';
import { HeroTodayActions } from './HeroTodayActions';
import { HeroRecoveryCard } from './HeroRecoveryCard';
import { HeroStateCard } from './HeroStateCard';
import { HeroWhyPill } from './HeroWhyPill';

interface DetailHeroBannerProps {
  habit: Habit;
  isCompletedToday: boolean;
  isScheduledToday: boolean;
  isToggling: boolean;
  recoveryDayLabel?: string;
  todayNote?: string;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onOpenNote: () => void;
}

export function DetailHeroBanner({
  habit,
  isCompletedToday,
  isScheduledToday,
  isToggling,
  recoveryDayLabel,
  todayNote,
  onDayPress,
  onOpenNote,
}: DetailHeroBannerProps) {
  const palette = useInsightPalette();
  const wash = isCompletedToday
    ? palette.bandGradientDone
    : palette.bandGradient;

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
        {isCompletedToday ? (
          <HeroStateCard palette={palette} state='completed' />
        ) : !isScheduledToday ? (
          <HeroStateCard palette={palette} state='off' />
        ) : recoveryDayLabel ? (
          <HeroRecoveryCard
            missedDayLabel={recoveryDayLabel}
            palette={palette}
          />
        ) : (
          <HeroWhyPill habit={habit} palette={palette} />
        )}
        <HeroTodayActions
          isCompletedToday={isCompletedToday}
          isScheduledToday={isScheduledToday}
          isToggling={isToggling}
          todayNote={todayNote}
          onOpenNote={onOpenNote}
          onToggleToday={() =>
            onDayPress(getLocalDateString(), isCompletedToday)
          }
        />
      </View>
    </View>
  );
}
