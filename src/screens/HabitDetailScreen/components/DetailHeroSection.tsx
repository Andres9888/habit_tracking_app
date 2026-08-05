/** DetailHeroSection - Identity + primary action + compact Mon-Sun chain. */
import { View } from 'react-native';
import type { Habit } from '../../../features/habits/types';
import { DetailHero } from './DetailHero';
import { DetailWeekStrip } from './DetailWeekStrip';

interface DetailHeroSectionProps {
  completedDates: Set<string>;
  habit: Habit;
  habitColor: string;
  isCompletedToday: boolean;
  isToggling: boolean;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function DetailHeroSection({
  completedDates,
  habit,
  habitColor,
  isCompletedToday,
  isToggling,
  onDayPress,
}: DetailHeroSectionProps) {
  return (
    <View>
      <DetailHero
        habit={habit}
        isCompletedToday={isCompletedToday}
        isToggling={isToggling}
        onDayPress={onDayPress}
      />
      <DetailWeekStrip
        completedDates={completedDates}
        habitColor={habitColor}
        habitCreatedAt={habit.createdAt}
        onDayPress={onDayPress}
      />
    </View>
  );
}
