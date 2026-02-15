/**
 * Types for useWelcomeBack hook
 *
 * Detects when a user returns after 2+ days away
 * and provides welcome-back messaging with streak recovery suggestions.
 */

export interface WelcomeBackData {
  /** Whether the welcome-back message should be shown */
  shouldShow: boolean;

  /** Number of days since last app open */
  daysAway: number;

  /** Personalized welcome-back message */
  message: string;

  /** Subtitle with streak recovery suggestion */
  suggestion: string;

  /** Emoji for the welcome-back state */
  emoji: string;

  /** Dismiss the welcome-back message */
  dismiss: () => void;
}

export interface WelcomeBackConfig {
  /** Minimum days away to trigger welcome-back (default: 2) */
  minDaysAway?: number;

  /** AsyncStorage key for last open timestamp */
  storageKey?: string;
}
