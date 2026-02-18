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

export const HabitFilter: React.FC<HabitFilterProps> = React.memo(
  ({ habits, selectedFilter, onFilterChange }) => {
    const { colors } = useThemeColors();
    return (
      <View className='gap-2'>
        <Text
          className='text-xs font-semibold uppercase tracking-[2px]'
          style={{ color: colors.text.tertiary }}
        >
          FILTER BY HABIT
        </Text>
        <View className='flex-row flex-wrap gap-2'>
          <AnimatedPressable
            accessibilityLabel='Show all notes'
            accessibilityRole='button'
            accessibilityState={{ selected: selectedFilter === 'all' }}
            className='rounded-xl px-3 py-2'
            style={{
              backgroundColor:
                selectedFilter === 'all' ? colors.gray[900] : colors.gray[100],
            }}
            onPress={() => onFilterChange('all')}
          >
            <Text
              className='text-sm font-medium'
              style={{
                color:
                  selectedFilter === 'all'
                    ? colors.text.inverse
                    : colors.text.primary,
              }}
            >
              All
            </Text>
          </AnimatedPressable>
          {habits.map((habit) => (
            <AnimatedPressable
              key={habit._id}
              accessibilityLabel={`Filter by ${habit.name}`}
              accessibilityRole='button'
              accessibilityState={{ selected: selectedFilter === habit._id }}
              className='rounded-xl px-3 py-2'
              style={{
                backgroundColor:
                  selectedFilter === habit._id
                    ? colors.gray[900]
                    : colors.gray[100],
              }}
              onPress={() => onFilterChange(habit._id)}
            >
              <Text
                className='text-sm font-medium'
                style={{
                  color:
                    selectedFilter === habit._id
                      ? colors.text.inverse
                      : colors.text.primary,
                }}
              >
                {habit.name}
              </Text>
            </AnimatedPressable>
          ))}
        </View>
      </View>
    );
  }
);
