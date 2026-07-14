/**
 * Notification startup initialization.
 *
 * Expo requires foreground presentation behavior to be registered once, before
 * notifications are delivered while the app is open.
 */

import * as Notifications from 'expo-notifications';

export function initNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}
