import { useMemo } from 'react';

export type TimeBucket = 'morning' | 'afternoon' | 'evening';

export interface TimeBucketInfo {
  bucket: TimeBucket;
  label: string;
}

const BUCKET_LABELS: Record<TimeBucket, string> = {
  afternoon: 'Afternoon · try one of these',
  evening: 'Evening · try one of these',
  morning: 'Morning · try one of these',
};

function bucketFor(hour: number): TimeBucket {
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

/**
 * Returns the current time bucket (morning/afternoon/evening) and a display
 * label. Computed once per render; callers decide whether to memoise further.
 */
export function useTimeBucket(now: Date = new Date()): TimeBucketInfo {
  return useMemo(() => {
    const bucket = bucketFor(now.getHours());
    return { bucket, label: BUCKET_LABELS[bucket] };
  }, [now]);
}
