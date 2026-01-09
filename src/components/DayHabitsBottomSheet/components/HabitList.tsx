import { ScrollView } from 'react-native';

import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitStatus } from '../../../features/habits/types';
import { HabitDayToggleRow } from '../HabitDayToggleRow';

interface HabitListProps {
  habits: Habit[];
  dateString: string;
  togglingHabitId: string | null;
  reduceMotion: boolean;
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  onToggleHabit: (habitId: Id<'habits'>) => Promise<void>;
}

/**
 * Scrollable list of habits for the bottom sheet
 */
export function HabitList({
  habits,
  dateString,
  togglingHabitId,
  reduceMotion,
  getHabitStatus,
  onToggleHabit,
}: HabitListProps) {
  return (
    <ScrollView
      className='px-4'
      contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
      showsVerticalScrollIndicator={false}
    >
      {habits.map((habit) => {
        const status = getHabitStatus(habit._id, dateString);
        const isCompleted = status === 'done';
        const isLoading = togglingHabitId === habit._id;

        return (
          <HabitDayToggleRow
            key={habit._id}
            habit={habit}
            isCompleted={isCompleted}
            isLoading={isLoading}
            reduceMotion={reduceMotion}
            onToggle={() => onToggleHabit(habit._id as Id<'habits'>)}
          />
        );
      })}
    </ScrollView>
  );
}
