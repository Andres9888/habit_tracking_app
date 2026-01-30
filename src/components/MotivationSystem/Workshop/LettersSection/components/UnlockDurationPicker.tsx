/**
 * UnlockDurationPicker Component
 * Allows user to select when the letter will unlock
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Clock, Check } from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { UNLOCK_DURATION_OPTIONS } from '../LettersSection.constants';

interface UnlockDurationPickerProps {
  selectedDays: number;
  onSelectDays: (days: number) => void;
}

export function UnlockDurationPicker({
  selectedDays,
  onSelectDays,
}: UnlockDurationPickerProps) {
  return (
    <View className='gap-2'>
      {UNLOCK_DURATION_OPTIONS.map((option) => {
        const isSelected = selectedDays === option.value;
        return (
          <Pressable
            key={option.value}
            accessibilityLabel={`Unlock in ${option.label}`}
            accessibilityRole='radio'
            accessibilityState={{ selected: isSelected }}
            className={clsx(
              'flex-row items-center justify-between rounded-xl border-2 px-4 py-3',
              isSelected
                ? 'border-violet-500 bg-violet-50'
                : 'border-stone-200 bg-white'
            )}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelectDays(option.value);
            }}
          >
            <View className='flex-row items-center gap-3'>
              <View
                className={clsx(
                  'h-8 w-8 items-center justify-center rounded-full',
                  isSelected ? 'bg-violet-500' : 'bg-stone-100'
                )}
              >
                <Clock
                  className={isSelected ? 'text-white' : 'text-stone-400'}
                  size={16}
                />
              </View>
              <View>
                <Text
                  className={clsx(
                    'font-semibold',
                    isSelected ? 'text-violet-700' : 'text-stone-700'
                  )}
                >
                  {option.label}
                </Text>
                <Text className='text-xs text-stone-500'>
                  {option.description}
                </Text>
              </View>
            </View>
            {isSelected && (
              <View className='h-6 w-6 items-center justify-center rounded-full bg-violet-500'>
                <Check className='text-white' size={14} strokeWidth={3} />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
