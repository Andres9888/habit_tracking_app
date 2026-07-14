import * as Notifications from 'expo-notifications';

import { scheduleHabitReminder } from '../habitReminders';

const mockNotifications = Notifications as jest.Mocked<typeof Notifications>;

describe('habit reminder deep links', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNotifications.getAllScheduledNotificationsAsync.mockResolvedValue([]);
    mockNotifications.scheduleNotificationAsync.mockResolvedValue(
      'native-notification-id'
    );
  });

  it('includes habit detail routing data in scheduled reminder payloads', async () => {
    const scheduled = await scheduleHabitReminder({
      body: 'Time to check in.',
      habitId: 'habit123',
      reminderTime: new Date('2026-07-14T07:30:00'),
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
      })
    );
  });
});
