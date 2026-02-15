/**
 * DaySelector Component
 * 7-day selector for weekly frequency scheduling
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

import * as Haptics from 'expo-haptics';
import { clsx } from 'clsx';

import type { DaySelectorProps } from './types';
import { DAY_NAMES } from './constants';

export function DaySelector({ selectedDays, onToggleDay }: DaySelectorProps) {
  return (
    <View className='flex-row justify-between gap-1'>
      {DAY_NAMES.map((name, index) => {
        const isSelected = selectedDays.includes(index);
        return (
          <Pressable
            key={index}
            accessibilityHint={`Toggle ${name.toLowerCase()} in your weekly schedule`}
            accessibilityLabel={`${name}${isSelected ? ' selected' : ''}`}
            accessibilityRole='checkbox'
            accessibilityState={{ checked: isSelected }}
            className={clsx(
              'h-10 w-10 items-center justify-center rounded-full',
              isSelected ? 'bg-amber-500' : 'bg-stone-100'
            )}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onToggleDay(index);
            }}
          >
            <Text
              className={clsx(
                'text-xs font-semibold',
                isSelected ? 'text-white' : 'text-stone-600'
              )}
            >
              {name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default DaySelector;
