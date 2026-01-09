import React from 'react';
import { View } from 'react-native';

import { PreviousStreakVoiceNotes } from '../../PreviousStreakVoiceNotes';
import type { RescueHabitData } from '../RescueMode.types';
import { AnimatedContent } from './AnimatedContent';
import { StreakAtRiskHeader } from './StreakAtRiskHeader';
import { FeaturedWhy } from './FeaturedWhy';
import { FeaturedVoiceNote } from './FeaturedVoiceNote';
import { FailureVizSection } from './FailureVizSection';
import { ScienceTipSection } from './ScienceTipSection';

interface RescueModeContentProps {
  habit: RescueHabitData;
  visible: boolean;
  reduceMotion: boolean;
  hasStreak: boolean;
  hasWhy: boolean;
  hasVoiceNote: boolean;
  hasPreviousStreakNotes: boolean;
  onVoiceNotePlayStart?: () => void;
  onVoiceNotePlayFinish?: () => void;
}

export function RescueModeContent({
  habit,
  visible,
  reduceMotion,
  hasStreak,
  hasWhy,
  hasVoiceNote,
  hasPreviousStreakNotes,
  onVoiceNotePlayStart,
  onVoiceNotePlayFinish,
}: RescueModeContentProps) {
  return (
    <>
      {/* Streak at Risk Header */}
      {hasStreak && (
        <AnimatedContent
          index={0}
          reduceMotion={reduceMotion}
          visible={visible}
        >
          <StreakAtRiskHeader
            hoursRemaining={habit.hoursRemaining}
            reduceMotion={reduceMotion}
            streak={habit.currentStreak!}
          />
        </AnimatedContent>
      )}

      {/* Featured Your Why */}
      {hasWhy && (
        <AnimatedContent
          index={hasStreak ? 1 : 0}
          reduceMotion={reduceMotion}
          visible={visible}
        >
          <View className='mt-4'>
            <FeaturedWhy why={habit.why!} />
          </View>
        </AnimatedContent>
      )}

      {/* Featured Day 1 Voice Note */}
      {hasVoiceNote && (
        <AnimatedContent
          index={(hasStreak ? 1 : 0) + (hasWhy ? 1 : 0)}
          reduceMotion={reduceMotion}
          visible={visible}
        >
          <View className='mt-4'>
            <FeaturedVoiceNote
              reduceMotion={reduceMotion}
              voiceNote={habit.day1VoiceNote!}
              onPlayFinish={onVoiceNotePlayFinish}
              onPlayStart={onVoiceNotePlayStart}
            />
          </View>
        </AnimatedContent>
      )}

      {/* Previous Streak Voice Notes */}
      {hasPreviousStreakNotes && (
        <AnimatedContent
          index={
            (hasStreak ? 1 : 0) + (hasWhy ? 1 : 0) + (hasVoiceNote ? 1 : 0)
          }
          reduceMotion={reduceMotion}
          visible={visible}
        >
          <View className='mt-4'>
            <PreviousStreakVoiceNotes
              bestStreak={habit.bestStreak!}
              reduceMotion={reduceMotion}
              voiceNotes={habit.previousStreakVoiceNotes!}
              onPlayFinish={onVoiceNotePlayFinish}
              onPlayStart={onVoiceNotePlayStart}
            />
          </View>
        </AnimatedContent>
      )}

      {/* Failure Visualization & Science tip */}
      <FailureVizSection
        habit={habit}
        hasPreviousStreakNotes={hasPreviousStreakNotes}
        hasStreak={hasStreak}
        hasVoiceNote={hasVoiceNote}
        hasWhy={hasWhy}
        reduceMotion={reduceMotion}
        visible={visible}
      />
      <ScienceTipSection
        hasPreviousStreakNotes={hasPreviousStreakNotes}
        hasStreak={hasStreak}
        hasVoiceNote={hasVoiceNote}
        hasWhy={hasWhy}
        reduceMotion={reduceMotion}
        visible={visible}
      />
    </>
  );
}
