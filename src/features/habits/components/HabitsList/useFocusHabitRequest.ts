/**
 * Pre-positions a newly imported habit behind the open Library, then reveals
 * only after its target neighborhood and highlight are painted.
 */

import { useEffect, useRef } from 'react';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { createFocusRequestActions } from './focusHabitRequestActions';
import { beginFocusConvergence } from './focusHabitRequestConvergence';
import { HIGHLIGHT_PREPAINT_MS } from './focusHabitRequest.constants';
import type {
  FocusRequestContext,
  RequestProgress,
  UseFocusHabitRequestOptions,
} from './focusHabitRequest.types';

export {
  CONVERGED_CLEAN_POLLS,
  HIGHLIGHT_PREPAINT_MS,
  MAX_HIDDEN_WAIT_MS,
  RENDER_WINDOW_NUDGE_PX,
  SETTLE_POLL_MS,
} from './focusHabitRequest.constants';

export function useFocusHabitRequest(o: UseFocusHabitRequestOptions) {
  const { autoClose, focusReady, habits, pendingFocusHabitId } = o;
  // Non-trigger inputs stay current without callback identity restarting work.
  const latest = useRef(o);
  latest.current = o;
  const handledRef = useRef<Id<'habits'> | null>(null);
  const progressRef = useRef<RequestProgress | null>(null);

  useEffect(() => {
    if (!pendingFocusHabitId) {
      handledRef.current = null;
      progressRef.current = null;
      return;
    }
    if (handledRef.current === pendingFocusHabitId) return;

    // Wait for habits.list to deliver the mutation result before mounting it.
    const index = habits.findIndex(
      (habit) => habit._id === pendingFocusHabitId
    );
    if (index === -1) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const progress =
      progressRef.current?.id === pendingFocusHabitId
        ? progressRef.current
        : {
            highlightedAt: null,
            id: pendingFocusHabitId,
            startedAt: Date.now(),
          };
    progressRef.current = progress;
    const context: FocusRequestContext = {
      habitId: pendingFocusHabitId,
      habitName: habits[index]?.name ?? '',
      handledRef,
      index,
      latest,
      progress,
      timers,
    };
    const actions = createFocusRequestActions(context);
    const cleanup = () => timers.forEach(clearTimeout);

    if (focusReady) {
      if (autoClose) actions.placeAndHighlight(false);
      return cleanup;
    }
    if (progress.highlightedAt !== null) {
      const elapsed = Date.now() - progress.highlightedAt;
      const remaining = Math.max(0, HIGHLIGHT_PREPAINT_MS - elapsed);
      timers.push(setTimeout(actions.finishRequest, remaining));
      return cleanup;
    }

    beginFocusConvergence(context, actions);
    return cleanup;
  }, [autoClose, focusReady, habits, pendingFocusHabitId]);
}
