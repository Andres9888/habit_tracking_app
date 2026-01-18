/**
 * HabitFilter Component
 * Filter chips for selecting habits
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { Id } from '../../../../../convex/_generated/dataModel';

interface Habit {
  _id: Id<'habits'>;
  name: string;
}

interface HabitFilterProps {
  habits: Habit[];
  selectedFilter: Id<'habits'> | 'all';
  onFilterChange: (filter: Id<'habits'> | 'all') => void;
}

export const HabitFilter: React.FC<HabitFilterProps> = ({
  habits,
  selectedFilter,
  onFilterChange,
}) => (
  <View className='gap-2'>
    <Text className='text-xs font-semibold uppercase tracking-[2px] text-stone-500'>
      FILTER BY HABIT
    </Text>
    <View className='flex-row flex-wrap gap-2'>
      <TouchableOpacity
        accessibilityLabel='Show all notes'
        accessibilityRole='button'
        className={`rounded-xl px-3 py-2 ${
          selectedFilter === 'all' ? 'bg-stone-900' : 'bg-stone-100'
        }`}
        onPress={() => onFilterChange('all')}
      >
        <Text
          className={`text-sm font-medium ${
            selectedFilter === 'all' ? 'text-white' : 'text-stone-700'
          }`}
        >
          All
        </Text>
      </TouchableOpacity>
      {habits.map((habit) => (
        <TouchableOpacity
          key={habit._id}
          accessibilityLabel={`Filter by ${habit.name}`}
          accessibilityRole='button'
          className={`rounded-xl px-3 py-2 ${
            selectedFilter === habit._id ? 'bg-stone-900' : 'bg-stone-100'
          }`}
          onPress={() => onFilterChange(habit._id)}
        >
          <Text
            className={`text-sm font-medium ${
              selectedFilter === habit._id ? 'text-white' : 'text-stone-700'
            }`}
          >
            {habit.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);
