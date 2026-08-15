/**
 * habitFocusStore — a one-shot "bring this habit into view on Today" request.
 *
 * The request crosses two trees that never meet in React: the Habit Library
 * modal (which knows *which* habit was just added) and HabitsList (which owns
 * the scroller). Threading a callback between them would mean a prop chain
 * through every modal wrapper and the whole HabitsApp render, so the handoff
 * lives in a module store instead — the same `useSyncExternalStore` pattern
 * `optimisticHabitCreationStore` already uses here.
 *
 * It is deliberately a *request*, not a state: HabitsList clears it once it
 * has scrolled, so a later re-render never re-scrolls the user.
 */

import { useSyncExternalStore } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';

type Listener = () => void;

let requestedHabitId: Id<'habits'> | null = null;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return requestedHabitId;
}

/** Ask Today to scroll to (and highlight) this habit the next time it renders. */
export function requestHabitFocus(habitId: Id<'habits'>) {
  requestedHabitId = habitId;
  emit();
}

/** Consume the request. Called by the list once the scroll is under way. */
export function clearHabitFocus() {
  if (requestedHabitId === null) return;
  requestedHabitId = null;
  emit();
}

export function useHabitFocusRequest() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
