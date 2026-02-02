/**
 * Types for CelebrationScreenContent
 */

import type { CelebrationScreenContentProps } from './types';
import type { EmojiType } from '../QuickReflection';

export interface CelebrationScreenContentPropsExtended extends CelebrationScreenContentProps {
  hasStreak: boolean;
  hasStats: boolean;
  localNote: string;
  localEmoji: EmojiType | undefined;
  handleEmojiSelect: (emoji: EmojiType) => void;
  handleNoteChange: (note: string) => void;
  handleRecordVoice?: () => void;
  handleWriteLetter?: () => void;
  onReflectionSubmit?: () => void;
}
