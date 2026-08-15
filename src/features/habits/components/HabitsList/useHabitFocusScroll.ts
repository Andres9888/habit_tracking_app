/**
 * useHabitFocusScroll — services a pending "show me this habit" request.
 *
 * The Habit Library's post-add primary action ("Go to Today and complete X")
 * files the request; this hook is the only consumer. It scrolls the row into
 * view and reuses the existing new-habit highlight so the row the button named
 * is also the row that stands out on arrival.
 *
 * Ordering matters. The request can land before the habits query has caught up
 * with the row that was just created, so an id that is not in `habits` yet is
 * left pending rather than dropped — the effect re-runs when the data arrives.
 * The scroll itself is deferred until the library modal has finished closing;
 * scrolling underneath it would spend the whole animation off screen and the
 * user would arrive on Today with no sense of having moved.
 */

import { useEffect, useRef } from 'react';
import type { FlatList } from 'react-native-gesture-handler';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { Habit } from '../../types';
import {
  clearHabitFocus,
  useHabitFocusRequest,
} from '../../hooks/habitFocusStore';

/** Roughly the library modal's dismissal, so the scroll reads as movement. */
const FOCUS_SCROLL_DELAY_MS = 320;

interface UseHabitFocusScrollOptions {
  habits: Habit[];
  listRef: React.MutableRefObject<FlatList<Habit> | null>;
  reduceMotion: boolean;
  setJustCreatedHabitId: (id: Id<'habits'> | null) => void;
}

export function useHabitFocusScroll({
  habits,
  listRef,
  reduceMotion,
  setJustCreatedHabitId,
}: UseHabitFocusScrollOptions) {
  const focusHabitId = useHabitFocusRequest();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  useEffect(() => {
    if (!focusHabitId) return;
    const index = habits.findIndex((habit) => habit._id === focusHabitId);
    // Not in the list yet (or archived away): keep the request pending.
    if (index === -1) return;

    clearHabitFocus();
    setJustCreatedHabitId(focusHabitId);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      listRef.current?.scrollToIndex({
        animated: !reduceMotion,
        index,
        viewPosition: 0.5,
      });
    }, FOCUS_SCROLL_DELAY_MS);
  }, [focusHabitId, habits, listRef, reduceMotion, setJustCreatedHabitId]);
}
