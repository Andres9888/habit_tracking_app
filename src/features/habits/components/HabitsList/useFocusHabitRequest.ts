/**
 * Consumes the "focus this habit" request raised by the Habit Library's
 * post-add primary action.
 *
 * The list is remounted around a far target while the library still covers it.
 * The library remains in place until both of these are true:
 * - instant scroll probes confirm the target has a real frame;
 * - the target row and its adjacent rows have completed native layout.
 *
 * The highlight is armed before the library starts closing, so the first
 * visible frame already contains a fully populated, highlighted neighborhood.
 */

import { useEffect, useRef } from 'react';
import { AccessibilityInfo } from 'react-native';
import type { FlatList } from 'react-native-gesture-handler';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { Habit } from '../../types';
import {
  FALLBACK_SETTLE_MS,
  FOCUS_VIEW_POSITION,
} from './scrollToIndexFallback';

/** Consecutive fallback-free instant scrolls before the row counts as placed. */
export const CONVERGED_CLEAN_POLLS = 2;
/** Re-check cadence while the instant jumps or native layouts are converging. */
export const SETTLE_POLL_MS = 100;
/** Longest to wait for scroll probes; native row layout is still mandatory. */
export const MAX_HIDDEN_WAIT_MS = 3500;
/** Give React/native three frames to paint the highlight before revealing it. */
export const HIGHLIGHT_PREPAINT_MS = 50;
/** A native scroll event wakes a stranded VirtualizedList render window. */
export const RENDER_WINDOW_NUDGE_PX = 2;

interface UseFocusHabitRequestOptions {
  autoClose: boolean;
  clearPendingFocusHabit: () => void;
  closeLibrary: () => void;
  focusReady: boolean;
  /** Timestamp of the last `onScrollToIndexFailed` fallback (0 = never). */
  fallbackAtRef?: React.RefObject<number>;
  /** Current list contentOffset.y, read before revealing the target region. */
  getScrollOffset?: () => number;
  habits: Habit[];
  /** True only after the target row and adjacent rows report native layout. */
  isFocusNeighborhoodReady?: (targetIndex: number) => boolean;
  isLibraryOpen: boolean;
  listRef: React.RefObject<FlatList<Habit> | null>;
  pendingFocusHabitId: Id<'habits'> | null;
  onFocusReady: (id: Id<'habits'>) => void;
  reduceMotion: boolean;
  setJustCreatedHabitId: (id: Id<'habits'> | null) => void;
}

interface RequestProgress {
  highlightedAt: number | null;
  id: Id<'habits'>;
  startedAt: number;
}

export function useFocusHabitRequest(o: UseFocusHabitRequestOptions) {
  const { autoClose, focusReady, habits, pendingFocusHabitId } = o;
  // Everything except the effect's real triggers is read through a ref, so a
  // new callback identity cannot restart an in-flight request.
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

    // Not delivered by the habits.list subscription yet — wait. This effect
    // re-runs when `habits` changes; modals state owns the give-up timeout.
    const index = habits.findIndex((h) => h._id === pendingFocusHabitId);
    if (index === -1) return;

    const habitName = habits[index]?.name ?? '';
    const timers: ReturnType<typeof setTimeout>[] = [];
    const scrollToTarget = () => {
      try {
        latest.current.listRef.current?.scrollToIndex({
          animated: false,
          index,
          viewPosition: FOCUS_VIEW_POSITION,
        });
      } catch {
        // onScrollToIndexFailed owns recovery when the target frame is absent.
      }
    };
    const fixNegativeOffset = () => {
      const y = latest.current.getScrollOffset?.() ?? 0;
      if (y < -0.5) {
        latest.current.listRef.current?.scrollToOffset({
          animated: false,
          offset: 0,
        });
      }
    };
    const nudgeRenderWindow = () => {
      const y = latest.current.getScrollOffset?.();
      if (y == null || !Number.isFinite(y)) return;
      latest.current.listRef.current?.scrollToOffset({
        animated: false,
        // initialScrollIndex anchors the target at the start of the render
        // window. Wake the window toward the previous sibling, which is the
        // only neighborhood row that can still be missing at this point.
        offset: Math.max(0, y - RENDER_WINDOW_NUDGE_PX),
      });
      latest.current.listRef.current?.recordInteraction();
    };
    const placeAndHighlight = (relock = true) => {
      if (relock) {
        scrollToTarget();
        latest.current.listRef.current?.recordInteraction();
      }
      fixNegativeOffset();
      progress.highlightedAt = Date.now();
      latest.current.setJustCreatedHabitId(pendingFocusHabitId);
      AccessibilityInfo.announceForAccessibility(
        `${habitName} added. Showing it in your habits.`
      );
      timers.push(setTimeout(finishRequest, HIGHLIGHT_PREPAINT_MS));
    };
    const finishRequest = () => {
      if (handledRef.current === pendingFocusHabitId) return;
      handledRef.current = pendingFocusHabitId;
      if (latest.current.isLibraryOpen) latest.current.closeLibrary();
      latest.current.clearPendingFocusHabit();
    };

    if (progressRef.current?.id !== pendingFocusHabitId) {
      progressRef.current = {
        highlightedAt: null,
        id: pendingFocusHabitId,
        startedAt: Date.now(),
      };
    }
    const progress = progressRef.current;

    // A prepared request has already paid for travel and native layout while
    // the toast is up. Commit only re-locks the final position and paints the
    // ring before beginning the modal exit.
    if (focusReady) {
      // Hidden convergence already locked a real target frame and native
      // neighborhood. Re-scrolling here adds a slow-list warning and delays
      // the modal exit without changing the final offset.
      if (autoClose) placeAndHighlight(false);
      return () => {
        for (const timer of timers) clearTimeout(timer);
      };
    }

    // A data rerender can restart this effect during the short prepaint. Keep
    // the highlight armed and finish only the remaining covered interval.
    if (progress.highlightedAt !== null) {
      const remaining = Math.max(
        0,
        HIGHLIGHT_PREPAINT_MS - (Date.now() - progress.highlightedAt)
      );
      timers.push(setTimeout(finishRequest, remaining));
      return () => {
        for (const timer of timers) clearTimeout(timer);
      };
    }

    // Phase 1 — instant travel, hidden behind the library.
    scrollToTarget();

    let cleanPolls = 0;
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
        timers.push(setTimeout(settleCheck, SETTLE_POLL_MS));
        return;
      }

      if (!capped) {
        // An instant scroll that raises no fallback means the target row has
        // a real frame. Require two consecutive clean probes.
        const before = fallbackAtRef?.current ?? 0;
        scrollToTarget();
        const raised = (fallbackAtRef?.current ?? 0) !== before;
        cleanPolls = raised ? 0 : cleanPolls + 1;
        if (cleanPolls < CONVERGED_CLEAN_POLLS) {
          timers.push(setTimeout(settleCheck, SETTLE_POLL_MS));
          return;
        }
      }

      // Scroll math alone is not proof that VirtualizedList painted the
      // surrounding cards. Never expose a one-card render island. A tiny
      // hidden offset change emits the native scroll event VirtualizedList
      // needs to recompute a window stranded by initialScrollIndex.
      if (!(isFocusNeighborhoodReady?.(index) ?? true)) {
        nudgeRenderWindow();
        timers.push(setTimeout(settleCheck, SETTLE_POLL_MS));
        return;
      }

      // Prepare stops here and leaves the stable list covered. Commit either
      // arrives later (ready fast path above) or was already requested (cold
      // path), in which case the baseline prepaint + close behavior continues.
      if (!latest.current.autoClose) {
        // Pay the React/list update for selecting the highlighted row while
        // the library still covers Home. The row holds the ring statically
        // until commit, when only that row starts the visible fade.
        latest.current.setJustCreatedHabitId(pendingFocusHabitId);
        latest.current.onFocusReady(pendingFocusHabitId);
        return;
      }
      placeAndHighlight();
    };

    timers.push(setTimeout(settleCheck, SETTLE_POLL_MS));

    return () => {
      for (const timer of timers) clearTimeout(timer);
    };
  }, [autoClose, focusReady, habits, pendingFocusHabitId]);
}
