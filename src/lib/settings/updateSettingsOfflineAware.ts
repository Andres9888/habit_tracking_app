/**
 * Offline-aware settings update.
 *
 * Settings changes already apply locally (useSettingsLocalPrefs) for instant
 * feedback, so there is no optimistic store to manage here — we only need the
 * write to survive offline. Queues the full sanitized document as a single
 * coalesced `updateSettings` operation (whole-document last-write-wins).
 */

import { getOfflineQueueManager, isNetworkError } from '../offline';
import { sanitizeSettingsPayload } from './sanitizeSettingsPayload';
import { updateSettingsWithFallback } from './updateSettingsWithFallback';

type UpdateSettingsFn = (args: Record<string, unknown>) => Promise<unknown>;

function enqueueSettings(document: Record<string, unknown>): void {
  getOfflineQueueManager().enqueue('updateSettings', {
    settings: sanitizeSettingsPayload(document),
  });
}

export async function updateSettingsOfflineAware(
  updateSettings: UpdateSettingsFn,
  document: Record<string, unknown>,
  isOnline: boolean
): Promise<void> {
  if (!isOnline) {
    enqueueSettings(document);
    return;
  }
  try {
    await updateSettingsWithFallback(updateSettings, document);
  } catch (error) {
    if (isNetworkError(error)) {
      enqueueSettings(document);
      return;
    }
    throw error;
  }
}
