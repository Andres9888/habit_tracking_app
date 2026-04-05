/**
 * PlayPauseButton Component
 * Animated play/pause toggle button for audio playback
 */

import React, { useCallback } from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SPRING_BUTTON } from '../../../animations';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { PlayPauseButtonProps } from './types';
import { triggerHaptic } from '@/utils/haptics';

export function PlayPauseButton({
  isPlaying,
  isLoading,
  isFinished,
  onPress,
  reduceMotion = false,
}: PlayPauseButtonProps) {
  const { colors } = useThemeColors();
  const scale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (!reduceMotion) {
      scale.value = withSpring(0.9, SPRING_BUTTON);
    }
  }, [reduceMotion, scale]);

  const handlePressOut = useCallback(() => {
    if (!reduceMotion) {
      scale.value = withSpring(1, SPRING_BUTTON);
    }
  }, [reduceMotion, scale]);

  const handlePress = useCallback(() => {
    triggerHaptic('tap');
    onPress();
  }, [onPress]);

  if (isLoading) {
    return (
      <View className='h-11 w-11 items-center justify-center rounded-full' style={{ backgroundColor: colors.status.successLight }}>
        <ActivityIndicator color={colors.status.success} size='small' />
      </View>
    );
  }

  return (
    <Animated.View style={buttonStyle}>
      <Pressable
        accessibilityLabel={
          isFinished ? 'Replay' : isPlaying ? 'Pause' : 'Play'
        }
        accessibilityRole='button'
        className='h-11 w-11 items-center justify-center rounded-full'
        style={{ backgroundColor: colors.status.success }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {isFinished ? (
          <RotateCcw className='text-white' size={iconSizes.medium} />
        ) : isPlaying ? (
          <Pause className='text-white' fill='white' size={iconSizes.medium} />
        ) : (
          <Play className='text-white' fill='white' size={iconSizes.medium} />
        )}
      </Pressable>
    </Animated.View>
  );
}
