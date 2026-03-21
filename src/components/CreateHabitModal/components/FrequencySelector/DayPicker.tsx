/**
 * DayPicker - 7 day-of-week circles for custom frequency selection
 */

import { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { clsx } from 'clsx';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '@/theme/ThemeContext';

const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const FULL_DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

interface DayPickerProps {
  selectedDays: number[];
  onDaysChange: (days: number[]) => void;
  isDark: boolean;
  themeColors: { card: string; text: { secondary: string } };
}

export function DayPicker({
  selectedDays,
  onDaysChange,
  isDark,
  themeColors,
}: DayPickerProps) {
  const { colors } = useThemeColors();
  const handleDayToggle = useCallback(
    (dayIndex: number) => {
      triggerHaptic('tap');
      const next = selectedDays.includes(dayIndex)
        ? selectedDays.filter((d) => d !== dayIndex)
        : [...selectedDays, dayIndex];
      onDaysChange(next);
    },
    [selectedDays, onDaysChange]
  );

  return (
    <View className='mt-3 flex-row justify-between'>
      {DAY_NAMES.map((name, index) => {
        const isSelected = selectedDays.includes(index);
        return (
          <Pressable
            key={index}
            accessibilityLabel={`${FULL_DAY_NAMES[index]}${isSelected ? ' selected' : ''}`}
            accessibilityRole='checkbox'
            accessibilityState={{ checked: isSelected }}
            className='h-10 w-10 items-center justify-center rounded-full'
            style={{
              backgroundColor: isSelected
                ? colors.status.success
                : isDark ? themeColors.card : '#F5F5F4',
            }}
            onPress={() => handleDayToggle(index)}
          >
            <Text
              className={clsx(
                'text-xs font-semibold',
                isSelected && 'text-white'
              )}
              style={
                isSelected ? undefined : { color: themeColors.text.secondary }
              }
            >
              {name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
