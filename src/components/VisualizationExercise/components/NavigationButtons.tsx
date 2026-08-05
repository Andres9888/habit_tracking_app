/**
 * NavigationButtons Component
 * Back and Continue buttons for step navigation
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  canContinue: boolean;
  activeColorValue: string;
}

export function NavigationButtons({
  onBack,
  onNext,
  canContinue,
  activeColorValue,
}: NavigationButtonsProps) {
  const { colors } = useThemeColors();

  return (
    <View className='flex-row gap-3'>
      <Pressable
        accessibilityLabel='Go back'
        accessibilityRole='button'
        className='flex-1 items-center rounded-xl border py-3.5'
        style={{ borderColor: colors.border, backgroundColor: colors.card }}
        onPress={() => {
          triggerHaptic('tap');
          onBack();
        }}
      >
        <Text
          className='text-sm font-medium'
          style={{ color: colors.text.secondary }}
        >
          Back
        </Text>
      </Pressable>
      <Pressable
        accessibilityLabel='Continue'
        accessibilityRole='button'
        className='flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3.5'
        disabled={!canContinue}
        style={{
          backgroundColor: canContinue ? activeColorValue : colors.border,
        }}
        onPress={() => {
          triggerHaptic('toggle');
          onNext();
        }}
      >
        <Text
          className='text-sm font-semibold'
          style={{
            color: canContinue ? colors.text.inverse : colors.text.tertiary,
          }}
        >
          Continue
        </Text>
        <ChevronRight
          color={canContinue ? colors.text.inverse : colors.text.tertiary}
          size={iconSizes.medium}
        />
      </Pressable>
    </View>
  );
}
