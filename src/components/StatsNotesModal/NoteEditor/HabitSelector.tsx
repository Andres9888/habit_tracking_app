/**
 * HabitSelector Component
 *
 * Allows selecting a habit to link with a note.
 */

import { Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

import type { HabitSelectorProps } from './types';

export function HabitSelector({
  habits,
  selectedHabitId,
  onSelectHabit,
}: HabitSelectorProps) {
  return (
    <View className='rounded-2xl border border-stone-200 bg-white px-4 py-3'>
      <Text className='mb-2 text-xs font-semibold uppercase tracking-[2px] text-stone-500'>
        LINKED HABIT (OPTIONAL)
      </Text>
      <View className='gap-2'>
        <AnimatedPressable
          accessibilityLabel='No habit selected'
          accessibilityRole='button'
          accessibilityState={{ selected: !selectedHabitId }}
          className={`rounded-xl px-3 py-2 ${
            selectedHabitId ? 'bg-stone-100' : 'bg-stone-900'
          }`}
          onPress={() => onSelectHabit(undefined)}
        >
          <Text
            className={`text-sm font-medium ${
              selectedHabitId ? 'text-stone-700' : 'text-white'
            }`}
          >
            None
          </Text>
        </AnimatedPressable>
        {habits.map((habit) => (
          <AnimatedPressable
            key={habit._id}
            accessibilityLabel={`Link to ${habit.name}`}
            accessibilityRole='button'
            accessibilityState={{ selected: selectedHabitId === habit._id }}
            className={`rounded-xl px-3 py-2 ${
              selectedHabitId === habit._id ? 'bg-stone-900' : 'bg-stone-100'
            }`}
            onPress={() => onSelectHabit(habit._id)}
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
      </View>
    </View>
  );
}
