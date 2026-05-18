/**
 * AlgorithmModeChip — surfaces the active strength algorithm mode
 * (Forgiving / Balanced / Strict) and its target day count.
 *
 * Tapping the chip shows an explanation alert. Full override UI lives
 * on the Edit Habit screen.
 */

import React, { useCallback } from 'react';
import { Alert, Pressable, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { getAlgorithmDisplay } from './getAlgorithmDisplay';

interface Props {
  habitMode?: string | null;
}

export function AlgorithmModeChip({ habitMode }: Props) {
  const { colors } = useThemeColors();
  const display = getAlgorithmDisplay(habitMode);

  const onPress = useCallback(() => {
    Alert.alert(`${display.label} · ${display.daysToFormed}-day curve`, display.description);
  }, [display]);

  return (
    <Pressable
      accessibilityHint='Shows how the strength curve for this habit is calibrated'
      accessibilityLabel={`Algorithm mode ${display.label}, ${display.daysToFormed} days to formed`}
      accessibilityRole='button'
      className='flex-row items-center self-start rounded-full px-2.5 py-1'
      hitSlop={6}
      style={{ backgroundColor: colors.gray[100] }}
      onPress={onPress}
    >
      <Text className='text-xs font-semibold' style={{ color: colors.text.secondary }}>
        {display.label} · {display.daysToFormed}d
      </Text>
      <Text className='ml-1 text-xs' style={{ color: colors.text.tertiary }}>
        ⓘ
      </Text>
    </Pressable>
  );
}
