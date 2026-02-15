/**
 * StepIndicator Component
 * Shows progress through the visualization exercise steps
 */

import React from 'react';
import { View } from 'react-native';

import { clsx } from 'clsx';

import type { StepIndicatorProps } from '../types';

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <View className='flex-row items-center justify-center gap-2'>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          className={clsx(
            'h-2 rounded-full transition-all',
            index < currentStep ? 'w-8 bg-violet-500' : 'w-2 bg-stone-200'
          )}
        />
      ))}
    </View>
  );
}
