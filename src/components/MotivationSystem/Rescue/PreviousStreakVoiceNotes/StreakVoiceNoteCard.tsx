/**
 * StreakVoiceNoteCard component
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';

import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import type { StreakVoiceNoteCardProps } from './types';
import { CardHeader } from './CardHeader';
import { SPRING_BUTTON, formatDaysAgoText } from './constants';
import { VoiceNotePlaybackUI } from '../../Workshop/VoiceNotePlaybackUI';

export function StreakVoiceNoteCard({
  voiceNote,
  bestStreak,
  isExpanded,
  onToggleExpand,
  onPlayStart,
  onPlayFinish,
  reduceMotion = false,
}: StreakVoiceNoteCardProps) {
  const scale = useSharedValue(1);
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, SPRING_BUTTON);
  }, [scale]);
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleExpand();
  }, [onToggleExpand]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const daysAgoText = formatDaysAgoText(voiceNote.daysAgo);

  return (
    <Animated.View
      className='mb-3 overflow-hidden rounded-xl border border-amber-200'
      style={animatedStyle}
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

      {isExpanded && (
        <View className='border-t border-amber-200 p-3'>
          <VoiceNotePlaybackUI
            audioUri={voiceNote.audioUrl}
            initialDuration={voiceNote.duration}
            label={voiceNote.label}
            reduceMotion={reduceMotion}
            showSpeedControl={false}
            onPlayFinish={onPlayFinish}
            onPlayStart={onPlayStart}
          />
          {voiceNote.label && (
            <Text className='mt-2 text-xs italic text-amber-600'>
              "{voiceNote.label}"
            </Text>
          )}
        </View>
      )}
    </Animated.View>
  );
}
