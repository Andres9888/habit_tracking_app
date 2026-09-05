import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';

import { useStreakReminders } from '../useStreakReminders';
import type { StreakReminderHabit } from '../types';

const scheduleMock = Notifications.scheduleNotificationAsync as jest.Mock;

function makeHabit(
  overrides: Partial<StreakReminderHabit> = {}
): StreakReminderHabit {
  return {
    completedToday: false,
    currentStreak: 5,
    habitId: 'h1',
    habitName: 'Meditate',
    ...overrides,
  };
}

function baseProps(habits: StreakReminderHabit[]) {
  return { enabled: true, habits, isPremium: false, reminderTime: '20:00' };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useStreakReminders', () => {
  it('schedules a daily repeat while the habit is still outstanding', async () => {
    renderHook(() => useStreakReminders(baseProps([makeHabit()])));

    await waitFor(() => expect(scheduleMock).toHaveBeenCalledTimes(1));
    const request = scheduleMock.mock.calls[0][0];
    expect(request.identifier).toBe('streak-risk-h1');
    expect(request.trigger.type).toBe('daily');
    expect(request.trigger.hour).toBe(20);
    expect(request.trigger.minute).toBe(0);
  });

  it('books tomorrow as a one-shot once the habit is completed today', async () => {
    renderHook(() =>
      useStreakReminders(baseProps([makeHabit({ completedToday: true })]))
    );

    await waitFor(() => expect(scheduleMock).toHaveBeenCalledTimes(1));
    const request = scheduleMock.mock.calls[0][0];
    // Same identifier, so the next reschedule (or a cancel) still replaces it.
    expect(request.identifier).toBe('streak-risk-h1');
    expect(request.trigger.type).toBe('date');

    const scheduledFor: Date = request.trigger.date;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(scheduledFor.getFullYear()).toBe(tomorrow.getFullYear());
    expect(scheduledFor.getMonth()).toBe(tomorrow.getMonth());
    expect(scheduledFor.getDate()).toBe(tomorrow.getDate());
    expect(scheduledFor.getHours()).toBe(20);
    expect(scheduledFor.getMinutes()).toBe(0);
  });

  it('cancels without rescheduling when the streak is gone', async () => {
    renderHook(() =>
      useStreakReminders(baseProps([makeHabit({ currentStreak: 0 })]))
    );

    await waitFor(() =>
      expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
        'streak-risk-h1'
      )
    );
    expect(scheduleMock).not.toHaveBeenCalled();
  });

  it('does not reschedule when a re-render passes an equal habits array', async () => {
    const { rerender } = renderHook(
      (props: ReturnType<typeof baseProps>) => useStreakReminders(props),
      { initialProps: baseProps([makeHabit()]) }
    );

    await waitFor(() => expect(scheduleMock).toHaveBeenCalledTimes(1));

    // New array + new object identities, same content: the signature is
    // unchanged, so nothing should be cancelled or rescheduled.
    await act(async () => {
      rerender(baseProps([makeHabit()]));
    });

    expect(scheduleMock).toHaveBeenCalledTimes(1);
  });

  it('reschedules when a habit actually changes', async () => {
    const { rerender } = renderHook(
      (props: ReturnType<typeof baseProps>) => useStreakReminders(props),
      { initialProps: baseProps([makeHabit()]) }
    );

    await waitFor(() => expect(scheduleMock).toHaveBeenCalledTimes(1));

    await act(async () => {
      rerender(baseProps([makeHabit({ completedToday: true })]));
    });

    await waitFor(() => expect(scheduleMock).toHaveBeenCalledTimes(2));
    expect(scheduleMock.mock.calls[1][0].trigger.type).toBe('date');
  });
});
