/**
 * Types for VoiceNotesSection component
 */

export interface VoiceNoteSummary {
  id: string;
  duration: number;
  label?: string;
  createdAt: number;
  isDay1?: boolean;
  /** Audio URI for playback */
  audioUrl?: string;
}

export interface VoiceNotesSectionProps {
  /** List of existing voice notes */
  voiceNotes: VoiceNoteSummary[];
  /** Number of voice notes (for premium gating) */
  voiceNoteCount: number;
  /** Whether user has premium access */
  isPremium: boolean;
  /** Callback when a new recording is saved */
  onSaveRecording: (
    audioUri: string,
    durationSeconds: number,
    isDay1: boolean
  ) => Promise<void>;
  /** Callback when user taps to view all notes */
  onViewAllNotes: () => void;
  /** Callback when user hits premium limit */
  onPremiumRequired: () => void;
  /** Callback when a voice note starts playing */
  onPlayStart?: (noteId: string) => void;
  /** Callback when playback finishes */
  onPlayFinish?: (noteId: string) => void;
  /** Whether to run entrance animations */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
}
