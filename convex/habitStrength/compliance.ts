/**
 * Compliance Calculation
 * 30-day rolling window compliance calculation
 */
import { COMPLIANCE_WINDOW_DAYS } from './constants';
import { addDays, formatDateKey, startOfDay } from './dateUtils';

export function computeCompliance({
  habitCreatedAt,
  trackingMap,
  evaluationDate,
}: {
  habitCreatedAt: number;
  trackingMap: Map<string, boolean>;
  evaluationDate: Date;
}): { compliance: number; successes: number; daysConsidered: number } {
  const creationDate = startOfDay(new Date(habitCreatedAt));
  const windowStartCandidate = addDays(
    evaluationDate,
    -(COMPLIANCE_WINDOW_DAYS - 1)
  );
  const startDate = new Date(
    Math.max(windowStartCandidate.getTime(), creationDate.getTime())
  );

  let successes = 0;
  let daysConsidered = 0;

  for (
    let cursor = new Date(startDate);
    cursor.getTime() <= evaluationDate.getTime();
    cursor = addDays(cursor, 1)
  ) {
    daysConsidered++;
    const key = formatDateKey(cursor);
    const completed = trackingMap.get(key) ?? false;
    if (completed) {
      successes++;
    }
  }

  // No days to consider = 0% compliance (not inflated)
  if (daysConsidered === 0) {
    return { compliance: 0, daysConsidered: 0, successes: 0 };
  }

  // Simple ratio: 0 completions = 0%, all completions = 100%
  const compliance = successes / daysConsidered;

  return { compliance, daysConsidered, successes };
}
