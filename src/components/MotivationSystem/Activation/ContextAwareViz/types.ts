/**
 * Types for ContextAwareViz component
 */

import { type MotivationLevel } from '../MotivationCheck';

/** Visualization data from habit */
export interface VisualizationData {
  /** Success visualization - how body feels when succeeding */
  successBody?: string;
  /** Success visualization - how mind feels when succeeding */
  successMind?: string;
  /** Success visualization - emotions when succeeding */
  successEmotion?: string;
  /** Failure visualization - how body feels when failing */
  failureBody?: string;
  /** Failure visualization - how mind feels when failing */
  failureMind?: string;
  /** Failure visualization - emotions when failing */
  failureEmotion?: string;
}

export interface ContextAwareVizProps {
  /** The user's current motivation level */
  motivationLevel: MotivationLevel | undefined;
  /** Visualization data from the habit */
  visualization: VisualizationData | undefined;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Optional className for container styling */
  className?: string;
  /** Compact mode for inline use */
  compact?: boolean;
  /** Force show a specific visualization type (overrides motivation logic) */
  forceType?: 'success' | 'failure';
}

export type VizType = 'success' | 'failure';
export type ColorClass = 'success' | 'failure';
