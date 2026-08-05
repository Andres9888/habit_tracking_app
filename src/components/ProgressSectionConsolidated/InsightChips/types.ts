/**
 * InsightChips Types
 *
 * Type definitions for insight chip components
 */

/** Data for an individual insight chip */
export interface InsightChipData {
  id: string;
  icon: string;
  value: string;
  label: string;
  borderColor: string;
  isInteractive?: boolean;
  hasPulse?: boolean;
  onPress?: () => void;
}

/** Props for InsightChip component */
export interface InsightChipProps {
  chip: InsightChipData;
  index: number;
  reduceMotion: boolean;
  onHapticFeedback: () => void;
}

/** Re-export InsightChipsProps from parent types */
export type { InsightChipsProps } from '../types';
