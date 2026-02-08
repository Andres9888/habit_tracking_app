import React from 'react';

import { FailureVizSection } from './FailureVizSection';
import { ScienceTipSection } from './ScienceTipSection';
import type { RescueModeContentProps } from './RescueModeContent.types';
import { getContentFlags } from './RescueModeContent.helpers';
import {
  StreakSection,
  WhySection,
  VoiceNoteSection,
  PreviousStreakSection,
} from './sections';

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
  const flags = getContentFlags({
    habit,
    hasPreviousStreakNotes,
    hasStreak,
    hasVoiceNote,
    hasWhy,
    onVoiceNotePlayFinish,
    onVoiceNotePlayStart,
    reduceMotion,
    visible,
  });

  return (
    <>
      {hasStreak && (
        <StreakSection
          habit={habit}
          reduceMotion={reduceMotion}
          visible={visible}
        />
      )}
      {hasWhy && (
        <WhySection
          flags={flags}
          reduceMotion={reduceMotion}
          visible={visible}
          why={habit.why!}
        />
      )}
      {hasVoiceNote && (
        <VoiceNoteSection
          flags={flags}
          reduceMotion={reduceMotion}
          visible={visible}
          voiceNote={habit.day1VoiceNote!}
          onVoiceNotePlayFinish={onVoiceNotePlayFinish ?? (() => {})}
          onVoiceNotePlayStart={onVoiceNotePlayStart ?? (() => {})}
        />
      )}
      {hasPreviousStreakNotes && (
        <PreviousStreakSection
          bestStreak={habit.bestStreak!}
          flags={flags}
          reduceMotion={reduceMotion}
          visible={visible}
          voiceNotes={habit.previousStreakVoiceNotes!}
          onVoiceNotePlayFinish={onVoiceNotePlayFinish ?? (() => {})}
          onVoiceNotePlayStart={onVoiceNotePlayStart ?? (() => {})}
        />
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
