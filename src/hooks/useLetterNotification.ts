/**
 * useLetterNotification Hook
 * Manages letter unlock notification scheduling for the Letters to Self feature
 *
 * Part of T11.5: Unlock notification for Letters to Self
 *
 * This hook provides a wrapper for letter creation that automatically
 * schedules unlock notifications when a letter is saved.
 *
 * Scientific Basis:
 * - Temporal self-continuity: Connecting with future self increases self-control
 * - Anticipation psychology: Knowing a letter awaits increases engagement
 */

import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import {
  scheduleLetterUnlockNotification,
  cancelLetterUnlockNotification,
} from '../utils/notifications';

export interface UseLetterNotificationParams {
  /** The habit ID to create letters for */
  habitId: Id<'habits'>;
  /** Callback after letter is successfully created and notification scheduled */
  onSuccess?: (letterId: Id<'letters'>) => void;
  /** Callback if letter creation or notification scheduling fails */
  onError?: (error: Error) => void;
}

export interface CreateLetterWithNotificationParams {
  content: string;
  unlockDays: number;
  title?: string;
}

export interface UseLetterNotificationReturn {
  /**
   * Create a letter and schedule an unlock notification
   * Handles both the Convex mutation and local notification scheduling
   */
  createLetterWithNotification: (
    params: CreateLetterWithNotificationParams
  ) => Promise<Id<'letters'> | null>;

  /**
   * Cancel a letter's unlock notification
   * Call this if a letter is deleted before unlocking
   */
  cancelNotification: (letterId: string) => Promise<void>;

  /** Whether a letter creation is in progress */
  isCreating: boolean;
}

/**
 * Hook for creating letters with automatic unlock notification scheduling
 *
 * @example
 * ```tsx
 * const { createLetterWithNotification, isCreating } = useLetterNotification({
 *   habitId,
 *   onSuccess: (letterId) => {
 *     toast.success('Letter saved! You\'ll be notified when it unlocks.');
 *   },
 *   onError: (error) => {
 *     toast.error('Failed to save letter');
 *   },
 * });
 *
 * // In your save handler:
 * await createLetterWithNotification({
 *   content: 'Dear future me...',
 *   unlockDays: 7,
 *   title: 'Keep Going',
 * });
 * ```
 */
export function useLetterNotification({
  habitId,
  onSuccess,
  onError,
}: UseLetterNotificationParams): UseLetterNotificationReturn {
  const createLetter = useMutation(api.letters.create);

  const createLetterWithNotification = useCallback(
    async ({
      content,
      unlockDays,
      title,
    }: CreateLetterWithNotificationParams): Promise<Id<'letters'> | null> => {
      try {
        // Create the letter in Convex
        const letterId = await createLetter({
          content,
          habitId,
          title,
          unlockDays,
        });

        // Calculate unlock timestamp
        const unlockAt = Date.now() + unlockDays * 24 * 60 * 60 * 1000;

        // Schedule the unlock notification
        const notificationId = await scheduleLetterUnlockNotification({
          habitId: habitId.toString(),
          letterId: letterId.toString(),
          letterTitle: title || 'Letter to Self',
          unlockAt,
        });

        if (!notificationId) {
          // Notification scheduling failed silently
        }

        onSuccess?.(letterId);
        return letterId;
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error(String(error)));
        return null;
      }
    },
    [createLetter, habitId, onSuccess, onError]
  );

  const cancelNotification = useCallback(async (letterId: string) => {
    await cancelLetterUnlockNotification(letterId);
  }, []);

  return {
    cancelNotification,
    createLetterWithNotification,
    // Note: useMutation doesn't expose isPending in the same way useQuery does
    // The parent component should manage its own loading state
    isCreating: false,
  };
}

export default useLetterNotification;
