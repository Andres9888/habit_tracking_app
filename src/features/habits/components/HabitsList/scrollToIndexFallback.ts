/**
 * `onScrollToIndexFailed` handler for the habits list.
 *
 * During normal scrolling the list has no `getItemLayout` (row height varies:
 * compact vs regular, one- vs two-line titles). A focus remount supplies only
 * an initial estimate; this handler still corrects any jump whose real target
 * frame has not been measured yet.
 *
 * Recovery: the first failure for a target makes ONE estimated jump
 * (average row length × index) so the window mounts near the target no
 * matter how far it is; every later failure is an exact ladder rung — a
 * scroll to the highest measured row, which mounts the next window — until
 * the target itself is measured and the precise scroll succeeds. Two or three
 * rounds in practice. (A pure ladder climbs one window per rung and blew the
 * hidden-wait cap on a ~200-row list; the remount/initialScrollIndex approach
 * left a stranded render window. Both sim-verified.) Runs hidden behind the
 * library modal.
 */

import type { FlatList } from 'react-native-gesture-handler';
import type { Habit } from '../../types';

/** Time for a rung to mount + measure the next window of rows. */
export const FALLBACK_RETRY_MS = 120;
/**
 * Rungs before giving up. Sized so the ladder stops before
 * useFocusHabitRequest reveals the list at its hidden-wait cap
 * (FALLBACK_RETRY_MS × (n + 1) ≤ MAX_HIDDEN_WAIT_MS): a rung after the reveal
 * would be a visible jump. Each rung climbs one render window, so this still
 * covers a few hundred rows.
 */
export const FALLBACK_MAX_RETRIES = 28;

/**
 * How long the focus flow waits after the last fallback event before it
 * treats the scroll as converged.
 */
export const FALLBACK_SETTLE_MS = 300;

/**
 * Where a focused row lands in the viewport. Upper third: clear of the bottom
 * action bar, and below the calendar header. Relative to the list viewport, so
 * a sticky calendar header (rendered outside the list) needs no offset math.
 */
export const FOCUS_VIEW_POSITION = 0.35;

interface ScrollToIndexFailInfo {
  averageItemLength: number;
  highestMeasuredFrameIndex: number;
  index: number;
}

export function createScrollToIndexFallback(
  listRef: React.RefObject<FlatList<Habit> | null>,
  onFallback?: () => void
) {
  let climbingFor = -1;
  let retries = 0;
  let lastRung = -1;

  return (info: ScrollToIndexFailInfo) => {
    const list = listRef.current;
    if (!list) return;
    onFallback?.();
    if (climbingFor !== info.index) {
      climbingFor = info.index;
      retries = 0;
      lastRung = -1;
    } else if (++retries > FALLBACK_MAX_RETRIES) {
      return;
    }
    if (retries === 0) {
      // One estimated jump lands the render window near the target. With
      // nothing measured yet the average is 0 and this mounts the first
      // window, which is still progress.
      list.scrollToOffset({
        animated: false,
        offset: info.averageItemLength * info.index,
      });
    } else {
      // Rung: the highest measured row is the farthest exact scroll
      // available; landing there (top of viewport) mounts the window past it.
      const rung = Math.max(
        0,
        Math.min(info.highestMeasuredFrameIndex, info.index)
      );
      if (rung !== lastRung) {
        lastRung = rung;
        try {
          list.scrollToIndex({ animated: false, index: rung, viewPosition: 0 });
        } catch {
          // Dead ref. Nothing to recover.
        }
      }
    }
    setTimeout(() => {
      try {
        // Instant: this runs while the library modal still covers the list;
        // the one visible motion is the short align in useFocusHabitRequest.
        listRef.current?.scrollToIndex({
          animated: false,
          index: info.index,
          viewPosition: FOCUS_VIEW_POSITION,
        });
      } catch {
        // Dead ref. Nothing to recover.
      }
    }, FALLBACK_RETRY_MS);
  };
}
