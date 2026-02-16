/**
 * SpeedControl Component
 * Playback speed selector dropdown for audio playback
 */

import React, { useCallback, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import {
  PlaybackSpeed,
  PLAYBACK_SPEEDS,
} from '../../../../hooks/useAudioPlayback';
import type { SpeedControlProps } from './types';

export function SpeedControl({
  currentSpeed,
  onSpeedChange,
}: SpeedControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSpeedPress = useCallback(
    (speed: PlaybackSpeed) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSpeedChange(speed);
      setIsOpen(false);
    },
    [onSpeedChange]
  );

  const toggleOpen = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <View className='relative'>
      <Pressable
        accessibilityLabel={`Playback speed: ${currentSpeed}x`}
        accessibilityRole='button'
        accessibilityHint='Change playback speed'
        className='rounded-lg bg-stone-100 px-2 py-1 dark:bg-stone-700'
        onPress={toggleOpen}
      >
        <Text className='text-xs font-medium text-stone-600 dark:text-stone-300'>
          {currentSpeed}x
        </Text>
      </Pressable>

      {isOpen && (
        <View className='absolute bottom-full right-0 mb-1 rounded-lg bg-white p-1 shadow-lg dark:bg-stone-800'>
          {PLAYBACK_SPEEDS.map((speed) => (
            <Pressable
              key={speed}
              accessibilityLabel={`Set speed to ${speed}x`}
              accessibilityRole='button'
              className={clsx(
                'rounded-md px-3 py-1.5',
                currentSpeed === speed ? 'bg-teal-100 dark:bg-teal-900/40' : ''
              )}
              onPress={() => handleSpeedPress(speed)}
            >
              <Text
                className={clsx(
                  'text-sm font-medium',
                  currentSpeed === speed ? 'text-teal-700 dark:text-teal-300' : 'text-stone-600 dark:text-stone-300'
                )}
              >
                {speed}x
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
