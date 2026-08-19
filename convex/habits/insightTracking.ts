import { v } from 'convex/values';
import type { Doc } from '../_generated/dataModel';

/** Fields the detail-screen insight cards actually read. */
export const insightTrackingValidator = v.object({
  _creationTime: v.number(),
  completed: v.boolean(),
  date: v.string(),
});

export function projectInsightTracking(row: Doc<'tracking'>) {
  return {
    _creationTime: row._creationTime,
    completed: row.completed,
    date: row.date,
  };
}
