/**
 * useCreateHabitModalUx — visibility-driven UI niceties for the create modal:
 * clears the name error after the exit animation and flashes the scroll
 * indicator on open so users see the form is scrollable.
 */

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import type { ScrollView } from 'react-native';
import { EXIT_DURATIONS } from '../../Modal/Modal.constants';
import { createHabitMotion } from '../createHabitMotion';

export function useCreateHabitModalUx(
  visible: boolean,
  isEditMode: boolean,
  scrollViewRef: RefObject<ScrollView | null>
) {
  const [showNameError, setShowNameError] = useState(false);

  useEffect(() => {
    if (visible || isEditMode) return;
    const timeout = setTimeout(
      () => setShowNameError(false),
      EXIT_DURATIONS.fullScreen
    );
    return () => clearTimeout(timeout);
  }, [visible, isEditMode]);

  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => {
      scrollViewRef.current?.flashScrollIndicators();
    }, createHabitMotion.contentReadyMs);
    return () => clearTimeout(id);
  }, [visible, scrollViewRef]);

  return { setShowNameError, showNameError };
}
