/**
 * StepIndicator Component
 * Shows progress through the visualization exercise steps
 */

import React from 'react';
import { View } from 'react-native';
import { clsx } from 'clsx';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { StepIndicatorProps } from '../types';

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const { colors } = useThemeColors();

  return (
    <View className='flex-row items-center justify-center gap-2'>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          className={clsx(
            'h-2 rounded-full transition-all',
            index < currentStep ? 'w-8' : 'w-2'
          )}
          style={{ backgroundColor: index < currentStep ? colors.status.premium : colors.border }}
        />
      ))}
    </View>
  );
}
