import * as Notifications from 'expo-notifications';

let didInitializeNotifications = false;

export function initializeNotifications(): void {
  if (didInitializeNotifications) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  didInitializeNotifications = true;
}
