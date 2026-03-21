/**
 * MainRecordButton - Primary record/pause button with pulse animation
 */
import React, { useCallback, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, withRepeat, cancelAnimation } from 'react-native-reanimated';
import { Mic, Pause, Play } from 'lucide-react-native';
import { clsx } from 'clsx';
import { SPRING_BUTTON } from '../../../../animations';
import { useThemeColors } from '../../../../../theme/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';

interface MainRecordButtonProps {
  isRecording: boolean;
  isPaused: boolean;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
}

export function MainRecordButton({ isRecording, isPaused, onStartRecording, onPauseRecording, onResumeRecording }: MainRecordButtonProps) {
  const { colors } = useThemeColors();
  const recordButtonScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  useEffect(() => {
    if (isRecording && !isPaused) {
      pulseOpacity.value = withRepeat(withTiming(0.4, { duration: 1000 }), -1, true);
    } else {
      cancelAnimation(pulseOpacity);
      pulseOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isRecording, isPaused, pulseOpacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulseOpacity.value }));
  const buttonStyle = useAnimatedStyle(() => ({ transform: [{ scale: recordButtonScale.value }] }));
  const handlePressIn = useCallback(() => { recordButtonScale.value = withSpring(0.95, SPRING_BUTTON); }, [recordButtonScale]);
  const handlePressOut = useCallback(() => { recordButtonScale.value = withSpring(1, SPRING_BUTTON); }, [recordButtonScale]);

  const handleRecordPress = useCallback(() => {
    triggerHaptic('toggle');
    if (isRecording) {
      if (isPaused) {
        onResumeRecording();
      } else {
        onPauseRecording();
      }
    } else {
      onStartRecording();
    }
  }, [isRecording, isPaused, onStartRecording, onPauseRecording, onResumeRecording]);

  const label = isRecording ? (isPaused ? 'Resume recording' : 'Pause recording') : 'Start recording';

  return (
    <View className='relative'>
      <Animated.View className='absolute inset-0 rounded-full' style={[pulseStyle, { transform: [{ scale: 1.3 }], backgroundColor: colors.status.success }]} />
      <Animated.View style={buttonStyle}>
        <Pressable
          accessibilityLabel={label}
          accessibilityRole='button'
          className='h-16 w-16 items-center justify-center rounded-full'
          style={{ backgroundColor: colors.status.success }}
          onPress={handleRecordPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {isRecording ? (isPaused ? <Play className='text-white' fill='white' size={28} /> : <Pause className='text-white' fill='white' size={28} />) : <Mic className='text-white' size={28} />}
        </Pressable>
      </Animated.View>
    </View>
  );
}
