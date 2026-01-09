/**
 * NavigationButtons Component
 * Back and Continue buttons for step navigation
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { clsx } from 'clsx';

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  canContinue: boolean;
  activeColor: string;
  activeHoverColor: string;
}

export function NavigationButtons({
  onBack,
  onNext,
  canContinue,
  activeColor,
  activeHoverColor,
}: NavigationButtonsProps) {
  return (
    <View className='flex-row gap-3'>
      <Pressable
        accessibilityLabel='Go back'
        accessibilityRole='button'
        className='flex-1 items-center rounded-xl border border-stone-200 bg-white py-3.5 active:bg-stone-50'
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onBack();
        }}
      >
        <Text className='text-sm font-medium text-stone-600'>Back</Text>
      </Pressable>
      <Pressable
        accessibilityLabel='Continue'
        accessibilityRole='button'
        className={clsx(
          'flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3.5',
          canContinue
            ? `${activeColor} active:${activeHoverColor}`
            : 'bg-stone-200'
        )}
        disabled={!canContinue}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onNext();
        }}
      >
        <Text
          className={clsx(
            'text-sm font-semibold',
            canContinue ? 'text-white' : 'text-stone-400'
          )}
        >
          Continue
        </Text>
        <ChevronRight
          className={canContinue ? 'text-white' : 'text-stone-400'}
          size={18}
        />
      </Pressable>
    </View>
  );
}
