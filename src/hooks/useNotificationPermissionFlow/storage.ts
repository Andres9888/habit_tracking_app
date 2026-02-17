/**
 * AsyncStorage keys and helpers for notification permission flow state.
 *
 * Tracks:
 * - Whether the user has ever completed a habit (trigger condition)
 * - The permission flow status (not_asked / granted / denied / skipped)
 */

import { safeGetString, safeSetString } from '../../utils/storage/safeStorage';
import type { NotificationPermissionStatus } from './types';

const FIRST_HABIT_COMPLETED_KEY = '@chain_day:first_habit_completed_at';
const NOTIF_PERMISSION_STATUS_KEY = '@chain_day:notif_permission_status';

function isPermissionStatus(v: string): v is NotificationPermissionStatus {
  return ['not_asked', 'pre_screen_shown', 'granted', 'denied', 'skipped'].includes(v);
}

/** Record that the user has completed their very first habit */
export async function markFirstHabitCompleted(): Promise<void> {
  await safeSetString(FIRST_HABIT_COMPLETED_KEY, String(Date.now()));
}

/** Check whether the user has previously completed at least one habit */
export async function hasCompletedFirstHabit(): Promise<boolean> {
  const value = await safeGetString(FIRST_HABIT_COMPLETED_KEY, '');
  return value !== '';
}

/** Persist the current notification permission flow status */
export async function savePermissionStatus(
  status: NotificationPermissionStatus
): Promise<void> {
  await safeSetString(NOTIF_PERMISSION_STATUS_KEY, status);
}

/** Load the persisted notification permission flow status */
export async function loadPermissionStatus(): Promise<NotificationPermissionStatus> {
  const raw = await safeGetString(NOTIF_PERMISSION_STATUS_KEY, 'not_asked');
  return isPermissionStatus(raw) ? raw : 'not_asked';
}
