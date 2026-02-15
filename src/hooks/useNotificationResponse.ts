/**
 * useNotificationResponse Hook
 * Handles notification tap responses for the Motivation System
 *
 * Part of T7.8: Trigger ActivationModal from notification tap
 * Part of T11.5: Handle letter unlock notification taps
 *
 * This hook listens for notification responses (when user taps a notification)
 * and routes to the appropriate handler based on notification type:
 * - Habit reminders → ActivationModal
 * - Letter unlocks → Letter reading modal
 *
 * Scientific Basis:
 * - Implementation intentions (Gollwitzer): 2-3x follow-through when prompted at right moment
 * - Context-aware intervention: Showing motivation content when user is primed to act
 * - Temporal self-continuity: Letters from past self increase self-control (Mischel)
 */

import { useEffect, useRef, useCallback } from 'react';

import type { NotificationResponse } from 'expo-notifications';
import * as Notifications from 'expo-notifications';

import { NOTIFICATION_TYPE_LETTER_UNLOCK } from '../utils/notifications';

export interface NotificationResponseHandler {
  /** Called when a habit notification is tapped */
  onHabitNotificationTap: (habitId: string) => void;
  /** Called when a letter unlock notification is tapped */
  onLetterNotificationTap?: (letterId: string, habitId: string) => void;
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

  const handleNotificationResponse = useCallback(
    (response: NotificationResponse) => {
      const data = response.notification.request.content.data;

      if (!data || typeof data !== 'object') {
        return;
      }

      // Check if this is a letter unlock notification
      if ('type' in data && data.type === NOTIFICATION_TYPE_LETTER_UNLOCK) {
        const letterId = 'letterId' in data ? data.letterId : null;
        const habitId = 'habitId' in data ? data.habitId : null;

        if (
          typeof letterId === 'string' &&
          letterId.length > 0 &&
          typeof habitId === 'string' &&
          habitId.length > 0
        ) {
          handlersRef.current.onLetterNotificationTap?.(letterId, habitId);
        }
        return;
      }

      // Check if this is a habit reminder notification (legacy format without type)
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
    // Subscribe to notification response events (when user taps notification)
    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    // Check for any notification that launched the app
    void Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (response) {
          handleNotificationResponse(response);
        }
      })
      .catch((error) => {
        if (__DEV__) console.warn('Error getting last notification response:', error);
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
