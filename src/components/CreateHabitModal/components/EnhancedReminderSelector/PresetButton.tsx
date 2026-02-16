/**
 * PresetButton - Reminder preset with time label
 * Per spec: 48px height, Morning/Midday/Evening with time labels
 */

import { memo, useCallback, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { PresetButtonProps } from './types';

const useButtonAnimation = (reduceMotion: boolean) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    if (reduceMotion) return;
    Animated.spring(scaleAnim, {
      friction: 10,
      tension: 300,
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, reduceMotion]);

  const handlePressOut = useCallback(() => {
    if (reduceMotion) {
      scaleAnim.setValue(1);
      return;
    }
    Animated.spring(scaleAnim, {
      friction: 15,
      tension: 150,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, reduceMotion]);

  return { handlePressIn, handlePressOut, scaleAnim };
};

function PresetButtonComponent({
  preset,
  isSelected,
  onPress,
  reduceMotion,
}: PresetButtonProps) {
  const { scaleAnim, handlePressIn, handlePressOut } =
    useButtonAnimation(reduceMotion);
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityLabel={`Set reminder for ${preset.label}${preset.time ? ` at ${preset.time}` : ''}`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      className='flex-1'
      testID={`preset-${preset.id}`}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='items-center justify-center rounded-xl px-3'
        style={{
          backgroundColor: isSelected ? colors.chip.selectedBg : colors.chip.bg,
          borderColor: isSelected ? colors.chip.selectedBorder : 'transparent',
          borderWidth: isSelected ? 2 : 1,
          height: 48,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <View className='flex-row items-center gap-1.5'>
          <Text className='text-base'>{preset.emoji}</Text>
          <Text
            className='text-sm font-semibold'
            style={{ color: isSelected ? colors.chip.selectedText : colors.text.secondary }}
          >
            {preset.label}
          </Text>
        </View>
        {preset.time && (
          <Text
            className='mt-0.5 text-xs'
            style={{ color: isSelected ? colors.chip.selectedText : colors.text.tertiary }}
          >
            {preset.time}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export const PresetButton = memo(PresetButtonComponent);
