/**
 * Habit selector component for HabitStats
 */

import { useCallback } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { HabitItem } from './HabitStats.types';

interface HabitSelectorItemProps {
  habit: HabitItem;
  isSelected: boolean;
  onSelect: (id: Id<'habits'>) => void;
}

function HabitSelectorItem({ habit, isSelected, onSelect }: HabitSelectorItemProps) {
  const handlePress = useCallback(() => onSelect(habit._id), [onSelect, habit._id]);

  return (
    <TouchableOpacity
      accessibilityLabel={`View stats for ${habit.name}`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      activeOpacity={0.7}
      className={`rounded-xl px-4 py-2 ${
        isSelected ? 'bg-stone-900' : 'bg-stone-100'
      }`}
      onPress={handlePress}
    >
      <Text
        className={`text-sm font-medium ${
          isSelected ? 'text-white' : 'text-stone-700'
        }`}
      >
        {habit.name}
      </Text>
    </TouchableOpacity>
  );
}

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
          <HabitSelectorItem
            key={habit._id}
            habit={habit}
            isSelected={selectedHabitId === habit._id}
            onSelect={onSelect}
          />
        ))}
      </ScrollView>
    </View>
  );
}
