/** DetailHeroSection — fused hero + milestone beat. */
import { View, type LayoutChangeEvent } from 'react-native';
import type { Habit } from '../../../features/habits/types';
import { DetailHero } from './DetailHero';
import { MilestoneBeat } from './MilestoneBeat';

interface DetailHeroSectionProps {
  completedDates: Set<string>;
  habit: Habit;
  isCompletedToday: boolean;
  isToggling: boolean;
  totalCompletions: number;
  onCompletePress: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export function DetailHeroSection({
  completedDates,
  habit,
  isCompletedToday,
  isToggling,
  totalCompletions,
  onCompletePress,
  onLayout,
}: DetailHeroSectionProps) {
  return (
    <View onLayout={onLayout}>
      <DetailHero
        completedDates={completedDates}
        habit={habit}
        isCompletedToday={isCompletedToday}
        isToggling={isToggling}
        totalCompletions={totalCompletions}
        onCompletePress={onCompletePress}
      />
      <MilestoneBeat
        currentStreak={habit.currentStreak ?? 0}
        isCompletedToday={isCompletedToday}
      />
    </View>
  );
}
