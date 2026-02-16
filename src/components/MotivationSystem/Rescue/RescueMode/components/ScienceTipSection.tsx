import React from 'react';
import { View, Text } from 'react-native';

import { AnimatedContent } from './AnimatedContent';

interface ScienceTipSectionProps {
  hasStreak: boolean;
  hasWhy: boolean;
  hasVoiceNote: boolean;
  hasPreviousStreakNotes: boolean;
  reduceMotion: boolean;
  visible: boolean;
}

/**
 * ScienceTipSection - Displays research-backed motivation tip
 */
export function ScienceTipSection({
  hasStreak,
  hasWhy,
  hasVoiceNote,
  hasPreviousStreakNotes,
  reduceMotion,
  visible,
}: ScienceTipSectionProps) {
  // Calculate stagger delay index based on how many sections appear before this one
  const animationIndex =
    (hasStreak ? 1 : 0) +
    (hasWhy ? 1 : 0) +
    (hasVoiceNote ? 1 : 0) +
    (hasPreviousStreakNotes ? 1 : 0) +
    1;

  return (
    <AnimatedContent index={animationIndex} reduceMotion={reduceMotion} visible={visible}>
      <View className='mt-4 rounded-xl bg-stone-100 p-3'>
        <Text className='text-center text-xs italic text-stone-600'>
          💡 Research shows: Just 2 minutes is enough to maintain your habit.
          The hardest part is starting.
        </Text>
      </View>
    </AnimatedContent>
  );
}
