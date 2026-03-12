/**
 * SpeedControl Component
 * Playback speed selector dropdown for audio playback
 */

import React, { useCallback, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { clsx } from 'clsx';
import {
  PlaybackSpeed,
  PLAYBACK_SPEEDS,
} from '../../../../hooks/useAudioPlayback';
import type { SpeedControlProps } from './types';
import { triggerHaptic } from '@/utils/haptics';

export function SpeedControl({
  currentSpeed,
  onSpeedChange,
}: SpeedControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSpeedPress = useCallback(
    (speed: PlaybackSpeed) => {
      triggerHaptic('tap');
      onSpeedChange(speed);
      setIsOpen(false);
    },
    [onSpeedChange]
  );

  const toggleOpen = useCallback(() => {
    triggerHaptic('tap');
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <View className='relative'>
      <Pressable
        accessibilityLabel={`Playback speed: ${currentSpeed}x`}
        accessibilityRole='button'
        className='rounded-lg bg-stone-100 px-2 py-1'
        onPress={toggleOpen}
      >
        <Text className='text-xs font-medium text-stone-600'>
          {currentSpeed}x
        </Text>
      </Pressable>

      {isOpen ? <View className='absolute bottom-full right-0 mb-1 rounded-lg bg-white p-1 shadow-lg'>
          {PLAYBACK_SPEEDS.map((speed) => (
            <Pressable
              key={speed}
              accessibilityLabel={`Set speed to ${speed}x`}
              accessibilityRole='button'
              className={clsx(
                'rounded-md px-3 py-1.5',
                currentSpeed === speed ? 'bg-teal-100' : ''
              )}
              onPress={() => handleSpeedPress(speed)}
            >
              <Text
                className={clsx(
                  'text-sm font-medium',
                  currentSpeed === speed ? 'text-teal-700' : 'text-stone-600'
                )}
              >
                {speed}x
              </Text>
            </Pressable>
          ))}
        </View> : null}
    </View>
  );
}
