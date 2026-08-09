/** Shared toggle runner for habit-detail calendar + 2-minute completion. */
import { AccessibilityInfo, Alert } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
import { triggerHaptic } from '../../utils/haptics';

type ToggleFn = (args: {
  date: string;
  habitId: Id<'habits'>;
  kind?: 'full' | 'minimal';
}) => Promise<unknown>;

export function runHabitDayToggle(options: {
  date: string;
  habitId: Id<'habits'>;
  habitName: string;
  kind?: 'full' | 'minimal';
  setPendingMinimal: (pending: boolean) => void;
  setPendingToggleDate: (date: string | null) => void;
  toggle: ToggleFn;
  wasCompleted: boolean;
}): Promise<void> {
  const {
    date,
    habitId,
    habitName,
    kind,
    setPendingMinimal,
    setPendingToggleDate,
    toggle,
    wasCompleted,
  } = options;

  const inputDate = new Date(date);
  const todayDate = new Date();
  inputDate.setHours(0, 0, 0, 0);
  todayDate.setHours(0, 0, 0, 0);
  if (inputDate > todayDate) return Promise.resolve();

  setPendingToggleDate(date);
  setPendingMinimal(!wasCompleted && kind === 'minimal');
  void triggerHaptic(wasCompleted ? 'toggle' : 'success');

  const dateFormatted = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const newState = wasCompleted ? 'marked incomplete' : 'marked complete';

  return toggle({
    date,
    habitId,
    ...(!wasCompleted && kind ? { kind } : {}),
  })
    .then(() => {
      const announcement = `${habitName} on ${dateFormatted} ${newState}.`;
      if (__DEV__) console.log('A11y announcement:', announcement);
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(announcement);
      }, 200);
    })
    .catch((error: unknown) => {
      if (__DEV__) console.error('Failed to toggle habit:', error);
      Alert.alert('Error', ERROR_MESSAGES.DATA_OPS.TOGGLE_HABIT_FAILED);
    })
    .finally(() => {
      setPendingToggleDate(null);
      setPendingMinimal(false);
    });
}
