import { useEffect, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';

export const DAILY_CHIPS = [
  { label: '10m', minutes: 10 },
  { label: '20m', minutes: 20 },
  { label: '30m', minutes: 30 },
  { label: '45m', minutes: 45 },
  { label: '60m', minutes: 60 },
];
export const WEEKLY_CHIPS = [
  { label: '1h', minutes: 60 },
  { label: '2h', minutes: 120 },
  { label: '3h', minutes: 180 },
  { label: '5h', minutes: 300 },
  { label: '10h', minutes: 600 },
];

interface UseTimeGoalsArgs {
  habitId: Id<'habits'>;
  visible: boolean;
  initialDailyMinutes: number;
  initialWeeklyMinutes: number;
  onClose: () => void;
}

export function useTimeGoals({
  habitId,
  visible,
  initialDailyMinutes,
  initialWeeklyMinutes,
  onClose,
}: UseTimeGoalsArgs) {
  const { triggerSelection, triggerSuccess } = useHapticFeedback();
  const updateHabit = useMutation(api.habits.update);
  const [dailyValue, setDailyValue] = useState('');
  const [weeklyHourValue, setWeeklyHourValue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setDailyValue(initialDailyMinutes > 0 ? String(initialDailyMinutes) : '');
    setWeeklyHourValue(
      initialWeeklyMinutes > 0 ? (initialWeeklyMinutes / 60).toString() : ''
    );
  }, [visible, initialDailyMinutes, initialWeeklyMinutes]);

  const save = async (clearAll: boolean) => {
    if (saving) return;
    setSaving(true);
    try {
      const dailyMinutes = clearAll ? 0 : Number.parseInt(dailyValue, 10) || 0;
      const weeklyHours = clearAll ? 0 : Number.parseFloat(weeklyHourValue) || 0;
      await updateHabit({
        dailyMinutesGoal: dailyMinutes,
        habitId,
        weeklyMinutesGoal: Math.round(weeklyHours * 60),
      });
      triggerSuccess();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return {
    dailyValue,
    pickDaily: (m: number) => {
      triggerSelection();
      setDailyValue(String(m));
    },
    pickWeekly: (m: number) => {
      triggerSelection();
      setWeeklyHourValue(String(m / 60));
    },
    save,
    saving,
    setDailyValue,
    setWeeklyHourValue,
    weeklyHourValue,
  };
}
