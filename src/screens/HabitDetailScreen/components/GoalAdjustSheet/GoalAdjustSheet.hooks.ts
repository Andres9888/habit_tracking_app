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
  visible: boolean;
  onClose: () => void;
}

export function useGoalAdjust({
  habitId,
  currentGoal,
  visible,
  onClose,
}: UseGoalAdjustArgs) {
  const { triggerSelection, triggerSuccess, triggerWarning } =
    useHapticFeedback();
  const updateHabit = useMutation(api.habits.update);
  const [selected, setSelected] = useState<number>(currentGoal);
  const [saving, setSaving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  useEffect(() => {
    if (visible) {
      setSelected(currentGoal);
      setConfirmRemove(false);
    }
  }, [visible, currentGoal]);

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
