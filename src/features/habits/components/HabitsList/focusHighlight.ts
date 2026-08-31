interface FocusHighlightState {
  autoClose: boolean;
  focusReady: boolean;
  pendingFocusHabitId: string | null;
}

/**
 * Keep the ring fully painted while Home is covered. A committed request can
 * still be converging; releasing the ring at the tap would let its fade finish
 * before a slow far-row reveal.
 */
export function shouldHoldFocusHighlight({
  autoClose,
  focusReady,
  pendingFocusHabitId,
}: FocusHighlightState): boolean {
  return Boolean(pendingFocusHabitId && (!autoClose || !focusReady));
}
