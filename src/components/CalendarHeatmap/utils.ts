/**
 * CalendarHeatmap utility types and functions
 */

export interface ConsistencyIndexResult {
  /** Overall consistency score (0-100) */
  overall: number;
  /** Weekly consistency breakdown */
  weekly: number;
  /** Monthly consistency breakdown */
  monthly: number;
  /** Current streak factor */
  streakFactor: number;
}
