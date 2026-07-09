type WindowArgs = { endDate?: unknown; startDate?: unknown };

// A windowed list renders the most recent days, so the `:latest` fallback is
// only useful when the persisted window reaches near the requested end (today).
// Two weeks of staleness still paints the visible week correctly-ish; anything
// older cannot contain visible-week rows and would render a confidently-empty
// list.
const MAX_STALE_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Guard for a windowed query's `:latest` cache fallback. The slot is shared
 * across subscribers (and app versions): a stale or foreign writer can persist
 * a window that ends long before today — device-confirmed as a window ending
 * 90 days back, which painted every visible week cell unchecked on cold start.
 * Reject any persisted window whose end lags the requested end by more than
 * MAX_STALE_DAYS; unknown args shapes degrade to no-cache (loading).
 */
export function isWindowEndRecent(
  persistedArgs: unknown,
  requestedArgs: unknown
): boolean {
  const persistedEnd = (persistedArgs as WindowArgs | undefined)?.endDate;
  const requestedEnd = (requestedArgs as WindowArgs | undefined)?.endDate;
  if (typeof persistedEnd !== 'string' || typeof requestedEnd !== 'string') {
    return false;
  }
  const persistedEndMs = Date.parse(persistedEnd);
  const requestedEndMs = Date.parse(requestedEnd);
  if (Number.isNaN(persistedEndMs) || Number.isNaN(requestedEndMs)) {
    return false;
  }
  return requestedEndMs - persistedEndMs <= MAX_STALE_DAYS * DAY_MS;
}
