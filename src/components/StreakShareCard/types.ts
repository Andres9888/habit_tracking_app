/**
 * Types for StreakShareCard component
 *
 * A shareable card specifically for streak milestones,
 * designed for social media sharing (Instagram, Twitter, etc.)
 */

export interface StreakShareCardProps {
  /** Whether the share modal is visible */
  visible: boolean;

  /** Close callback */
  onClose: () => void;

  /** Streak count to display */
  streakDays: number;

  /** Habit name */
  habitName: string;

  /** Habit emoji */
  habitEmoji?: string;

  /** Milestone title (e.g. "One Month Strong!") */
  milestoneTitle?: string;

  /** User's display name (optional) */
  userName?: string;
}

export interface ShareCardTheme {
  name: string;
  backgroundColors: string[];
  textColor: string;
  accentColor: string;
}
