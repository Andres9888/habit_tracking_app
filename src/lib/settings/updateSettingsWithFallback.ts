import { sanitizeSettingsPayload } from './sanitizeSettingsPayload';

type MutationArgs = Record<string, unknown>;
type UpdateSettingsFn = (args: MutationArgs) => Promise<unknown>;

function isShallowEqual(a: Record<string, unknown>, b: Record<string, unknown>) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a[key] === b[key]);
}

export async function updateSettingsWithFallback(
  updateSettings: UpdateSettingsFn,
  payload: Record<string, unknown>
): Promise<void> {
  const safePayload = sanitizeSettingsPayload(payload);

  try {
    await updateSettings(payload);
    return;
  } catch (error) {
    if (isShallowEqual(payload, safePayload)) {
      throw error;
    }
    try {
      await updateSettings(safePayload);
    } catch (fallbackError) {
      if (__DEV__) {
        console.error('[settings] Sanitized settings fallback failed', {
          error,
          fallbackError,
        });
      }
      throw fallbackError;
    }
  }
}
