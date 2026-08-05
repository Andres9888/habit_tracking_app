/** DetailHeroSection - Fused hero (icon/name/streak/total/complete bar) plus milestone beat. */
import { View } from 'react-native';
import type { Habit } from '../../../features/habits/types';
import { DetailHero } from './DetailHero';
import { MilestoneBeat } from './MilestoneBeat';

interface DetailHeroSectionProps {
  habit: Habit;
  isCompletedToday: boolean;
  isToggling: boolean;
  totalCompletions: number;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function DetailHeroSection({
  habit,
  isCompletedToday,
  isToggling,
  totalCompletions,
  onDayPress,
}: DetailHeroSectionProps) {
  return (
    <View>
      <DetailHero
        habit={habit}
        isCompletedToday={isCompletedToday}
        isToggling={isToggling}
        totalCompletions={totalCompletions}
        onDayPress={onDayPress}
      />
      <MilestoneBeat
        currentStreak={habit.currentStreak ?? 0}
        isCompletedToday={isCompletedToday}
      />
    </View>
  );
}
