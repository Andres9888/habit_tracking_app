/**
 * Scrolls the visible habits list to a habit and highlights it — the Home
 * side of the post-create toast's "Go to <name>".
 *
 * The library's focus request remounts the list behind a modal and probes
 * until it converges; that machinery is hidden there and would be a series
 * of visible jumps here. Home is already on screen, so this is one animated
 * scroll followed by the same ring the library uses.
 */

import { useEffect, useRef, type RefObject } from 'react';
import { AccessibilityInfo } from 'react-native';
import type { FlatList } from 'react-native-gesture-handler';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { Habit } from '../../types';
import { FOCUS_VIEW_POSITION } from './scrollToIndexFallback';

/** Time for the animated scroll to land before the ring paints. */
export const REVEAL_SETTLE_MS = 450;

interface UseRevealHabitRequestOptions {
  clearRevealHabit: () => void;
  habits: Habit[];
  listRef: RefObject<FlatList<Habit> | null>;
  reduceMotion: boolean;
  revealHabitId: Id<'habits'> | null;
  setJustCreatedHabitId: (id: Id<'habits'> | null) => void;
}

export function useRevealHabitRequest(o: UseRevealHabitRequestOptions) {
  const { habits, revealHabitId } = o;
  const latest = useRef(o);
  latest.current = o;
  const handledRef = useRef<Id<'habits'> | null>(null);
  // Owned here, not by the effect: a habits update during the scroll must
  // not cancel the highlight that is waiting on it.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  useEffect(() => {
    if (!revealHabitId) {
      handledRef.current = null;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      return;
    }
    if (handledRef.current === revealHabitId) return;
    // habits.list has not delivered the row yet; the next update retries.
    const index = habits.findIndex((habit) => habit._id === revealHabitId);
    if (index === -1) return;
    handledRef.current = revealHabitId;

    const animated = !latest.current.reduceMotion;
    const list = latest.current.listRef.current;
    // A new habit is appended, so the usual target is the last row, and
    // scrollToEnd needs no measured layout. Any other row goes through
    // scrollToIndex; onScrollToIndexFailed owns recovery when it is unmeasured.
    if (index === habits.length - 1) {
      list?.scrollToEnd({ animated });
    } else {
      try {
        list?.scrollToIndex({ animated, index, viewPosition: FOCUS_VIEW_POSITION });
      } catch {
        // Dead ref. Nothing to recover.
      }
    }
    const habitName = habits[index]?.name ?? '';
    timerRef.current = setTimeout(
      () => {
        timerRef.current = null;
        latest.current.setJustCreatedHabitId(revealHabitId);
        AccessibilityInfo.announceForAccessibility(
          `${habitName} added. Showing it in your habits.`
        );
        latest.current.clearRevealHabit();
      },
      animated ? REVEAL_SETTLE_MS : 0
    );
  }, [habits, revealHabitId]);
}
