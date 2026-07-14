/**
 * Notification Permissions
 *
 * Handles requesting and checking notification permissions.
 * Manages platform-specific permission flows (iOS/Native Handset).
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { configureAndroidChannel } from './channels';

function isNotificationsPermissionGranted(permissions: unknown): boolean {
  if (!permissions || typeof permissions !== 'object') {
    return false;
  }

  const granted = (permissions as { granted?: unknown }).granted;
  if (granted === true) {
    return true;
  }

  const status = (permissions as { status?: unknown }).status;
  if (status === 'granted') {
    return true;
  }

  const ios = (permissions as { ios?: unknown }).ios;
  if (ios && typeof ios === 'object') {
    const iosStatus = (ios as { status?: unknown }).status;
    // iOS: 0=NOT_DETERMINED, 1=DENIED, 2=AUTHORIZED, 3=PROVISIONAL, 4=EPHEMERAL
    if (typeof iosStatus === 'number' && iosStatus >= 2) {
      return true;
    }
  }

  return false;
}

export async function ensureNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    await configureAndroidChannel();

    const currentPermissions = await Notifications.getPermissionsAsync();

    if (isNotificationsPermissionGranted(currentPermissions)) {
      return true;
    }

    const requestedPermissions = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });

    if (isNotificationsPermissionGranted(requestedPermissions)) {
      return true;
    }

    return false;
  } catch (error) {
    if (__DEV__) console.error('ensureNotificationPermissions failed', error);
    return false;
  }
}

export async function hasNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    await configureAndroidChannel();
    const currentPermissions = await Notifications.getPermissionsAsync();
    return isNotificationsPermissionGranted(currentPermissions);
  } catch (error) {
    if (__DEV__) console.error('hasNotificationPermissions failed', error);
    return false;
  }
}
