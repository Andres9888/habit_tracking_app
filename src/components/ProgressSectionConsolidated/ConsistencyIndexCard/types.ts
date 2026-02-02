/**
 * Type definitions for ConsistencyIndexCard
 */

export interface ConsistencyIndexResult {
  /** Overall consistency score (0-100) */
  overall: number;
  /** 30-day consistency score (0-100) */
  day30: number;
  /** 60-day consistency score (0-100) */
  day60: number;
  /** 90-day consistency score (0-100) */
  day90: number;
}

export interface ConsistencyIndexCardProps {
  /** Consistency index data */
  consistencyIndex: ConsistencyIndexResult;
  /** Previous period's overall score for comparison */
  previousOverall?: number;
  /** Callback when info button is pressed */
  onInfoPress?: () => void;
}
