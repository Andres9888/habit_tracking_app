/**
 * FrequencyPicker Component
 *
 * Allows users to select habit frequency:
 * - Daily: Every day
 * - Weekdays Only: Monday-Friday
 * - Custom Days: Pick specific days of the week
 * - X times per week: Flexible weekly target
 */

import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors } from '../../../theme/colors';

export type FrequencyType = 'daily' | 'weekdays' | 'custom_days' | 'x_times_per_week';

interface FrequencyPickerProps {
  value: FrequencyType;
  frequencyCount?: number;
  customDays?: number[];
  onChange: (frequency: FrequencyType, count?: number, days?: number[]) => void;
}

const DAYS = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

const WEEKDAY_NUMBERS = [1, 2, 3, 4, 5]; // Mon-Fri

const FREQUENCY_OPTIONS: Array<{ type: FrequencyType; label: string; description: string }> = [
  {
    type: 'daily',
    label: 'Daily',
    description: 'Every day',
  },
  {
    type: 'weekdays',
    label: 'Weekdays Only',
    description: 'Monday to Friday',
  },
  {
    type: 'custom_days',
    label: 'Custom Days',
    description: 'Pick specific days',
  },
  {
    type: 'x_times_per_week',
    label: 'X Times Per Week',
    description: 'Flexible weekly target',
  },
];

export function FrequencyPicker({
  value,
  frequencyCount = 3,
  customDays = [],
  onChange,
}: FrequencyPickerProps) {
  const [selectedDays, setSelectedDays] = useState<number[]>(
    customDays.length > 0 ? customDays : WEEKDAY_NUMBERS
  );

  const handleFrequencyChange = (type: FrequencyType) => {
    if (type === 'custom_days') {
      onChange(type, undefined, selectedDays);
    } else if (type === 'x_times_per_week') {
      onChange(type, frequencyCount);
    } else {
      onChange(type);
    }
  };

  const toggleDay = (dayValue: number) => {
    const newDays = selectedDays.includes(dayValue)
      ? selectedDays.filter(d => d !== dayValue)
      : [...selectedDays, dayValue].sort();
    setSelectedDays(newDays);
    if (value === 'custom_days') {
      onChange('custom_days', undefined, newDays);
    }
  };

  const adjustCount = (delta: number) => {
    const newCount = Math.max(1, Math.min(7, frequencyCount + delta));
    onChange('x_times_per_week', newCount);
  };

  return (
    <Animated.View entering={FadeInUp.springify().damping(18)}>
      <Text className='mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500'>
        Frequency
      </Text>

      <View className='px-4 space-y-2'>
        {FREQUENCY_OPTIONS.map((option, index) => (
          <Animated.View
            key={option.type}
            entering={FadeInUp.delay(index * 60).springify().damping(18)}
          >
            <Pressable
              onPress={() => handleFrequencyChange(option.type)}
              className={`flex-row items-center justify-between rounded-xl border-2 p-4 ${
                value === option.type
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <View className='flex-1'>
                <Text
                  className={`text-base font-semibold ${
                    value === option.type ? 'text-emerald-900' : 'text-gray-900'
                  }`}
                >
                  {option.label}
                </Text>
                <Text
                  className={`text-sm ${
                    value === option.type ? 'text-emerald-700' : 'text-gray-500'
                  }`}
                >
                  {option.description}
                </Text>
              </View>

              <View
                className={`h-6 w-6 rounded-full border-2 ${
                  value === option.type
                    ? 'border-emerald-600 bg-emerald-600'
                    : 'border-gray-300'
                }`}
              >
                {value === option.type && (
                  <View className='flex-1 items-center justify-center'>
                    <Text className='text-xs font-bold text-white'>✓</Text>
                  </View>
                )}
              </View>
            </Pressable>

            {/* Show day picker for custom_days */}
            {option.type === 'custom_days' && value === 'custom_days' && (
              <Animated.View
                entering={FadeInUp.delay(100).springify().damping(18)}
                className='mt-3 rounded-xl bg-gray-50 p-4'
              >
                <Text className='mb-3 text-sm font-medium text-gray-700'>
                  Select days:
                </Text>
                <View className='flex-row flex-wrap gap-2'>
                  {DAYS.map(day => (
                    <Pressable
                      key={day.value}
                      onPress={() => toggleDay(day.value)}
                      className={`h-12 flex-1 items-center justify-center rounded-lg ${
                        selectedDays.includes(day.value)
                          ? 'bg-emerald-600'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          selectedDays.includes(day.value)
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        {day.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Animated.View>
            )}

            {/* Show count selector for x_times_per_week */}
            {option.type === 'x_times_per_week' && value === 'x_times_per_week' && (
              <Animated.View
                entering={FadeInUp.delay(100).springify().damping(18)}
                className='mt-3 rounded-xl bg-gray-50 p-4'
              >
                <Text className='mb-3 text-sm font-medium text-gray-700'>
                  Target per week:
                </Text>
                <View className='flex-row items-center justify-center space-x-6'>
                  <Pressable
                    onPress={() => adjustCount(-1)}
                    className='h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200'
                  >
                    <Text className='text-2xl font-light text-gray-600'>−</Text>
                  </Pressable>

                  <View className='h-16 w-16 items-center justify-center rounded-full bg-emerald-600'>
                    <Text className='text-3xl font-bold text-white'>
                      {frequencyCount}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => adjustCount(1)}
                    className='h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200'
                  >
                    <Text className='text-2xl font-light text-gray-600'>+</Text>
                  </Pressable>
                </View>
                <Text className='mt-2 text-center text-sm text-gray-500'>
                  {frequencyCount} {frequencyCount === 1 ? 'time' : 'times'} per week
                </Text>
              </Animated.View>
            )}
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
}
