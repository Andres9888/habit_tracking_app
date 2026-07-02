/** DetailHeroSection - Hero plus Complete Today button, above the sticky tabs. */
import { View } from 'react-native';
import type { Habit } from '../../../features/habits/types';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { DetailCompleteButton } from './DetailCompleteButton';
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
        totalCompletions={totalCompletions}
      />
      <DetailCompleteButton
        disabled={isToggling}
        isCompletedToday={isCompletedToday}
        onPress={() => onDayPress(getLocalDateString(), isCompletedToday)}
      />
      <MilestoneBeat
        currentStreak={habit.currentStreak ?? 0}
        isCompletedToday={isCompletedToday}
      />
    </View>
  );
}
