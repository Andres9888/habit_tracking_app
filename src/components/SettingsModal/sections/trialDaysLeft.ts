/**
 * Whole days remaining before a trial expires, floored at 0.
 *
 * Shared by the two surfaces that render `TrialCard`: the main settings page
 * (`ProSettingsCard`) and the Account sub-page (`PremiumStatus`).
 */
export function daysLeftUntil(expirationDate: Date | null): number {
  if (!expirationDate) return 0;
  return Math.max(
    0,
    Math.ceil((expirationDate.getTime() - Date.now()) / 86_400_000)
  );
}
