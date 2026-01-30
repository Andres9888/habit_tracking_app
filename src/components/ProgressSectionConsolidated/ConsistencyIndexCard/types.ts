/**
 * Type definitions for ConsistencyIndexCard
 */

import type { ConsistencyIndexResult } from '../../CalendarHeatmap/utils';

export interface ConsistencyIndexCardProps {
  /** Consistency index data */
  consistencyIndex: ConsistencyIndexResult;
  /** Previous period's overall score for comparison */
  previousOverall?: number;
  /** Callback when info button is pressed */
  onInfoPress?: () => void;
}
