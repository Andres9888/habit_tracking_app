import { useCallback, useEffect, useRef, useState } from 'react';
import ErrorBoundary from '../../../../components/ErrorBoundary';
import CreateHabitModal from '../../../../components/CreateHabitModal';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { EXIT_DURATIONS } from '../../../../components/Modal/Modal.constants';
import type { CreateHabitModalSectionProps } from './HabitsModals.types';

/**
 * Longest the form stays up waiting for the list to converge behind it. The
 * library toast has no cap because the user closes it; the form must never
 * feel stuck, so past this it exits and the reveal is whatever has mounted.
 */
export const FOCUS_HOLD_CAP_MS = 1500;
/** Time allowed for the request's pending state to reach this component. */
export const FOCUS_HOLD_GRACE_MS = 120;

/**
 * Create habit modal section - handles habit creation/editing
 */
export function CreateHabitModalSection({
  showCreateHabit,
  habitToEdit,
  closeCreateHabit,
  createdFocusPending = false,
  onHabitCreated,
  onHabitCreateSynced,
}: CreateHabitModalSectionProps) {
  const [shouldRender, setShouldRender] = useState(showCreateHabit);
  const [renderedHabitToEdit, setRenderedHabitToEdit] = useState(habitToEdit);

  // Like the library modal, the form covers Home while the focus request
  // converges (remount, narrow render window, entrance stagger). Closing on
  // create is deferred until the row is placed — or the cap — so the exit
  // reveals a finished list instead of a half-mounted one.
  const holdNextCloseRef = useRef(false);
  const heldAtRef = useRef(0);
  const sawPendingRef = useRef(false);
  const [closeHeld, setCloseHeld] = useState(false);
  const handleHabitCreated = useCallback(
    (tempId: Id<'habits'>) => {
      holdNextCloseRef.current = true;
      onHabitCreated?.(tempId);
    },
    [onHabitCreated]
  );
  const handleClose = useCallback(() => {
    if (holdNextCloseRef.current) {
      holdNextCloseRef.current = false;
      heldAtRef.current = Date.now();
      sawPendingRef.current = false;
      setCloseHeld(true);
      return;
    }
    closeCreateHabit();
  }, [closeCreateHabit]);
  useEffect(() => {
    if (!closeHeld) return;
    const release = () => {
      setCloseHeld(false);
      closeCreateHabit();
    };
    const held = Date.now() - heldAtRef.current;
    if (createdFocusPending) {
      sawPendingRef.current = true;
      const timer = setTimeout(release, Math.max(0, FOCUS_HOLD_CAP_MS - held));
      return () => clearTimeout(timer);
    }
    // Pending flipped false: converged (or expired) — release. Before it has
    // been seen at all, allow one short grace for the state to arrive.
    if (sawPendingRef.current || held >= FOCUS_HOLD_GRACE_MS) {
      release();
      return;
    }
    const timer = setTimeout(release, FOCUS_HOLD_GRACE_MS - held);
    return () => clearTimeout(timer);
  }, [closeHeld, closeCreateHabit, createdFocusPending]);

  useEffect(() => {
    if (showCreateHabit) {
      setRenderedHabitToEdit(habitToEdit);
      setShouldRender(true);
      return;
    }

    const timeout = setTimeout(() => {
      setShouldRender(false);
      setRenderedHabitToEdit(null);
    }, EXIT_DURATIONS.fullScreen);

    return () => clearTimeout(timeout);
  }, [habitToEdit, showCreateHabit]);

  if (!shouldRender) {
    return null;
  }

  return (
    <ErrorBoundary fallback={null}>
      <CreateHabitModal
        habitToEdit={renderedHabitToEdit || undefined}
        visible={showCreateHabit}
        onClose={handleClose}
        onHabitCreateSynced={onHabitCreateSynced}
        onHabitCreated={handleHabitCreated}
      />
    </ErrorBoundary>
  );
}
