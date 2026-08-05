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

/**
 * Status-only check — never prompts. Used by the settings permission guard,
 * which must not trigger an OS dialog just by rendering.
 *
 * Returns `true` when the status can't be read: an unverifiable permission is
 * not evidence of a denied one, and a false warning is worse than none.
 */
export async function hasNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    const permissions = await Notifications.getPermissionsAsync();
    return isNotificationsPermissionGranted(permissions);
  } catch (error) {
    if (__DEV__) console.error('hasNotificationPermissions failed', error);
    return true;
  }
}

export async function ensureNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    const currentPermissions = await Notifications.getPermissionsAsync();

    if (isNotificationsPermissionGranted(currentPermissions)) {
      await configureAndroidChannel();
      return true;
    }

    const requestedPermissions = await Notifications.requestPermissionsAsync();

    if (isNotificationsPermissionGranted(requestedPermissions)) {
      await configureAndroidChannel();
      return true;
    }

    return false;
  } catch (error) {
    if (__DEV__) console.error('ensureNotificationPermissions failed', error);
    return false;
  }
}
