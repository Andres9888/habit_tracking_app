import { FALLBACK_SETTLE_MS } from './scrollToIndexFallback';
import {
  CONVERGED_CLEAN_POLLS,
  MAX_HIDDEN_WAIT_MS,
  SETTLE_POLL_MS,
} from './focusHabitRequest.constants';
import type {
  FocusRequestActions,
  FocusRequestContext,
} from './focusHabitRequest.types';

export function beginFocusConvergence(
  context: FocusRequestContext,
  actions: FocusRequestActions
): void {
  const { habitId, index, latest, progress, timers } = context;
  let cleanPolls = 0;
  const scheduleNext = () => {
    timers.push(setTimeout(settleCheck, SETTLE_POLL_MS));
  };
  const settleCheck = () => {
    const { fallbackAtRef, isFocusNeighborhoodReady } = latest.current;
    const now = Date.now();
    const lastFallback = fallbackAtRef?.current ?? 0;
    const fallbackActive =
      lastFallback >= progress.startedAt &&
      now - lastFallback < FALLBACK_SETTLE_MS;
    const capped = now - progress.startedAt >= MAX_HIDDEN_WAIT_MS;

    if (!capped && fallbackActive) {
      cleanPolls = 0;
      scheduleNext();
      return;
    }
    if (!capped) {
      const before = fallbackAtRef?.current ?? 0;
      actions.scrollToTarget();
      const raised = (fallbackAtRef?.current ?? 0) !== before;
      cleanPolls = raised ? 0 : cleanPolls + 1;
      if (cleanPolls < CONVERGED_CLEAN_POLLS) {
        scheduleNext();
        return;
      }
    }
    if (!(isFocusNeighborhoodReady?.(index) ?? true)) {
      actions.nudgeRenderWindow();
      scheduleNext();
      return;
    }
    if (!latest.current.autoClose) {
      latest.current.setJustCreatedHabitId(habitId);
      latest.current.onFocusReady(habitId);
      return;
    }
    actions.placeAndHighlight();
  };

  actions.scrollToTarget();
  scheduleNext();
}
