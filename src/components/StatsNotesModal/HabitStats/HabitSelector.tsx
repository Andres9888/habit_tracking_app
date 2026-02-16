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
  const { colors } = useThemeColors();
  return (
    <View className='gap-2'>
      <Text className='text-xs font-semibold uppercase tracking-[2px]' style={{ color: colors.text.tertiary }}>
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
            className='rounded-xl px-4 py-2'
            style={{ backgroundColor: selectedHabitId === habit._id ? colors.gray[900] : colors.gray[100] }}
            onPress={() => onSelect(habit._id)}
          >
            <Text
              className='text-sm font-medium'
              style={{ color: selectedHabitId === habit._id ? colors.text.inverse : colors.text.primary }}
            >
              {habit.name}
            </Text>
          </AnimatedPressable>
        ))}
      </ScrollView>
    </View>
  );
}
