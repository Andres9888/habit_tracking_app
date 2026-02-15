
import React from 'react';

import type { EmojiType } from '../../QuickReflection';
import { AnimatedSection } from '../components/AnimatedSection';
import { QuickReflection } from '../../QuickReflection';

type ReflectionSectionProps = {
  localNote: string;
  localEmoji?: EmojiType;
  reduceMotion: boolean;
  visible: boolean;
  index: number;
  handleEmojiSelect: (emoji: EmojiType) => void;
  handleNoteChange: (text: string) => void;
  onReflectionSubmit: () => void;
};

export function ReflectionSection({
  localNote,
  localEmoji,
  reduceMotion,
  visible,
  index,
  handleEmojiSelect,
  handleNoteChange,
  onReflectionSubmit,
}: ReflectionSectionProps) {
  return (
    <AnimatedSection
      index={index}
      reduceMotion={reduceMotion}
      visible={visible}
    >
      <QuickReflection
        showNoteInput
        compact={false}
        note={localNote}
        reduceMotion={reduceMotion}
        sectionIndex={index}
        selectedEmoji={localEmoji}
        shouldAnimate={false}
        onEmojiSelect={handleEmojiSelect}
        onNoteChange={handleNoteChange}
        onSubmit={onReflectionSubmit}
      />
    </AnimatedSection>
  );
}
