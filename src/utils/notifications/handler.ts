import * as Notifications from 'expo-notifications';

/**
 * Notification Configuration
 *
 * Note: The warning about expo-notifications in Expo Go is expected.
 * Remote (push) notifications require a development build as of SDK 53+.
 * Local/scheduled notifications (used by this app) work fine in Expo Go.
 *
 * To suppress the warning, use a development build instead of Expo Go:
 * https://docs.expo.dev/develop/development-builds/introduction/
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
