/**
 * VizField - Individual visualization field with icon
 */

import React from 'react';
import { View, Text } from 'react-native';

import { clsx } from 'clsx';

import type { ColorClass } from './types';

interface VizFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass: ColorClass;
}

export function VizField({ label, value, icon, colorClass }: VizFieldProps) {
  return (
    <View className='flex-row items-start gap-3 py-2'>
      <View
        className={clsx(
          'mt-0.5 h-8 w-8 items-center justify-center rounded-lg',
          {
            'bg-emerald-100': colorClass === 'success',
            'bg-rose-100': colorClass === 'failure',
          }
        )}
      >
        {icon}
      </View>
      <View className='flex-1'>
        <Text
          className={clsx('text-xs font-medium', {
            'text-emerald-600': colorClass === 'success',
            'text-rose-600': colorClass === 'failure',
          })}
        >
          {label}
        </Text>
        <Text
          className={clsx('text-sm leading-5', {
            'text-emerald-800': colorClass === 'success',
            'text-rose-800': colorClass === 'failure',
          })}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
