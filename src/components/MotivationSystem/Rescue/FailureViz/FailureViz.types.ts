/**
 * FailureViz Types
 * Type definitions for the failure visualization component
 */

/** Failure visualization data */
export interface FailureVisualizationData {
  /** How body feels when failing */
  failureBody?: string;
  /** How mind feels when failing */
  failureMind?: string;
  /** Emotions when failing */
  failureEmotion?: string;
}

export interface FailureVizProps {
  /** Visualization data from the habit */
  visualization: FailureVisualizationData | undefined;
  /** Current streak count (for streak loss preview) */
  streakCount?: number;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Optional className for container styling */
  className?: string;
}

export interface VizFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  index: number;
  reduceMotion: boolean;
}

export interface StreakLossPreviewProps {
  streakCount: number;
  reduceMotion: boolean;
}
