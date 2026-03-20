/**
 * FrequencySelector - Inline frequency picker for habit creation
 *
 * Shows Daily/Weekdays/Custom pills. When Custom is selected,
 * reveals 7 day-of-week circles for granular scheduling.
 */

import { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { clsx } from 'clsx';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';
import { DayPicker } from './DayPicker';

const FREQUENCY_OPTIONS = ['daily', 'weekdays', 'custom'] as const;
type Frequency = (typeof FREQUENCY_OPTIONS)[number];

const LABELS: Record<Frequency, string> = {
  daily: 'Daily',
  weekdays: 'Weekdays',
  custom: 'Custom',
};

const WEEKDAY_INDICES = [1, 2, 3, 4, 5];

interface FrequencySelectorProps {
  frequency: string;
  selectedDays: number[];
  onFrequencyChange: (freq: string) => void;
  onDaysChange: (days: number[]) => void;
}

export function FrequencySelector({
  frequency,
  selectedDays,
  onFrequencyChange,
  onDaysChange,
}: FrequencySelectorProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const activeFreq = (frequency || 'daily') as Frequency;

  const handleFrequencyPress = useCallback(
    (freq: Frequency) => {
      triggerHaptic('tap');
      onFrequencyChange(freq);
      if (freq === 'weekdays') onDaysChange(WEEKDAY_INDICES);
      if (freq === 'daily') onDaysChange([0, 1, 2, 3, 4, 5, 6]);
    },
    [onFrequencyChange, onDaysChange]
  );

  return (
    <View className='mb-6'>
      <Text
        className='mb-3 text-sm font-medium'
        style={{ color: themeColors.text.secondary }}
      >
        Frequency
      </Text>

      <View className='flex-row gap-2'>
        {FREQUENCY_OPTIONS.map((freq) => {
          const active = freq === activeFreq;
          return (
            <Pressable
              key={freq}
              accessibilityRole='radio'
              accessibilityState={{ selected: active }}
              className={clsx(
                'rounded-full px-4 py-2'
              )}
              style={{
                backgroundColor: active
                  ? themeColors.status.success
                  : isDark ? themeColors.card : '#F5F5F4',
              }}
              onPress={() => handleFrequencyPress(freq)}
            >
              <Text
                className={clsx('text-sm font-medium', active && 'text-white')}
                style={
                  active ? undefined : { color: themeColors.text.secondary }
                }
              >
                {LABELS[freq]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeFreq === 'custom' ? <DayPicker
          isDark={isDark}
          selectedDays={selectedDays}
          themeColors={themeColors}
          onDaysChange={onDaysChange}
        /> : null}
    </View>
  );
}
