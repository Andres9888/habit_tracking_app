/**
 * StreakVoiceNoteCard component
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { VoiceNotePlaybackUI } from '../../Workshop/VoiceNotePlaybackUI';
import { SPRING_BUTTON, formatDaysAgoText } from './constants';
import { CardHeader } from './CardHeader';
import type { StreakVoiceNoteCardProps } from './types';
import { triggerHaptic } from '@/utils/haptics';

export function StreakVoiceNoteCard({
  voiceNote,
  bestStreak,
  isExpanded,
  onToggleExpand,
  onPlayStart,
  onPlayFinish,
  reduceMotion = false,
}: StreakVoiceNoteCardProps) {
  const { colors } = useThemeColors();
  const scale = useSharedValue(1);
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, SPRING_BUTTON);
  }, [scale]);
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);
  const handlePress = useCallback(() => {
    triggerHaptic('tap');
    onToggleExpand();
  }, [onToggleExpand]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const daysAgoText = formatDaysAgoText(voiceNote.daysAgo);

  return (
    <Animated.View
      className='mb-3 overflow-hidden rounded-xl border'
      style={[animatedStyle, { borderColor: colors.status.warning }]}
    >
      <LinearGradient
        className='absolute inset-0'
        colors={['#fffbeb', '#ffedd5']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      />
      <Pressable
        accessibilityLabel={`Voice note from day ${voiceNote.streakAtRecording}, recorded ${daysAgoText}`}
        accessibilityRole='button'
        className='flex-row items-center justify-between p-3'
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <CardHeader
          bestStreak={bestStreak}
          daysAgoText={daysAgoText}
          isExpanded={isExpanded}
          streakAtRecording={voiceNote.streakAtRecording}
        />
      </Pressable>

      {isExpanded ? <View className='border-t p-3' style={{ borderColor: colors.status.warning }}>
          <VoiceNotePlaybackUI
            audioUri={voiceNote.audioUrl}
            initialDuration={voiceNote.duration}
            label={voiceNote.label}
            reduceMotion={reduceMotion}
            showSpeedControl={false}
            onPlayFinish={onPlayFinish}
            onPlayStart={onPlayStart}
          />
          {voiceNote.label ? <Text className='mt-2 text-xs italic' style={{ color: colors.status.warning }}>
              "{voiceNote.label}"
            </Text> : null}
        </View> : null}
    </Animated.View>
  );
}
