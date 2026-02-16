/**
 * TimeControls Component
 * Time display row with mute and speed controls
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Volume2, VolumeX } from 'lucide-react-native';
import { SpeedControl } from './SpeedControl';
import type { TimeControlsProps } from './types';

export function TimeControls({
  formattedPosition,
  formattedRemaining,
  displayDuration,
  isReady,
  showMuteButton,
  showSpeedControl,
  isMuted,
  currentSpeed,
  onToggleMute,
  onSpeedChange,
}: TimeControlsProps) {
  return (
    <View className='mt-2 flex-row items-center justify-between'>
      <Text className='text-xs text-stone-500 dark:text-stone-400'>
        {isReady ? formattedPosition : '0:00'}
      </Text>

      <View className='flex-row items-center gap-2'>
        {showMuteButton && isReady && (
          <Pressable
            accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}
            accessibilityRole='button'
            accessibilityHint={isMuted ? 'Enable audio' : 'Mute audio'}
            className='rounded-lg bg-stone-100 p-1.5 dark:bg-stone-700'
            onPress={onToggleMute}
          >
            {isMuted ? (
              <VolumeX className='text-stone-500 dark:text-stone-400' size={14} />
            ) : (
              <Volume2 className='text-stone-500 dark:text-stone-400' size={14} />
            )}
          </Pressable>
        )}

        {showSpeedControl && isReady && (
          <SpeedControl
            currentSpeed={currentSpeed}
            onSpeedChange={onSpeedChange}
          />
        )}
      </View>

      <Text className='text-xs text-stone-500 dark:text-stone-400'>
        {isReady ? formattedRemaining : `-${displayDuration}`}
      </Text>
    </View>
  );
}
