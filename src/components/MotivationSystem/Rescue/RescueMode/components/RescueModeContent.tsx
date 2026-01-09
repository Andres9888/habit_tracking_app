import React from 'react';
import { View } from 'react-native';

import { PreviousStreakVoiceNotes } from '../../PreviousStreakVoiceNotes';
import { AnimatedContent } from './AnimatedContent';
import { StreakAtRiskHeader } from './StreakAtRiskHeader';
import { FeaturedWhy } from './FeaturedWhy';
import { FeaturedVoiceNote } from './FeaturedVoiceNote';
import { FailureVizSection } from './FailureVizSection';
import { ScienceTipSection } from './ScienceTipSection';
import { getAnimationIndex } from './useAnimationIndex';
import type { RescueModeContentProps } from './RescueModeContent.types';

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
  const flags = { hasPreviousStreakNotes, hasStreak, hasVoiceNote, hasWhy };

  return (
    <>
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
      {hasWhy && (
        <AnimatedContent
          index={getAnimationIndex(flags, ['streak'])}
          reduceMotion={reduceMotion}
          visible={visible}
        >
          <View className='mt-4'>
            <FeaturedWhy why={habit.why!} />
          </View>
        </AnimatedContent>
      )}
      {hasVoiceNote && (
        <AnimatedContent
          index={getAnimationIndex(flags, ['streak', 'why'])}
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
      {hasPreviousStreakNotes && (
        <AnimatedContent
          index={getAnimationIndex(flags, ['streak', 'why', 'voiceNote'])}
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
