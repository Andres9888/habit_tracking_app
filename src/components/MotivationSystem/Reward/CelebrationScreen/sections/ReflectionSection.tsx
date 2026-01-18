import React from 'react';
import { QuickReflection } from '../../QuickReflection';
import { AnimatedSection } from '../components/AnimatedSection';

type ReflectionSectionProps = {
  localNote: string;
  localEmoji?: string;
  reduceMotion: boolean;
  visible: boolean;
  index: number;
  handleEmojiSelect: (emoji: string) => void;
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
