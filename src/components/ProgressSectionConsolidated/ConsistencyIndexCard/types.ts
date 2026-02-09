/**
 * Type definitions for ConsistencyIndexCard
 */

/** Consistency index calculation result */
export interface ConsistencyIndexResult {
  overall: number;
  day30: number;
  day60: number;
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
