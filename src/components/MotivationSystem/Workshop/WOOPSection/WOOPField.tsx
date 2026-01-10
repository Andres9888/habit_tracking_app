/**
 * WOOPField Component
 * Individual WOOP field display with colored letter
 */

import React from 'react';
import { View, Text } from 'react-native';
import { clsx } from 'clsx';

interface WOOPFieldProps {
  letter: string;
  label: string;
  value?: string;
  letterColorClass: string;
  valueColorClass?: string;
  isBold?: boolean;
}

export function WOOPField({
  letter,
  label,
  value,
  letterColorClass,
  valueColorClass = 'text-stone-600',
  isBold = false,
}: WOOPFieldProps) {
  return (
    <View className='flex-row gap-2'>
      <Text className={clsx('w-5 font-bold', letterColorClass)}>{letter}</Text>
      <Text
        className={clsx(
          'flex-1 text-xs',
          valueColorClass,
          isBold && 'font-medium'
        )}
        numberOfLines={2}
      >
        {value || `Add your ${label.toLowerCase()}...`}
      </Text>
    </View>
  );
}
