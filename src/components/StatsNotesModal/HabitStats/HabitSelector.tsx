/**
 * Habit selector component for HabitStats
 */

import { ScrollView, Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { HabitItem } from './HabitStats.types';

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
  const { colors: themeColors, isDark } = useThemeColors();

  return (
    <View className='gap-2'>
      <Text
        className='text-xs font-semibold uppercase tracking-[2px]'
        style={{ color: themeColors.text.secondary }}
      >
        SELECT HABIT
      </Text>
      <ScrollView
        horizontal
        className='flex-row gap-2'
        showsHorizontalScrollIndicator={false}
      >
        {habits.map((habit) => {
          const isSelected = selectedHabitId === habit._id;
          return (
            <AnimatedPressable
              key={habit._id}
              accessibilityLabel={`View stats for ${habit.name}`}
              accessibilityRole='button'
              accessibilityState={{ selected: isSelected }}
              className='rounded-xl px-4 py-2'
              style={{
                backgroundColor: isSelected
                  ? themeColors.text.primary
                  : isDark ? '#374151' : '#f5f5f4',
              }}
              onPress={() => onSelect(habit._id)}
            >
              <Text
                className='text-sm font-medium'
                style={{
                  color: isSelected
                    ? themeColors.background
                    : themeColors.text.secondary,
                }}
              >
                {habit.name}
              </Text>
            </AnimatedPressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
