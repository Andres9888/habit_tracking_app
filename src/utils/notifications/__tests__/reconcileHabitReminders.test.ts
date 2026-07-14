import * as Notifications from 'expo-notifications';

import { reconcileHabitReminders } from '../reconcileHabitReminders';

const mockNotifications = Notifications as jest.Mocked<typeof Notifications>;

describe('reconcileHabitReminders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNotifications.getPermissionsAsync.mockResolvedValue({ granted: true });
    mockNotifications.getAllScheduledNotificationsAsync.mockResolvedValue([]);
    mockNotifications.scheduleNotificationAsync.mockResolvedValue(
      'native-notification-id'
    );
  });

  it('schedules missing enabled habit reminders from authoritative habit settings', async () => {
    await expect(
      reconcileHabitReminders([
        {
          _id: 'habit1',
          name: 'Read',
          reminderTime: '06:45',
          remindersEnabled: true,
        },
      ])
    ).resolves.toEqual({ canceled: 0, scheduled: 1 });

    expect(mockNotifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: 'habit-reminder-habit1',
        trigger: expect.objectContaining({ hour: 6, minute: 45 }),
      })
    );
  });

  it('does not reschedule when the deterministic reminder already matches', async () => {
    mockNotifications.getAllScheduledNotificationsAsync.mockResolvedValue([
      {
        content: { data: { habitId: 'habit1', type: 'habitReminder' } },
        identifier: 'habit-reminder-habit1',
        trigger: { hour: 6, minute: 45 },
      },
    ] as Awaited<
      ReturnType<typeof Notifications.getAllScheduledNotificationsAsync>
    >);

    await expect(
      reconcileHabitReminders([
        {
          _id: 'habit1',
          name: 'Read',
          reminderTime: '06:45',
          remindersEnabled: true,
        },
      ])
    ).resolves.toEqual({ canceled: 0, scheduled: 0 });

    expect(mockNotifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('cancels stale deterministic habit reminders for disabled or missing habits', async () => {
    mockNotifications.getAllScheduledNotificationsAsync.mockResolvedValue([
      {
        content: { data: { habitId: 'habit1', type: 'habitReminder' } },
        identifier: 'habit-reminder-habit1',
        trigger: { hour: 6, minute: 45 },
      },
      {
        content: { data: { habitId: 'habit2', type: 'habitReminder' } },
        identifier: 'legacy-habit2',
        trigger: { hour: 7, minute: 30 },
      },
      {
        content: { data: { habitId: 'other', type: 'streakAtRisk' } },
        identifier: 'streak-at-risk-other',
        trigger: { hour: 8, minute: 0 },
      },
    ] as Awaited<
      ReturnType<typeof Notifications.getAllScheduledNotificationsAsync>
    >);

    await expect(
      reconcileHabitReminders([
        {
          _id: 'habit1',
          name: 'Read',
          reminderTime: '06:45',
          remindersEnabled: false,
        },
      ])
    ).resolves.toEqual({ canceled: 2, scheduled: 0 });

    expect(
      mockNotifications.cancelScheduledNotificationAsync
    ).toHaveBeenCalledWith('habit-reminder-habit1');
    expect(
      mockNotifications.cancelScheduledNotificationAsync
    ).toHaveBeenCalledWith('legacy-habit2');
    expect(
      mockNotifications.cancelScheduledNotificationAsync
    ).not.toHaveBeenCalledWith('streak-at-risk-other');
  });

  it('skips reconciliation when notification permission is not granted', async () => {
    mockNotifications.getPermissionsAsync.mockResolvedValue({
      granted: false,
      status: 'denied',
    });

    await expect(
      reconcileHabitReminders([
        {
          _id: 'habit1',
          name: 'Read',
          reminderTime: '06:45',
          remindersEnabled: true,
        },
      ])
    ).resolves.toEqual({ canceled: 0, scheduled: 0 });

    expect(
      mockNotifications.getAllScheduledNotificationsAsync
    ).not.toHaveBeenCalled();
    expect(mockNotifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});
