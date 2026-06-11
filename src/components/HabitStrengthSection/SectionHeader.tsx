/** SectionHeader - "Habit Strength" title row with the time-range toggle. */
import React from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography } from '../../theme/typography';
import { TimeRangeToggle } from './TimeRangeToggle';
import type { TimeRange } from './types';

interface SectionHeaderProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function SectionHeader({ value, onChange }: SectionHeaderProps) {
  const { colors: themeColors } = useThemeColors();
  return (
    <View className='mb-4 flex-row items-center justify-between'>
      <Text style={{ ...typography.heading3, color: themeColors.text.primary }}>
        Habit Strength
      </Text>
      <TimeRangeToggle value={value} onChange={onChange} />
    </View>
  );
}
