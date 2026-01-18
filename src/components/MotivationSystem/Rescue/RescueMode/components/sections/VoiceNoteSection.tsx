import React from 'react';
import { View } from 'react-native';
import type { VoiceNote } from '../../../../../../types';
import { AnimatedContent } from '../AnimatedContent';
import { FeaturedVoiceNote } from '../FeaturedVoiceNote';
import { getAnimationIndex } from '../useAnimationIndex';
import type { ContentFlags } from '../RescueModeContent.helpers';

type VoiceNoteSectionProps = {
  voiceNote: VoiceNote;
  visible: boolean;
  reduceMotion: boolean;
  flags: ContentFlags;
  onVoiceNotePlayStart: () => void;
  onVoiceNotePlayFinish: () => void;
};

export function VoiceNoteSection({
  voiceNote,
  visible,
  reduceMotion,
  flags,
  onVoiceNotePlayStart,
  onVoiceNotePlayFinish,
}: VoiceNoteSectionProps) {
  return (
    <AnimatedContent
      index={getAnimationIndex(flags, ['streak', 'why'])}
      reduceMotion={reduceMotion}
      visible={visible}
    >
      <View className='mt-4'>
        <FeaturedVoiceNote
          reduceMotion={reduceMotion}
          voiceNote={voiceNote}
          onPlayFinish={onVoiceNotePlayFinish}
          onPlayStart={onVoiceNotePlayStart}
        />
      </View>
    </AnimatedContent>
  );
}
