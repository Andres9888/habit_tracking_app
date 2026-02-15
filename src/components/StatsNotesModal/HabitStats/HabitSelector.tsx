/**
 * Habit selector component for HabitStats
 */

import { ScrollView, Text, View } from 'react-native';

import type { HabitItem } from './HabitStats.types';
import type { Id } from '../../../../convex/_generated/dataModel';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface HabitSelectorProps {
  habits: HabitItem[];
  selectedHabitId: Id<'habits'> | null;
  onSelect: (id: Id<'habits'>) => void;
}

export function HabitSelector({
  habits,
  selectedHabitId,
  onSelect,
}: HabitSelectorProps) {
  return (
    <View className='gap-2'>
      <Text className='text-xs font-semibold uppercase tracking-[2px] text-stone-500'>
        SELECT HABIT
      </Text>
      <ScrollView
        horizontal
        className='flex-row gap-2'
        showsHorizontalScrollIndicator={false}
      >
        {habits.map((habit) => (
          <AnimatedPressable
            key={habit._id}
            accessibilityLabel={`View stats for ${habit.name}`}
            accessibilityRole='button'
            accessibilityState={{ selected: selectedHabitId === habit._id }}
            className={`rounded-xl px-4 py-2 ${
              selectedHabitId === habit._id ? 'bg-stone-900' : 'bg-stone-100'
            }`}
            onPress={() => onSelect(habit._id)}
          >
            <Text
              className={`text-sm font-medium ${
                selectedHabitId === habit._id ? 'text-white' : 'text-stone-700'
              }`}
            >
              {habit.name}
            </Text>
          </AnimatedPressable>
        ))}
      </ScrollView>
    </View>
  );
}
