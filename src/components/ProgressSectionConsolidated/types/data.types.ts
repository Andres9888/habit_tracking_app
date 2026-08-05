/**
 * Data Types
 *
 * Data structure interfaces for ProgressSectionConsolidated components.
 */

/**
 * Insight chip data structure
 */
export interface InsightChipData {
  /** Unique identifier for the chip */
  id: 'streak' | 'bestDay' | 'focusDay' | 'monthly';
  /** Emoji icon to display */
  icon: string;
  /** Primary value (e.g., "6 days", "Sunday", "6/22") */
  value: string;
  /** Secondary label text */
  label: string;
  /** Border color class name */
  borderColor: string;
  /** Whether to show pulse animation (for active streak) */
  hasPulse?: boolean;
  /** Whether the chip is interactive */
  isInteractive?: boolean;
  /** Optional callback when tapped */
  onPress?: () => void;
}

/**
 * Level thresholds configuration for habit strength display
 */
export interface LevelThreshold {
  /** Minimum strength value for this level (inclusive) */
  min: number;
  /** Maximum strength value for this level (exclusive) */
  max: number;
  /** Display label for the level */
  label: string;
  /** Emoji representing the level */
  emoji: string;
  /** Primary color for the level */
  color: string;
  /** Light background color for badges */
  bgColor: string;
  /** Description of what this level means */
  description: string;
}
