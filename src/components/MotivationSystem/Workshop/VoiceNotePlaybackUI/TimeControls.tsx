/**
 * TimeControls Component
 * Time display row with mute and speed controls
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Volume2, VolumeX } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
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
  const { colors } = useThemeColors();

  return (
    <View className='mt-2 flex-row items-center justify-between'>
      <Text className='text-xs' style={{ color: colors.text.secondary }}>
        {isReady ? formattedPosition : '0:00'}
      </Text>

      <View className='flex-row items-center gap-2'>
        {showMuteButton && isReady ? <Pressable
            accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}
            accessibilityRole='button'
            className='rounded-lg p-1.5'
            style={{ backgroundColor: colors.background }}
            onPress={onToggleMute}
          >
            {isMuted ? (
              <VolumeX color={colors.text.secondary} size={14} />
            ) : (
              <Volume2 color={colors.text.secondary} size={14} />
            )}
          </Pressable> : null}

        {showSpeedControl && isReady ? <SpeedControl
            currentSpeed={currentSpeed}
            onSpeedChange={onSpeedChange}
          /> : null}
      </View>

      <Text className='text-xs' style={{ color: colors.text.secondary }}>
        {isReady ? formattedRemaining : `-${displayDuration}`}
      </Text>
    </View>
  );
}
