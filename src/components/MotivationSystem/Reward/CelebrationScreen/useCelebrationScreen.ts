/**
 * useCelebrationScreen - State management hook for CelebrationScreen
 */

import { useCallback, useEffect, useState } from 'react';
import type { EmojiType } from '../QuickReflection';
import type { CelebrationHabitData } from './types';

interface UseCelebrationScreenParams {
  habit: CelebrationHabitData | null;
  selectedEmoji?: EmojiType;
  reflectionNote?: string;
  onEmojiSelect?: (emoji: EmojiType) => void;
  onNoteChange?: (note: string) => void;
  onDone?: () => void;
  onClose: () => void;
  onRecordVoice?: () => void;
  onWriteLetter?: () => void;
}

export function useCelebrationScreen({
  habit,
  selectedEmoji,
  reflectionNote = '',
  onEmojiSelect,
  onNoteChange,
  onDone,
  onClose,
  onRecordVoice,
  onWriteLetter,
}: UseCelebrationScreenParams) {
  const [localEmoji, setLocalEmoji] = useState<EmojiType | undefined>(
    selectedEmoji
  );
  const [localNote, setLocalNote] = useState(reflectionNote);

  // Sync with props
  useEffect(() => {
    setLocalEmoji(selectedEmoji);
  }, [selectedEmoji]);

  useEffect(() => {
    setLocalNote(reflectionNote);
  }, [reflectionNote]);

  const handleEmojiSelect = useCallback(
    (emoji: EmojiType) => {
      setLocalEmoji(emoji);
      onEmojiSelect?.(emoji);
    },
    [onEmojiSelect]
  );

  const handleNoteChange = useCallback(
    (note: string) => {
      setLocalNote(note);
      onNoteChange?.(note);
    },
    [onNoteChange]
  );

  const handleDone = useCallback(() => {
    onDone?.();
    onClose();
  }, [onDone, onClose]);

  const handleRecordVoice = useCallback(() => {
    onRecordVoice?.();
  }, [onRecordVoice]);

  const handleWriteLetter = useCallback(() => {
    onWriteLetter?.();
  }, [onWriteLetter]);

  // Computed values
  const hasStreak = (habit?.currentStreak ?? 0) > 0;
  const hasStats =
    habit?.completionRate !== undefined ||
    habit?.bestStreak !== undefined ||
    habit?.totalCompletions !== undefined;

  return {
    handleDone,
    handleEmojiSelect,
    handleNoteChange,
    handleRecordVoice,
    handleWriteLetter,
    hasStats,
    hasStreak,
    localEmoji,
    localNote,
  };
}
