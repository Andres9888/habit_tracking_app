/**
 * DetailHeroBanner — sage wash with the centered strength dial, then the
 * paper-page why / recovery card and today's action. Matches the full-flow mock.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import type { Habit } from '../../../../features/habits/types';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { useInsightPalette } from '../../insightPalette';
import { HeroTitleRow } from './HeroTitleRow';
import { HeroTodayActions } from './HeroTodayActions';
import { HeroRecoveryCard } from './HeroRecoveryCard';
import { HeroWhyPill } from './HeroWhyPill';

interface DetailHeroBannerProps {
  habit: Habit;
  isCompletedToday: boolean;
  isMissedYesterday: boolean;
  isToggling: boolean;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function DetailHeroBanner({
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
    <View>
      <LinearGradient
        colors={wash}
        locations={palette.bandLocations}
        style={{ paddingBottom: 12 }}
      >
        <HeroTitleRow habit={habit} palette={palette} />
      </LinearGradient>
      <View style={{ backgroundColor: wash[2], paddingHorizontal: 20 }}>
        {isMissedYesterday ? (
          <HeroRecoveryCard palette={palette} />
        ) : (
          <HeroWhyPill habit={habit} palette={palette} />
        )}
        <HeroTodayActions
          isCompletedToday={isCompletedToday}
          isToggling={isToggling}
          onToggleToday={() =>
            onDayPress(getLocalDateString(), isCompletedToday)
          }
        />
      </View>
    </View>
  );
}
