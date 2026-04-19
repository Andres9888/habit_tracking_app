/**
 * useGoalAdjust — State + mutations for the GoalAdjustSheet.
 */
import { useEffect, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';

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
  const { triggerSelection, triggerSuccess, triggerWarning } = useHapticFeedback();
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

  return { confirmRemove, handleRemove, handleSelect, handleUpdate, saving, selected };
}
