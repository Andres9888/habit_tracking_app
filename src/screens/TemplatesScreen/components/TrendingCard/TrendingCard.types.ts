/**
 * Type definitions for TrendingCard component
 */

export interface TrendingCardProps {
  /** Frequency display string (e.g., "Daily", "3x/week") */
  frequency: string;
  /** Whether template has scientific backing */
  hasResearch: boolean;
  /** Template emoji icon */
  icon: string;
  /** Background tint color for the icon area */
  iconColor: string;
  /** Whether this template was already imported this session */
  isImported: boolean;
  /** Whether an import is currently in progress */
  isImporting: boolean;
  /** Template name */
  name: string;
  /** Direct import handler (1-tap add) */
  onImport: () => void;
  /** Card body press handler (opens fullsize preview) */
  onPress: () => void;
  /** Number of users who added this template */
  popularityScore: number;
}

export interface AddButtonProps {
  /** Whether this template was already imported */
  isImported: boolean;
  /** Whether an import is in progress */
  isImporting: boolean;
  /** Template name for accessibility label */
  name: string;
  /** Direct import handler */
  onImport: () => void;
}
