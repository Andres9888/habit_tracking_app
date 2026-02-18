/**
 * useNotificationPermissionFlow
 *
 * Smart notification permission flow that defers the OS prompt until a
 * meaningful moment: after the user completes their first habit.
 *
 * Flow:
 *  1. User taps a habit to mark it complete (day-tap or activation).
 *  2. `onHabitCompleted` is called with the habit id.
 *  3. If this is the first-ever completion AND permission hasn't been addressed:
 *       → set `prePermissionVisible = true`
 *  4. User sees the pre-permission explanation screen.
 *  5a. User taps "Enable Notifications":
 *       → request OS permission, update status, hide modal.
 *  5b. User taps "Maybe Later":
 *       → record status as 'skipped', hide modal.
 *
 * The hook is safe to call on every render; re-checks are no-ops once
 * the status moves past 'not_asked'.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { configureAndroidChannel } from '../../utils/notifications/channels';
import { getOSNotificationPermissionStatus } from '../../utils/notifications/permissions';
import {
  hasCompletedFirstHabit,
  loadPermissionStatus,
  markFirstHabitCompleted,
  savePermissionStatus,
} from './storage';
import type {
  NotificationPermissionStatus,
  UseNotificationPermissionFlowResult,
} from './types';

export function useNotificationPermissionFlow(): UseNotificationPermissionFlowResult {
  const [prePermissionVisible, setPrePermissionVisible] = useState(false);
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermissionStatus>('not_asked');
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  // Track habit completion processing to prevent race conditions
  // Use a set of in-flight habit IDs rather than a single boolean
  const processingRef = useRef(new Set<string>());

  // Load persisted state on mount; also sync with actual OS status so we
  // don't show the flow if the user already granted/denied via OS settings.
  useEffect(() => {
    async function init() {
      const [stored, osStatus] = await Promise.all([
        loadPermissionStatus(),
        getOSNotificationPermissionStatus(),
      ]);

      // If OS already has a definitive status, sync it so we don't re-ask
      if (osStatus === 'granted' && stored !== 'granted') {
        await savePermissionStatus('granted');
        setPermissionStatus('granted');
        return;
      }
      if (osStatus === 'denied' && stored === 'not_asked') {
        // User denied via some other flow; mark as denied so we don't show pre-screen
        await savePermissionStatus('denied');
        setPermissionStatus('denied');
        return;
      }

      setPermissionStatus(stored);
    }

    init().catch(() => {
      // Non-critical; default 'not_asked' is safe
    });
  }, []);

  /**
   * Call this whenever a habit is toggled to "completed".
   * It checks whether to show the pre-permission screen.
   */
  const onHabitCompleted = useCallback(
    async (habitId: string): Promise<void> => {
      // Skip on web — push notifications not supported
      if (Platform.OS === 'web') return;

      // Guard against double invocation for the same habit
      if (processingRef.current.has(habitId)) return;
      processingRef.current.add(habitId);

      try {
        // Load fresh status each time to avoid stale closure
        const currentStatus = await loadPermissionStatus();

        // Only show the flow if we've never addressed permissions before
        if (currentStatus !== 'not_asked') return;

        const alreadyCompletedBefore = await hasCompletedFirstHabit();

        // Record that the user has now completed a habit
        await markFirstHabitCompleted();

        if (!alreadyCompletedBefore) {
          // First ever completion — show the pre-permission screen
          await savePermissionStatus('pre_screen_shown');
          setPermissionStatus('pre_screen_shown');
          setPrePermissionVisible(true);
        }
      } finally {
        // Always clean up the processing guard
        processingRef.current.delete(habitId);
      }
    },
    []
  );

  /**
   * User tapped "Enable Notifications" on the pre-permission screen.
   * Show the OS permission prompt.
   */
  const onEnableNotifications = useCallback(async (): Promise<void> => {
    setIsRequestingPermission(true);
    try {
      const result = await Notifications.requestPermissionsAsync();

      const granted =
        result.granted ||
        result.status === 'granted' ||
        (result.ios && (result.ios.status ?? 0) >= 2);

      const newStatus: NotificationPermissionStatus = granted
        ? 'granted'
        : 'denied';

      if (granted && Platform.OS === 'android') {
        await configureAndroidChannel();
      }

      await savePermissionStatus(newStatus);
      setPermissionStatus(newStatus);
    } catch {
      // Best-effort; fall through to hide modal
    } finally {
      setIsRequestingPermission(false);
      setPrePermissionVisible(false);
    }
  }, []);

  /**
   * User tapped "Maybe Later" — dismiss without requesting.
   */
  const onSkipNotifications = useCallback(async (): Promise<void> => {
    try {
      await savePermissionStatus('skipped');
      setPermissionStatus('skipped');
    } catch {
      // Non-critical; state will still be updated
    } finally {
      setPrePermissionVisible(false);
    }
  }, []);

  return {
    isRequestingPermission,
    onEnableNotifications,
    onHabitCompleted,
    onSkipNotifications,
    permissionStatus,
    prePermissionVisible,
  };
}
