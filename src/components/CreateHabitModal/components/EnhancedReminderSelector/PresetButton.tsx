/**
 * PresetButton - Reminder preset with time label
 * Per spec: 48px height, Morning/Midday/Evening with time labels
 */

import { Animated, Pressable, Text, View } from 'react-native';
import { memo, useCallback, useRef } from 'react';

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
          backgroundColor: isSelected ? '#ECFDF5' : '#f5f5f4',
          borderColor: isSelected ? '#10B981' : 'transparent',
          borderWidth: isSelected ? 2 : 1,
          height: 48,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <View className='flex-row items-center gap-1.5'>
          <Text className='text-base'>{preset.emoji}</Text>
          <Text
            className='text-sm font-semibold'
            style={{ color: isSelected ? '#059669' : '#57534e' }}
          >
            {preset.label}
          </Text>
        </View>
        {preset.time && (
          <Text
            className='mt-0.5 text-xs'
            style={{ color: isSelected ? '#047857' : '#a8a29e' }}
          >
            {preset.time}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export const PresetButton = memo(PresetButtonComponent);
