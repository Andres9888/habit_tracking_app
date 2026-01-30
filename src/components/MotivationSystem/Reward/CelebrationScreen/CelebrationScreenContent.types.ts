/**
 * Types for CelebrationScreenContent
 */

import type { CelebrationScreenContentProps } from './types';

export interface CelebrationScreenContentPropsExtended extends CelebrationScreenContentProps {
  hasStreak: boolean;
  hasStats: boolean;
  localNote: string;
  localEmoji: string | null;
  handleEmojiSelect: (emoji: string) => void;
  handleNoteChange: (note: string) => void;
  handleRecordVoice: () => void;
  handleWriteLetter: () => void;
  onReflectionSubmit?: () => void;
}
