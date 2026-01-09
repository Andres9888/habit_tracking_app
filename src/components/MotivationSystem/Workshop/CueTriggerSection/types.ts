/**
 * CueTriggerSection Types
 */

export interface CueTriggerData {
  /** Time of day for the habit (e.g., "7:00 AM" or "Morning") */
  time?: string;
  /** Location where the habit occurs (e.g., "Kitchen") */
  location?: string;
  /** Preceding behavior that triggers the habit (e.g., "After morning coffee") */
  afterBehavior?: string;
}

export interface CueTriggerSectionProps {
  /** The habit's cue/trigger data */
  cue: CueTriggerData | undefined;
  /** Callback when user taps to edit/add their cue */
  onPress: () => void;
  /** Whether to run entrance animations (first tab visit only) */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
}
