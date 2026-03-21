/**
 * VizField - Individual visualization field with icon
 */

import React from 'react';
import { View, Text } from 'react-native';

import { useThemeColors } from '../../../../theme/ThemeContext';
import type { ColorClass } from './types';

interface VizFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass: ColorClass;
}

export function VizField({ label, value, icon, colorClass }: VizFieldProps) {
  const { colors } = useThemeColors();
  const isSuccess = colorClass === 'success';

  return (
    <View className='flex-row items-start gap-3 py-2'>
      <View
        className='mt-0.5 h-8 w-8 items-center justify-center rounded-lg'
        style={{ backgroundColor: isSuccess ? colors.status.successLight : colors.status.errorLight }}
      >
        {icon}
      </View>
      <View className='flex-1'>
        <Text
          className='text-xs font-medium'
          style={{ color: isSuccess ? colors.status.success : colors.status.error }}
        >
          {label}
        </Text>
        <Text
          className='text-sm leading-5'
          style={{ color: isSuccess ? colors.status.successText : colors.status.errorText }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
