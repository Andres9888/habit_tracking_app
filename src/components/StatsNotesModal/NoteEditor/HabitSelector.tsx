/**
 * HabitSelector Component
 *
 * Allows selecting a habit to link with a note.
 */

import { memo } from 'react';
import { Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';

import type { HabitSelectorProps } from './types';

export const HabitSelector = memo(function HabitSelector({
  habits,
  selectedHabitId,
  onSelectHabit,
}: HabitSelectorProps) {
  const { colors } = useThemeColors();
  return (
    <View
      className='rounded-2xl border px-4 py-3'
      style={{ borderColor: colors.border, backgroundColor: colors.card }}
    >
      <Text
        className='mb-2 text-xs font-semibold uppercase tracking-[2px]'
        style={{ color: colors.text.tertiary }}
      >
        LINKED HABIT (OPTIONAL)
      </Text>
      <View className='gap-2'>
        <AnimatedPressable
          accessibilityLabel='No habit selected'
          accessibilityRole='button'
          accessibilityState={{ selected: !selectedHabitId }}
          className='rounded-xl px-3 py-2'
          style={{
            backgroundColor: selectedHabitId
              ? colors.gray[100]
              : colors.gray[900],
          }}
          onPress={() => onSelectHabit()}
        >
          <Text
            className='text-sm font-medium'
            style={{
              color: selectedHabitId
                ? colors.text.primary
                : colors.text.inverse,
            }}
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
            className='rounded-xl px-3 py-2'
            style={{
              backgroundColor:
                selectedHabitId === habit._id
                  ? colors.gray[900]
                  : colors.gray[100],
            }}
            onPress={() => onSelectHabit(habit._id)}
          >
            <Text
              className='text-sm font-medium'
              style={{
                color:
                  selectedHabitId === habit._id
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
});
