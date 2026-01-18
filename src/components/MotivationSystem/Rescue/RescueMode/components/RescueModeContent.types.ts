/**
 * Types for RescueModeContent
 */

import type { RescueHabitData } from '../RescueMode.types';

export interface RescueModeContentProps {
  habit: RescueHabitData;
  visible: boolean;
  reduceMotion: boolean;
  hasStreak: boolean;
  hasWhy: boolean;
  hasVoiceNote: boolean;
  hasPreviousStreakNotes: boolean;
  onVoiceNotePlayStart?: () => void;
  onVoiceNotePlayFinish?: () => void;
}
