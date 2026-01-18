/**
 * LettersSection Types
 * Type definitions for the Letters to Self feature
 *
 * Part of the Motivation System Workshop tab
 * Story T11.2-T11.8: Letters to Self feature
 */

/**
 * Summary of a letter for list display
 */
export interface LetterSummary {
  id: string;
  title?: string;
  content: string;
  createdAt: number;
  unlockAt: number;
  isRead: boolean;
}

/**
 * Full letter data for reading (includes all fields from Convex)
 */
export interface LetterData {
  id: string;
  title?: string;
  content: string;
  createdAt: number;
  unlockAt: number;
  isRead: boolean;
  habitName?: string;
}

/**
 * Props for the LettersSection component
 */
export interface LettersSectionProps {
  /** List of existing letters */
  letters: LetterSummary[];
  /** Number of letters (for analytics) */
  letterCount: number;
  /** Whether user has premium access */
  isPremium: boolean;
  /** Callback when a new letter is saved */
  onSaveLetter: (
    content: string,
    unlockDays: number,
    title?: string
  ) => Promise<void>;
  /** Callback when user taps to view all letters */
  onViewAllLetters: () => void;
  /** Callback when user taps a letter to read it (deprecated - use internal modal) */
  onReadLetter: (letterId: string) => void;
  /** Callback when a letter is marked as read */
  onMarkAsRead?: (letterId: string) => void;
  /** Callback when user hits premium limit */
  onPremiumRequired: () => void;
  /** Whether to run entrance animations */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
  /** Optional habit name to display in letter reading modal */
  habitName?: string;
}

/**
 * Unlock duration option configuration
 */
export interface UnlockDurationOption {
  readonly description: string;
  readonly label: string;
  readonly value: number;
}
