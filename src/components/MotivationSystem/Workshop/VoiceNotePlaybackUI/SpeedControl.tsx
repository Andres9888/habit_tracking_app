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
import { useThemeColors } from '../../../../theme/ThemeContext';
import { shadows } from '../../../../theme/spacing';
import type { SpeedControlProps } from './types';
import { triggerHaptic } from '@/utils/haptics';

export function SpeedControl({
  currentSpeed,
  onSpeedChange,
}: SpeedControlProps) {
  const { colors } = useThemeColors();
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
        className='rounded-lg px-2 py-1'
        style={{ backgroundColor: colors.background }}
        onPress={toggleOpen}
      >
        <Text className='text-xs font-medium' style={{ color: colors.text.secondary }}>
          {currentSpeed}x
        </Text>
      </Pressable>

      {isOpen ? <View className='absolute bottom-full right-0 mb-1 rounded-lg p-1' style={[{ backgroundColor: colors.card }, shadows.floatingActionButton]}>
          {PLAYBACK_SPEEDS.map((speed) => (
            <Pressable
              key={speed}
              accessibilityLabel={`Set speed to ${speed}x`}
              accessibilityRole='button'
              className='rounded-md px-3 py-1.5'
              style={currentSpeed === speed ? { backgroundColor: colors.status.successLight } : undefined}
              onPress={() => handleSpeedPress(speed)}
            >
              <Text
                className='text-sm font-medium'
              style={{ color: currentSpeed === speed ? colors.status.successText : colors.text.secondary }}
              >
                {speed}x
              </Text>
            </Pressable>
          ))}
        </View> : null}
    </View>
  );
}
