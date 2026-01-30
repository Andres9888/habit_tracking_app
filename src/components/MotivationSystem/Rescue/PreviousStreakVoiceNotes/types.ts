/**
 * Types for PreviousStreakVoiceNotes component
 */

/**
 * Voice note with streak context data
 */
export interface StreakVoiceNoteData {
  /** Voice note ID */
  id: string;
  /** Audio URI for playback */
  audioUrl: string;
  /** Duration in seconds */
  duration: number;
  /** Optional label */
  label?: string;
  /** When the note was created */
  createdAt: number;
  /** Which day of the streak this was recorded (1-indexed) */
  streakAtRecording: number;
  /** How many days ago this was recorded */
  daysAgo: number;
}

export interface PreviousStreakVoiceNotesProps {
  /** Voice notes from the best streak period */
  voiceNotes: StreakVoiceNoteData[];
  /** The user's best streak (for context display) */
  bestStreak: number;
  /** Called when any voice note playback starts */
  onPlayStart?: () => void;
  /** Called when any voice note playback finishes */
  onPlayFinish?: () => void;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
}

export interface StreakVoiceNoteCardProps {
  voiceNote: StreakVoiceNoteData;
  bestStreak: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onPlayStart?: () => void;
  onPlayFinish?: () => void;
  reduceMotion?: boolean;
}
