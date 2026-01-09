/**
 * CreateButton Component
 * The gradient button for creating a habit
 */

import React from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';
import STRINGS from '../../../../constants/strings';

interface CreateButtonProps {
  disabled: boolean;
  gradientColors: readonly [string, string];
  colorOpacity: Animated.Value;
  scale: Animated.Value;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

export function CreateButton({
  disabled,
  gradientColors,
  colorOpacity,
  scale,
  onPress,
  onPressIn,
  onPressOut,
}: CreateButtonProps) {
  return (
    <View className='rounded-2xl bg-white/95 p-2 shadow-lg shadow-stone-300/40'>
      <Animated.View style={{ opacity: colorOpacity, transform: [{ scale }] }}>
        <Pressable
          accessibilityHint={
            disabled
              ? 'Enter a habit name to enable'
              : 'Tap to create your new habit'
          }
          accessibilityLabel={
            disabled
              ? 'Create habit, disabled. Enter at least 2 characters.'
              : STRINGS.CREATE_HABIT.createAction
          }
          accessibilityRole='button'
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <LinearGradient
            className='flex-row items-center justify-center rounded-xl py-3.5'
            colors={gradientColors}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
          >
            <Check color='#ffffff' size={18} strokeWidth={2.5} />
            <Text className='ml-2 text-[15px] font-semibold text-white'>
              {STRINGS.CREATE_HABIT.createAction}
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}
