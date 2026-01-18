/**
 * PresetButton - Individual preset button with animation
 */

import { memo, useCallback, useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';
import type { PresetButtonProps } from './types';

function PresetButtonComponent({
  preset,
  isSelected,
  onPress,
  reduceMotion,
}: PresetButtonProps) {
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

  return (
    <Pressable
      accessibilityLabel={`Set reminder for ${preset.label}`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      className='flex-1'
      testID={`preset-${preset.id}`}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='items-center justify-center rounded-2xl px-3 py-3.5'
        style={[
          {
            backgroundColor: isSelected ? '#ECFDF5' : '#f5f5f4',
            borderColor: isSelected ? '#10B981' : 'transparent',
            borderWidth: isSelected ? 2 : 1,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text className='mb-1 text-lg'>{preset.emoji}</Text>
        <Text
          className='text-sm font-medium'
          style={{ color: isSelected ? '#059669' : '#57534e' }}
        >
          {preset.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export const PresetButton = memo(PresetButtonComponent);
