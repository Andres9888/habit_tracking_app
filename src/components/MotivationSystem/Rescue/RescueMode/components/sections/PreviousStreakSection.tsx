import React from 'react';
import { View } from 'react-native';
import type { VoiceNote } from '../../../../../../types';
import { PreviousStreakVoiceNotes } from '../../../PreviousStreakVoiceNotes';
import { AnimatedContent } from '../AnimatedContent';
import { getAnimationIndex } from '../useAnimationIndex';
import type { ContentFlags } from '../RescueModeContent.helpers';

type PreviousStreakSectionProps = {
  bestStreak: number;
  voiceNotes: VoiceNote[];
  visible: boolean;
  reduceMotion: boolean;
  flags: ContentFlags;
  onVoiceNotePlayStart: () => void;
  onVoiceNotePlayFinish: () => void;
};

export function PreviousStreakSection({
  bestStreak,
  voiceNotes,
  visible,
  reduceMotion,
  flags,
  onVoiceNotePlayStart,
  onVoiceNotePlayFinish,
}: PreviousStreakSectionProps) {
  return (
    <AnimatedContent
      index={getAnimationIndex(flags, ['streak', 'why', 'voiceNote'])}
      reduceMotion={reduceMotion}
      visible={visible}
    >
      <View className='mt-4'>
        <PreviousStreakVoiceNotes
          bestStreak={bestStreak}
          reduceMotion={reduceMotion}
          voiceNotes={voiceNotes}
          onPlayFinish={onVoiceNotePlayFinish}
          onPlayStart={onVoiceNotePlayStart}
        />
      </View>
    </AnimatedContent>
  );
}
