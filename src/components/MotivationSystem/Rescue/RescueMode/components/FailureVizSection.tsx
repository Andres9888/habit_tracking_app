import React from 'react';
import { View } from 'react-native';

import { FailureViz } from '../../FailureViz';
import type { RescueHabitData } from '../RescueMode.types';
import { AnimatedContent } from './AnimatedContent';

interface FailureVizSectionProps {
  habit: RescueHabitData;
  hasStreak: boolean;
  hasWhy: boolean;
  hasVoiceNote: boolean;
  hasPreviousStreakNotes: boolean;
  reduceMotion: boolean;
  visible: boolean;
}

/**
 * FailureVizSection - ALWAYS shown in Rescue Mode
 * Huberman protocol: Show failure visualization when user is unmotivated
 */
export function FailureVizSection({
  habit,
  hasStreak,
  hasWhy,
  hasVoiceNote,
  hasPreviousStreakNotes,
  reduceMotion,
  visible,
}: FailureVizSectionProps) {
  const idx =
    (hasStreak ? 1 : 0) +
    (hasWhy ? 1 : 0) +
    (hasVoiceNote ? 1 : 0) +
    (hasPreviousStreakNotes ? 1 : 0);

  return (
    <AnimatedContent index={idx} reduceMotion={reduceMotion} visible={visible}>
      <View className='mt-4'>
        <FailureViz
          reduceMotion={reduceMotion}
          streakCount={habit.currentStreak}
          visualization={{
            failureBody: habit.vizFailureBody,
            failureEmotion: habit.vizFailureEmotion,
            failureMind: habit.vizFailureMind,
          }}
        />
      </View>
    </AnimatedContent>
  );
}
