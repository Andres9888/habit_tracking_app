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
import * as Haptics from 'expo-haptics';
import { SPRING_BUTTON } from '../../../animations';
import type { PlayPauseButtonProps } from './types';

export function PlayPauseButton({
  isPlaying,
  isLoading,
  isFinished,
  onPress,
  reduceMotion = false,
}: PlayPauseButtonProps) {
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  if (isLoading) {
    return (
      <View 
        accessibilityLabel='Loading audio'
        className='h-10 w-10 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/40'
      >
        <ActivityIndicator color='#14b8a6' size='small' />
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
        accessibilityHint={
          isFinished ? 'Replay the voice note from the beginning' : isPlaying ? 'Pause audio playback' : 'Start audio playback'
        }
        className='h-10 w-10 items-center justify-center rounded-full bg-teal-500'
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {isFinished ? (
          <RotateCcw className='text-white' size={18} />
        ) : isPlaying ? (
          <Pause className='text-white' fill='white' size={18} />
        ) : (
          <Play className='text-white' fill='white' size={18} />
        )}
      </Pressable>
    </Animated.View>
  );
}
