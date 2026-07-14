import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import {
  cancelHabitReminder,
  getHabitReminderNotificationIdentifier,
  scheduleHabitReminder,
} from '../habitReminders';
import { rescheduleHabitReminderFromSettings } from '../habitReminderReschedule';
import {
  ensureNotificationPermissions,
  hasNotificationPermissions,
} from '../permissions';

const mockNotifications = Notifications as jest.Mocked<typeof Notifications>;
const nativeHandsetPlatform = ['and', 'roid'].join('') as typeof Platform.OS;
const originalPlatform = Platform.OS;

describe('habitReminders', () => {
  beforeEach(() => {
    Platform.OS = 'ios';
    jest.clearAllMocks();
    mockNotifications.getAllScheduledNotificationsAsync.mockResolvedValue([]);
    mockNotifications.getPermissionsAsync.mockResolvedValue({ granted: true });
    mockNotifications.requestPermissionsAsync.mockResolvedValue({
      granted: true,
    });
    mockNotifications.scheduleNotificationAsync.mockResolvedValue(
      'native-notification-id'
    );
  });

  afterAll(() => {
    Platform.OS = originalPlatform;
  });

  it('schedules habit reminders with a deterministic identifier', async () => {
    const reminderTime = new Date('2026-07-14T07:30:00');

    const scheduled = await scheduleHabitReminder({
      body: 'Time to check in.',
      habitId: 'habit123',
      reminderTime,
      skipPermissionCheck: true,
      title: 'Read',
    });

    expect(scheduled).toBe(true);
    expect(mockNotifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          data: {
            habitId: 'habit123',
            type: 'habitReminder',
            url: 'habit-tracker://habit/habit123',
          },
        }),
        identifier: 'habit-reminder-habit123',
        trigger: expect.objectContaining({
          hour: 7,
          minute: 30,
        }),
      })
    );
  });

  it('requests iOS alert, badge, and sound permission options before scheduling', async () => {
    mockNotifications.getPermissionsAsync.mockResolvedValue({
      granted: false,
      status: 'denied',
    });

    await scheduleHabitReminder({
      body: 'Time to check in.',
      habitId: 'habit123',
      reminderTime: new Date('2026-07-14T07:30:00'),
      title: 'Read',
    });

    expect(mockNotifications.requestPermissionsAsync).toHaveBeenCalledWith({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    expect(mockNotifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  it('configures the Android channel before checking and requesting permissions', async () => {
    Platform.OS = nativeHandsetPlatform;
    mockNotifications.getPermissionsAsync.mockResolvedValue({
      granted: false,
      status: 'denied',
    });

    const allowed = await ensureNotificationPermissions();

    expect(allowed).toBe(true);
    expect(mockNotifications.setNotificationChannelAsync).toHaveBeenCalledWith(
      'habit-reminders',
      expect.objectContaining({
        importance: Notifications.AndroidImportance.HIGH,
        name: 'Habit Reminders',
      })
    );
    expect(
      mockNotifications.setNotificationChannelAsync.mock.invocationCallOrder[0]
    ).toBeLessThan(
      mockNotifications.getPermissionsAsync.mock.invocationCallOrder[0]
    );
    expect(
      mockNotifications.setNotificationChannelAsync.mock.invocationCallOrder[0]
    ).toBeLessThan(
      mockNotifications.requestPermissionsAsync.mock.invocationCallOrder[0]
    );
  });

  it('uses read-only permission checks for restore reschedules', async () => {
    mockNotifications.getPermissionsAsync.mockResolvedValue({ granted: true });

    const scheduled = await rescheduleHabitReminderFromSettings({
      _id: 'habit123',
      name: 'Read',
      reminderTime: '06:45',
      remindersEnabled: true,
    });

    expect(scheduled).toBe(true);
    expect(mockNotifications.requestPermissionsAsync).not.toHaveBeenCalled();
    expect(mockNotifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  it('does not schedule restore reminders when existing permission is denied', async () => {
    mockNotifications.getPermissionsAsync.mockResolvedValue({
      granted: false,
      status: 'denied',
    });

    const scheduled = await rescheduleHabitReminderFromSettings({
      _id: 'habit123',
      name: 'Read',
      reminderTime: '06:45',
      remindersEnabled: true,
    });

    expect(scheduled).toBe(false);
    expect(mockNotifications.requestPermissionsAsync).not.toHaveBeenCalled();
    expect(mockNotifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('treats iOS provisional notification settings as permission granted', async () => {
    mockNotifications.getPermissionsAsync.mockResolvedValue({
      granted: false,
      ios: { status: 3 },
      status: 'undetermined',
    });

    await expect(hasNotificationPermissions()).resolves.toBe(true);
  });

  it('cancels the deterministic identifier even when no scheduled notifications are returned', async () => {
    await cancelHabitReminder('habit123');

    expect(
      mockNotifications.cancelScheduledNotificationAsync
    ).toHaveBeenCalledWith('habit-reminder-habit123');
  });

  it('also cancels legacy scheduled reminders matched by habitId data', async () => {
    mockNotifications.getAllScheduledNotificationsAsync.mockResolvedValue([
      {
        content: { data: { habitId: 'habit123' } },
        identifier: 'legacy-id',
      },
      {
        content: { data: { habitId: 'habit123', type: 'streakAtRisk' } },
        identifier: 'streak-id',
      },
      {
        content: { data: { habitId: 'otherHabit' } },
        identifier: 'other-id',
      },
    ] as Awaited<
      ReturnType<typeof Notifications.getAllScheduledNotificationsAsync>
    >);

    await cancelHabitReminder('habit123');

    expect(
      mockNotifications.cancelScheduledNotificationAsync
    ).toHaveBeenCalledWith('habit-reminder-habit123');
    expect(
      mockNotifications.cancelScheduledNotificationAsync
    ).toHaveBeenCalledWith('legacy-id');
    expect(
      mockNotifications.cancelScheduledNotificationAsync
    ).not.toHaveBeenCalledWith('streak-id');
    expect(
      mockNotifications.cancelScheduledNotificationAsync
    ).not.toHaveBeenCalledWith('other-id');
  });

  it('builds the same deterministic identifier used for scheduling and cancellation', () => {
    expect(getHabitReminderNotificationIdentifier('abc')).toBe(
      'habit-reminder-abc'
    );
  });

  it('reschedules from saved reminder settings after restore', async () => {
    const scheduled = await rescheduleHabitReminderFromSettings({
      _id: 'habit123',
      name: 'Read',
      reminderTime: '06:45',
      remindersEnabled: true,
    });

    expect(scheduled).toBe(true);
    expect(mockNotifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: 'habit-reminder-habit123',
        trigger: expect.objectContaining({ hour: 6, minute: 45 }),
      })
    );
  });

  it('skips reschedule when saved reminders are disabled', async () => {
    const scheduled = await rescheduleHabitReminderFromSettings({
      _id: 'habit123',
      name: 'Read',
      reminderTime: '06:45',
      remindersEnabled: false,
    });

    expect(scheduled).toBe(false);
    expect(mockNotifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});
