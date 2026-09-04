/**
 * Scrolls the visible habits list to a habit and highlights it — the Home
 * side of the post-create toast's "Go to <name>".
 *
 * The library's focus request remounts the list behind a modal and probes
 * until it converges; that machinery is hidden there and would be a series
 * of visible jumps here. Home is already on screen, so this is two animated
 * scrolls — an estimated jump that mounts the target's neighborhood, then
 * the exact align once the row is measured — followed by the same ring the
 * library uses. (scrollToEnd is not enough: a virtualized list's content
 * length is an estimate that grows as rows mount, so it lands short.)
 */

import { useEffect, useRef, type RefObject } from 'react';
import { AccessibilityInfo } from 'react-native';
import type { FlatList } from 'react-native-gesture-handler';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { Habit } from '../../types';
import { FOCUS_VIEW_POSITION } from './scrollToIndexFallback';

/** Time for the estimated jump to land and mount rows near the target. */
export const REVEAL_JUMP_MS = 450;
/** Time for the exact align to land before the ring paints. */
export const REVEAL_SETTLE_MS = 450;
/** Reduce Motion: instant scrolls only need a frame or two between steps. */
const REDUCED_STEP_MS = 60;

interface UseRevealHabitRequestOptions {
  clearRevealHabit: () => void;
  /** Average measured row height; sizes the first, estimated jump. */
  estimatedRowLength: number;
  habits: Habit[];
  listRef: RefObject<FlatList<Habit> | null>;
  reduceMotion: boolean;
  revealHabitId: Id<'habits'> | null;
  setJustCreatedHabitId: (id: Id<'habits'> | null) => void;
}

function scrollToRow(
  list: FlatList<Habit> | null,
  index: number,
  animated: boolean
) {
  try {
    list?.scrollToIndex({ animated, index, viewPosition: FOCUS_VIEW_POSITION });
  } catch {
    // onScrollToIndexFailed owns recovery when the row is still unmeasured.
  }
}

export function useRevealHabitRequest(o: UseRevealHabitRequestOptions) {
  const { habits, revealHabitId } = o;
  const latest = useRef(o);
  latest.current = o;
  const handledRef = useRef<Id<'habits'> | null>(null);
  // Owned here, not by the effect: a habits update mid-scroll must not
  // cancel the steps still waiting to run.
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  useEffect(() => {
    if (!revealHabitId) {
      handledRef.current = null;
      clearTimers();
      return;
    }
    if (handledRef.current === revealHabitId) return;
    // habits.list has not delivered the row yet; the next update retries.
    const index = habits.findIndex((habit) => habit._id === revealHabitId);
    if (index === -1) return;
    handledRef.current = revealHabitId;

    const animated = !latest.current.reduceMotion;
    const stepMs = animated ? REVEAL_JUMP_MS : REDUCED_STEP_MS;
    const settleMs = animated ? REVEAL_SETTLE_MS : REDUCED_STEP_MS;
    const habitName = habits[index]?.name ?? '';
    const list = latest.current.listRef.current;

    list?.scrollToOffset({
      animated,
      offset: Math.max(0, index * latest.current.estimatedRowLength),
    });
    timers.current.push(
      setTimeout(() => {
        scrollToRow(latest.current.listRef.current, index, animated);
        timers.current.push(
          setTimeout(() => {
            latest.current.setJustCreatedHabitId(revealHabitId);
            AccessibilityInfo.announceForAccessibility(
              `${habitName} added. Showing it in your habits.`
            );
            latest.current.clearRevealHabit();
          }, settleMs)
        );
      }, stepMs)
    );
  }, [habits, revealHabitId]);
}
