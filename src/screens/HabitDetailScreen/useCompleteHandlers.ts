/**
 * useCompleteHandlers
 *
 * One-way "Mark as done" for the hero/dock CTA. A second tap while already
 * completed re-offers Undo in a toast instead of silently reversing the
 * completion — the most-tapped control on the screen shouldn't double as
 * its own destructive inverse (a fidget or pocket touch on it has already
 * caused a real accidental streak untoggle in this app).
 *
 * Undo calls the exact same toggle mutation (onDayPress) as every other
 * surface — the calendar grid keeps toggling any day, including today,
 * exactly as before; only this CTA becomes one-way.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { getLocalDateString } from '../../utils/getLocalDateString';

const UNDO_TOAST_MS = 3200;

interface UseCompleteHandlersProps {
  habitId: string | undefined;
  habitName: string;
  isCompletedToday: boolean;
  isToggling: boolean;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function useCompleteHandlers({
  habitId,
  habitName,
  isCompletedToday,
  isToggling,
  onDayPress,
}: UseCompleteHandlersProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => () => clearTimeout(dismissTimer.current), []);

  // The detail modal stays mounted across habit switches (see
  // HabitDetailScreen's fullHabit/displayHabit comment), so a toast left
  // over from a previous habit — and its Undo action bound to that habit's
  // mutation — must not survive onto the next one.
  useEffect(() => {
    clearTimeout(dismissTimer.current);
    setToastMessage(null);
  }, [habitId]);

  const showUndoToast = useCallback((message: string) => {
    setToastMessage(message);
    clearTimeout(dismissTimer.current);
    dismissTimer.current = setTimeout(
      () => setToastMessage(null),
      UNDO_TOAST_MS
    );
  }, []);

  const handleCompletePress = useCallback(() => {
    if (isToggling) return;
    if (isCompletedToday) {
      showUndoToast('Already done today');
      return;
    }
    onDayPress(getLocalDateString(), false);
    showUndoToast(`${habitName} done!`);
  }, [habitName, isCompletedToday, isToggling, onDayPress, showUndoToast]);

  const handleUndo = useCallback(() => {
    // The mark mutation may still be in flight (handleCalendarDayPress
    // guards on its own togglingRef and would otherwise drop this call
    // silently) — leave the toast up so Undo stays available once it clears
    // rather than disappearing without having done anything.
    if (isToggling) return;
    clearTimeout(dismissTimer.current);
    setToastMessage(null);
    onDayPress(getLocalDateString(), true);
  }, [isToggling, onDayPress]);

  const dismissToast = useCallback(() => setToastMessage(null), []);

  return {
    dismissToast,
    handleCompletePress,
    handleUndo,
    toastMessage,
  };
}
