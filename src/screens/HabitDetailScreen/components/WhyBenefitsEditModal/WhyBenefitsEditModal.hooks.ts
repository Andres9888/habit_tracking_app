import { useEffect, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Habit } from '../../../../features/habits/types';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import type { WhyBenefitsFormState } from './WhyBenefitsEditModal.types';

function initialState(habit: Habit): WhyBenefitsFormState {
  return {
    why: habit.why ?? '',
    identity: habit.identity ?? '',
    benefitsRaw: (habit.benefits ?? []).join('\n'),
    scienceNote: habit.scienceNote ?? '',
  };
}

function parseBenefits(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

interface UseWhyBenefitsEditArgs {
  habit: Habit;
  visible: boolean;
  onClose: () => void;
}

export function useWhyBenefitsEdit({ habit, visible, onClose }: UseWhyBenefitsEditArgs) {
  const updateHabit = useMutation(api.habits.update);
  const { triggerSuccess } = useHapticFeedback();
  const [form, setForm] = useState<WhyBenefitsFormState>(() => initialState(habit));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) setForm(initialState(habit));
  }, [visible, habit]);

  const setField = <K extends keyof WhyBenefitsFormState>(
    key: K,
    value: WhyBenefitsFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await updateHabit({
        habitId: habit._id,
        why: form.why.trim(),
        identity: form.identity.trim(),
        benefits: parseBenefits(form.benefitsRaw),
        scienceNote: form.scienceNote.trim(),
      });
      triggerSuccess();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return { form, setField, saving, handleSave };
}
