/**
 * WOOPField Component
 * Individual WOOP field display with colored letter
 */

import React from 'react';
import { View, Text } from 'react-native';
import { clsx } from 'clsx';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface WOOPFieldProps {
  letter: string;
  label: string;
  value?: string;
  letterColorClass: string;
  letterColorStyle?: string;
  valueColor?: string;
  isBold?: boolean;
}

export function WOOPField({
  letter,
  label,
  value,
  letterColorClass,
  letterColorStyle,
  valueColor,
  isBold = false,
}: WOOPFieldProps) {
  const { colors } = useThemeColors();

  return (
    <View className='flex-row gap-2'>
      <Text className={clsx('w-5 font-bold', letterColorClass)} style={letterColorStyle ? { color: letterColorStyle } : undefined}>{letter}</Text>
      <Text
        className={clsx(
          'flex-1 text-xs',
          isBold && 'font-medium'
        )}
        numberOfLines={2}
        style={{ color: valueColor ?? colors.text.secondary }}
      >
        {value || `Add your ${label.toLowerCase()}...`}
      </Text>
    </View>
  );
}
