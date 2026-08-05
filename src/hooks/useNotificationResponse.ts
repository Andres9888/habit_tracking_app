/**
 * useNotificationResponse Hook
 * Handles notification tap responses
 *
 * Routes notification taps to the appropriate handler:
 * - Habit reminders → Habit Detail Screen
 */

import { useEffect, useRef, useCallback } from 'react';
import type { NotificationResponse } from 'expo-notifications';

type NotificationsModule = typeof import('expo-notifications');

export interface NotificationResponseHandler {
  /** Called when a habit notification is tapped */
  onHabitNotificationTap: (habitId: string) => void;
}

export function useNotificationResponse(handlers: NotificationResponseHandler) {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const handleNotificationResponse = useCallback(
    (response: NotificationResponse) => {
      const data = response.notification.request.content.data;

      if (!data || typeof data !== 'object') {
        return;
      }

      if ('habitId' in data) {
        const habitId = data.habitId;

        if (typeof habitId === 'string' && habitId.length > 0) {
          handlersRef.current.onHabitNotificationTap(habitId);
        }
      }
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    let subscription: { remove: () => void } | null = null;

    const setup = async () => {
      let Notifications: NotificationsModule;

      try {
        Notifications = await import('expo-notifications');
      } catch (error) {
        if (__DEV__) {
          console.warn(
            '[useNotificationResponse] Failed to load notifications module:',
            error
          );
        }
        return;
      }

      if (!mounted) return;

      subscription = Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
      );

      try {
        const response = await Notifications.getLastNotificationResponseAsync();
        if (response && mounted) {
          handleNotificationResponse(response);
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('Error getting last notification response:', error);
        }
      }
    };

    void setup();

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, [handleNotificationResponse]);

  return {
    _triggerResponse: handleNotificationResponse,
  };
}

export default useNotificationResponse;
