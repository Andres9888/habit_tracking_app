/**
 * useNotificationResponse Hook
 * Handles notification tap responses for the Motivation System
 *
 * Part of T7.8: Trigger ActivationModal from notification tap
 *
 * This hook listens for notification responses (when user taps a notification)
 * and extracts the habitId to open the ActivationModal.
 *
 * Scientific Basis:
 * - Implementation intentions (Gollwitzer): 2-3x follow-through when prompted at right moment
 * - Context-aware intervention: Showing motivation content when user is primed to act
 */

import { useEffect, useRef, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import type { NotificationResponse } from 'expo-notifications';

export interface NotificationResponseHandler {
  /** Called when a habit notification is tapped */
  onHabitNotificationTap: (habitId: string) => void;
}

/**
 * Hook to handle notification response events
 *
 * @param handlers - Callbacks for handling different notification types
 * @returns Object with methods to programmatically trigger responses (for testing)
 *
 * @example
 * ```tsx
 * useNotificationResponse({
 *   onHabitNotificationTap: (habitId) => {
 *     openActivationModalById(habitId);
 *   },
 * });
 * ```
 */
export function useNotificationResponse(handlers: NotificationResponseHandler) {
  const handlersRef = useRef(handlers);

  // Keep handlers ref updated without re-subscribing to notifications
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const handleNotificationResponse = useCallback((response: NotificationResponse) => {
    const data = response.notification.request.content.data;

    // Check if this is a habit reminder notification
    if (data && typeof data === 'object' && 'habitId' in data) {
      const habitId = data.habitId;

      if (typeof habitId === 'string' && habitId.length > 0) {
        console.log('[useNotificationResponse] Habit notification tapped:', habitId);
        handlersRef.current.onHabitNotificationTap(habitId);
      }
    }
  }, []);

  useEffect(() => {
    // Subscribe to notification response events (when user taps notification)
    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    // Check for any notification that launched the app
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        handleNotificationResponse(response);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [handleNotificationResponse]);

  // Return for testing purposes
  return {
    /** Manually trigger a notification response (for testing) */
    _triggerResponse: handleNotificationResponse,
  };
}

export default useNotificationResponse;
