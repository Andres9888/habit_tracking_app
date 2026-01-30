import type { StreakVoiceNoteData } from '../PreviousStreakVoiceNotes';

/**
 * Day 1 Voice Note data for Rescue Mode
 * Prominently featured to reconnect user with their initial motivation
 */
export interface Day1VoiceNoteData {
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
}

/**
 * Habit data for display in Rescue Mode
 */
export interface RescueHabitData {
  /** Habit ID for tracking */
  id: string;
  /** Habit name */
  name: string;
  /** Habit icon emoji */
  icon?: string;
  /** Current streak count at risk */
  currentStreak?: number;
  /** Best streak (for context in streak recovery) */
  bestStreak?: number;
  /** Total completions */
  totalCompletions?: number;
  /** User's "why" statement */
  why?: string;
  /** Failure visualization data */
  vizFailureBody?: string;
  vizFailureMind?: string;
  vizFailureEmotion?: string;
  /** Hours remaining until day ends */
  hoursRemaining?: number;
  /** Day 1 voice note for emotional anchor */
  day1VoiceNote?: Day1VoiceNoteData;
  /** Voice notes from the user's best streak period (for streak recovery) */
  previousStreakVoiceNotes?: StreakVoiceNoteData[];
}

export interface RescueModeProps {
  /** Modal visibility */
  visible: boolean;
  /** Close modal callback */
  onClose: () => void;
  /** Habit data to display */
  habit: RescueHabitData | null;
  /** Called when user taps "Just Do 2 Minutes" */
  onJustTwoMin?: () => void;
  /** Called when user taps "Start Full Habit" */
  onStartFull?: () => void;
  /** Called when user taps "Skip Today" */
  onSkipToday?: () => void;
  /** Called when voice note playback starts */
  onVoiceNotePlayStart?: () => void;
  /** Called when voice note playback finishes */
  onVoiceNotePlayFinish?: () => void;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
}
