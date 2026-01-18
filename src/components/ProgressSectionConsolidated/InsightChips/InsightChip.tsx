/**
 * InsightChip Component
 *
 * Individual insight chip with entrance and pulse animations
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

import { useInsightChipAnimations } from './useInsightChipAnimations';
import { BORDER_COLOR_MAP } from './constants';
import type { InsightChipProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const InsightChip = React.memo(function InsightChip({
  chip,
  index,
  reduceMotion,
  onHapticFeedback,
}: InsightChipProps) {
  const { containerStyle, pulseRingStyle, handlePressIn, handlePressOut } =
    useInsightChipAnimations({
      hasPulse: !!chip.hasPulse,
      index,
      reduceMotion,
    });

  const handlePress = () => {
    onHapticFeedback();
    chip.onPress?.();
  };

  const borderColor = BORDER_COLOR_MAP[chip.borderColor] || '#e7e5e4';
  const accessibilityLabel = `${chip.label}: ${chip.value}${chip.hasPulse ? ', active streak' : ''}`;
  const accessibilityHint = chip.isInteractive
    ? 'Double tap to view details'
    : undefined;

  return (
    <AnimatedPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={chip.isInteractive ? 'button' : 'text'}
      disabled={!chip.isInteractive}
      style={containerStyle}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View
        className='relative rounded-xl bg-white px-3 py-2.5'
        style={{ borderColor, borderWidth: 1, minHeight: 56, minWidth: 90 }}
      >
        {chip.hasPulse && (
          <Animated.View
            className='absolute -inset-0.5 rounded-xl'
            pointerEvents='none'
            style={[{ borderColor: '#fb923c', borderWidth: 2 }, pulseRingStyle]}
          />
        )}

        <View className='flex-row items-center gap-2'>
          <Text className='text-lg'>{chip.icon}</Text>
          <View>
            <Text className='text-base font-bold text-stone-800'>
              {chip.value}
            </Text>
            <Text className='text-[10px] text-stone-500'>{chip.label}</Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
});
