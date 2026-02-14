/**
 * HabitFilter Component
 * Filter chips for selecting habits
 */

import React from 'react';
import { View, Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';
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
}) => {
  const { colors: themeColors, isDark } = useThemeColors();

  const chipStyle = (isSelected: boolean) => ({
    backgroundColor: isSelected
      ? themeColors.text.primary
      : isDark ? '#374151' : '#f5f5f4',
  });

  const chipTextStyle = (isSelected: boolean) => ({
    color: isSelected ? themeColors.background : themeColors.text.secondary,
  });

  return (
    <View className='gap-2'>
      <Text
        className='text-xs font-semibold uppercase tracking-[2px]'
        style={{ color: themeColors.text.secondary }}
      >
        FILTER BY HABIT
      </Text>
      <View className='flex-row flex-wrap gap-2'>
        <AnimatedPressable
          accessibilityLabel='Show all notes'
          accessibilityRole='button'
          accessibilityState={{ selected: selectedFilter === 'all' }}
          className='rounded-xl px-3 py-2'
          style={chipStyle(selectedFilter === 'all')}
          onPress={() => onFilterChange('all')}
        >
          <Text
            className='text-sm font-medium'
            style={chipTextStyle(selectedFilter === 'all')}
          >
            All
          </Text>
        </AnimatedPressable>
        {habits.map((habit) => {
          const isSelected = selectedFilter === habit._id;
          return (
            <AnimatedPressable
              key={habit._id}
              accessibilityLabel={`Filter by ${habit.name}`}
              accessibilityRole='button'
              accessibilityState={{ selected: isSelected }}
              className='rounded-xl px-3 py-2'
              style={chipStyle(isSelected)}
              onPress={() => onFilterChange(habit._id)}
            >
              <Text
                className='text-sm font-medium'
                style={chipTextStyle(isSelected)}
              >
                {habit.name}
              </Text>
            </AnimatedPressable>
          );
        })}
      </View>
    </View>
  );
};
