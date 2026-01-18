/**
 * QuickReflection Component
 * Post-habit completion emoji rating + optional note
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Keyboard } from 'react-native';

import type { QuickReflectionProps } from './QuickReflection.types';
import {
  AnimatedSection,
  EmojiSelector,
  NoteInput,
  ReflectionHeader,
  ReflectionIcon,
  SectionCard,
} from './components';

export function QuickReflection({
  selectedEmoji,
  note = '',
  onEmojiSelect,
  onNoteChange,
  onSubmit,
  showNoteInput = true,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 0,
  compact = false,
}: QuickReflectionProps) {
  const [localNote, setLocalNote] = useState(note);
  const hasSelection = !!selectedEmoji;

  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  const handleNoteChange = useCallback(
    (text: string) => {
      setLocalNote(text);
      onNoteChange?.(text);
    },
    [onNoteChange]
  );

  const handleNoteSubmit = useCallback(() => {
    Keyboard.dismiss();
    onSubmit?.();
  }, [onSubmit]);

  if (compact) {
    return (
      <EmojiSelector
        reduceMotion={reduceMotion}
        selectedEmoji={selectedEmoji}
        onSelect={onEmojiSelect}
      />
    );
  }

  return (
    <AnimatedSection
      index={sectionIndex}
      reduceMotion={reduceMotion}
      shouldAnimate={shouldAnimate}
    >
      <SectionCard className='border-l-4 border-l-emerald-400'>
        <View className='flex-row items-start gap-3'>
          <ReflectionIcon
            hasSelection={hasSelection}
            reduceMotion={reduceMotion}
            sectionIndex={sectionIndex}
            shouldAnimate={shouldAnimate}
          />

          <View className='flex-1'>
            <ReflectionHeader hasSelection={hasSelection} />
            <Text className='mb-4 text-sm text-stone-500'>
              How did completing this habit feel?
            </Text>
            <EmojiSelector
              reduceMotion={reduceMotion}
              selectedEmoji={selectedEmoji}
              onSelect={onEmojiSelect}
            />
            {showNoteInput && hasSelection && (
              <NoteInput
                value={localNote}
                onChange={handleNoteChange}
                onSubmit={handleNoteSubmit}
              />
            )}
          </View>
        </View>
      </SectionCard>
    </AnimatedSection>
  );
}

export default QuickReflection;
