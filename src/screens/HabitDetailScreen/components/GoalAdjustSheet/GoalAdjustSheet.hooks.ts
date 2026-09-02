/**
 * useGoalAdjust — State + mutations for the GoalAdjustSheet.
 */
import { useEffect, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';

export const GOAL_PRESETS = [7, 21, 30, 66, 100, 365] as const;
export const RECOMMENDED_GOAL = 66;

export function goalLabelFor(days: number): string {
  return days === 365 ? '1-year' : `${days}-day`;
}

interface UseGoalAdjustArgs {
  habitId: Id<'habits'>;
  currentGoal: number;
  /**
   * Opening selection when it should differ from the stored goal — Detail
   * shows a suggested ladder before anything is persisted, so the sheet opens
   * on that preset. Saving it still writes, because it is not `currentGoal`.
   */
  initialGoal?: number;
  visible: boolean;
  onClose: () => void;
}

export function useGoalAdjust({
  habitId,
  currentGoal,
  initialGoal,
  visible,
  onClose,
}: UseGoalAdjustArgs) {
  const { triggerSelection, triggerSuccess, triggerWarning } =
    useHapticFeedback();
  const updateHabit = useMutation(api.habits.update);
  const opening = initialGoal ?? currentGoal;
  const [selected, setSelected] = useState<number>(opening);
  const [saving, setSaving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  useEffect(() => {
    if (visible) {
      setSelected(opening);
      setConfirmRemove(false);
    }
  }, [visible, opening]);

  const handleSelect = (days: number) => {
    triggerSelection();
    setSelected(days);
    setConfirmRemove(false);
  };

  const handleUpdate = async () => {
    if (saving) return;
    if (selected === currentGoal) return onClose();
    setSaving(true);
    try {
      await updateHabit({ goalDuration: selected, habitId });
      triggerSuccess();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!confirmRemove) {
      triggerWarning();
      setConfirmRemove(true);
      return;
    }
    setSaving(true);
    try {
      await updateHabit({ goalDuration: 0, habitId });
      triggerSuccess();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return {
    confirmRemove,
    handleRemove,
    handleSelect,
    handleUpdate,
    saving,
    selected,
  };
}
