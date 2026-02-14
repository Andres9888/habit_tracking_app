/**
 * HabitSelector Component
 *
 * Allows selecting a habit to link with a note.
 */

import { Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';

import type { HabitSelectorProps } from './types';

export function HabitSelector({
  habits,
  selectedHabitId,
  onSelectHabit,
}: HabitSelectorProps) {
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
    <View
      className='rounded-2xl px-4 py-3'
      style={{
        backgroundColor: themeColors.surface,
        borderColor: themeColors.border,
        borderWidth: 1,
      }}
    >
      <Text
        className='mb-2 text-xs font-semibold uppercase tracking-[2px]'
        style={{ color: themeColors.text.secondary }}
      >
        LINKED HABIT (OPTIONAL)
      </Text>
      <View className='gap-2'>
        <AnimatedPressable
          accessibilityLabel='No habit selected'
          accessibilityRole='button'
          accessibilityState={{ selected: !selectedHabitId }}
          className='rounded-xl px-3 py-2'
          style={chipStyle(!selectedHabitId)}
          onPress={() => onSelectHabit()}
        >
          <Text
            className='text-sm font-medium'
            style={chipTextStyle(!selectedHabitId)}
          >
            None
          </Text>
        </AnimatedPressable>
        {habits.map((habit) => {
          const isSelected = selectedHabitId === habit._id;
          return (
            <AnimatedPressable
              key={habit._id}
              accessibilityLabel={`Link to ${habit.name}`}
              accessibilityRole='button'
              accessibilityState={{ selected: isSelected }}
              className='rounded-xl px-3 py-2'
              style={chipStyle(isSelected)}
              onPress={() => onSelectHabit(habit._id)}
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
}
