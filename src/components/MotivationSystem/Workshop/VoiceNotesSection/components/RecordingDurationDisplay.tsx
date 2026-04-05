/**
 * RecordingDurationDisplay Component
 * Shows duration with max-duration warnings
 */

import React from 'react';
import { View, Text } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { clsx } from 'clsx';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface RecordingDurationDisplayProps {
  formattedDuration: string;
  isMaxDurationReached: boolean;
  isApproachingMaxDuration: boolean;
  secondsUntilMaxDuration: number | null;
}

export function RecordingDurationDisplay({
  formattedDuration,
  isMaxDurationReached,
  isApproachingMaxDuration,
  secondsUntilMaxDuration,
}: RecordingDurationDisplayProps) {
  const { colors } = useThemeColors();

  return (
    <View className='items-center gap-1'>
      <View className='flex-row items-center gap-2'>
        <Text
          className='text-2xl font-bold'
          style={{ color: isMaxDurationReached ? colors.status.error : isApproachingMaxDuration ? colors.status.warning : colors.text.primary }}
        >
          {formattedDuration}
        </Text>
        {isMaxDurationReached ? <Text className='text-xs' style={{ color: colors.status.error }}>Max reached</Text> : null}
      </View>
      {isApproachingMaxDuration && !isMaxDurationReached ? <View className='flex-row items-center gap-1.5 rounded-full px-3 py-1' style={{ backgroundColor: colors.status.warningLight }}>
          <AlertCircle color={colors.status.warning} size={iconSizes.small} />
          <Text className='text-xs font-medium' style={{ color: colors.status.warningText }}>
            {secondsUntilMaxDuration !== null && secondsUntilMaxDuration > 0
              ? `${secondsUntilMaxDuration}s remaining`
              : 'Wrapping up...'}
          </Text>
        </View> : null}
    </View>
  );
}
